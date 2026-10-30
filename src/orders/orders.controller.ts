import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Res,
  Route,
  SuccessResponse,
  Tags,
  type TsoaResponse,
} from "tsoa";
import { ObjectId } from "mongodb";

import { getDatabase } from "../db";
import type { ErrorResponse } from "../responses";
import { getOrdersStorage } from "./memory-adapter";
import { getWarehouseStorage } from "../warehouse/memory-adapter";
import type { FulfillmentItem } from "./types";

/** Map of book ID to quantity. */
export interface OrderBooks {
  [bookId: string]: number;
}

/** Request body for placing an order. */
export interface CreateOrderRequest {
  /** IDs of the books being ordered. At least one is required. */
  books: string[];
}

export interface CreateOrderResponse {
  orderId: string;
}

export interface OrderResponse {
  orderId: string;
  books: OrderBooks;
  fulfilled: boolean;
}

/** Request body for fulfilling an order. */
export interface FulfillmentRequest {
  /** Exactly which physical copies came off which shelf. */
  fulfillment: FulfillmentItem[];
}

export interface FulfillmentResponse {
  success: boolean;
}

/** Additional detail returned when book IDs cannot be resolved. */
export interface InvalidBookIdsResponse extends ErrorResponse {
  invalidIds: string[];
}

/**
 * Returns the IDs that are either not valid ObjectIds or do not exist in the
 * books collection. One query instead of one per book.
 */
async function findMissingBookIds(bookIds: string[]): Promise<string[]> {
  const missing: string[] = [];
  const resolvable: Array<{ original: string; objectId: ObjectId }> = [];

  for (const bookId of bookIds) {
    try {
      resolvable.push({
        original: bookId,
        objectId: ObjectId.createFromHexString(bookId),
      });
    } catch {
      missing.push(bookId);
    }
  }

  if (resolvable.length > 0) {
    const found = await getDatabase()
      .collection("books")
      .find({ _id: { $in: resolvable.map((entry) => entry.objectId) } })
      .project({ _id: 1 })
      .toArray();

    const foundIds = new Set(found.map((doc) => doc._id.toHexString()));

    for (const entry of resolvable) {
      if (!foundIds.has(entry.objectId.toHexString())) {
        missing.push(entry.original);
      }
    }
  }

  return missing;
}

@Route("orders")
@Tags("Orders")
export class OrdersController extends Controller {
  /**
   * @summary Place an order
   * @description Orders one or more books. Every ID must resolve to a book
   * that exists, otherwise the order is rejected and the bad IDs are listed.
   */
  @Post()
  @SuccessResponse("201", "Created")
  public async createOrder(
    @Body() requestBody: CreateOrderRequest,
    @Res()
    badRequest: TsoaResponse<400, ErrorResponse | InvalidBookIdsResponse>,
  ): Promise<CreateOrderResponse> {
    const { books } = requestBody;

    if (!Array.isArray(books) || books.length === 0) {
      return badRequest(400, { error: "Order must contain at least one book" });
    }

    const invalidIds = await findMissingBookIds(books);
    if (invalidIds.length > 0) {
      return badRequest(400, { error: "Invalid book IDs", invalidIds });
    }

    try {
      const { orderId } = await getOrdersStorage().createOrder(books);
      this.setStatus(201);

      return { orderId };
    } catch (err) {
      return badRequest(400, { error: (err as Error).message });
    }
  }

  /**
   * @summary List orders
   * @description Returns orders oldest first. Pass `fulfilled` to see only
   * fulfilled (`true`) or only outstanding (`false`) orders.
   */
  @Get()
  public async listOrders(
    @Query() fulfilled?: boolean,
  ): Promise<OrderResponse[]> {
    const orders = await getOrdersStorage().listOrders(fulfilled);

    return orders.map((order) => ({
      orderId: order.orderId,
      books: order.books,
      fulfilled: order.fulfilled,
    }));
  }

  /**
   * @summary Get one order
   * @description Fetches a single order by its ID.
   */
  @Get("{orderId}")
  public async getOrder(
    @Path() orderId: string,
    @Res() notFound: TsoaResponse<404, ErrorResponse>,
  ): Promise<OrderResponse> {
    const order = await getOrdersStorage().getOrder(orderId);

    if (!order) {
      return notFound(404, { error: "Order not found" });
    }

    return {
      orderId: order.orderId,
      books: order.books,
      fulfilled: order.fulfilled,
    };
  }

  /**
   * @summary Fulfil an order
   * @description Record exactly which physical copies came off which shelf.
   * Supplied quantities must match the order exactly, and every listed book
   * must belong to the order. Stock is removed as a unit: if any shelf cannot
   * supply its copies, everything already taken is put back and the order
   * stays unfulfilled.
   */
  @Post("{orderId}/fulfill")
  public async fulfillOrder(
    @Path() orderId: string,
    @Body() requestBody: FulfillmentRequest,
    @Res() notFound: TsoaResponse<404, ErrorResponse>,
    @Res() badRequest: TsoaResponse<400, ErrorResponse>,
  ): Promise<FulfillmentResponse> {
    const { fulfillment } = requestBody;
    const ordersStorage = getOrdersStorage();
    const warehouse = getWarehouseStorage();

    const order = await ordersStorage.getOrder(orderId);
    if (!order) {
      return notFound(404, { error: "Order not found" });
    }

    if (order.fulfilled) {
      return badRequest(400, { error: "Order already fulfilled" });
    }

    const providedCounts: Record<string, number> = {};
    for (const item of fulfillment) {
      providedCounts[item.book] =
        (providedCounts[item.book] ?? 0) + item.numberOfBooks;
    }

    for (const [bookId, required] of Object.entries(order.books)) {
      const provided = providedCounts[bookId] ?? 0;
      if (provided !== required) {
        return badRequest(400, {
          error: `Fulfillment mismatch for book ${bookId}: required ${required}, provided ${provided}`,
        });
      }
    }

    for (const item of fulfillment) {
      if (!(item.book in order.books)) {
        return badRequest(400, {
          error: `Book ${item.book} is not part of order ${orderId}`,
        });
      }
    }

    const applied: FulfillmentItem[] = [];
    try {
      for (const item of fulfillment) {
        await warehouse.removeBooksFromShelf(
          item.book,
          item.numberOfBooks,
          item.shelf,
        );
        applied.push(item);
      }

      await ordersStorage.fulfillOrder(orderId);
    } catch (err) {
      for (let i = applied.length - 1; i >= 0; i--) {
        const item = applied[i];
        try {
          await warehouse.placeBooksOnShelf(
            item.book,
            item.numberOfBooks,
            item.shelf,
          );
        } catch {
          continue;
        }
      }

      return badRequest(400, { error: (err as Error).message });
    }

    return { success: true };
  }
}
