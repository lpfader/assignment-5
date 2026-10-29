import { Body, Get, Post, Route, Tags, Path, Query } from "tsoa";
import { z } from "zod";
import { getOrdersStorage } from "./memory-adapter";
import { getWarehouseStorage } from "../warehouse/memory-adapter";
import { getDatabase } from "../db";
import { ObjectId } from "mongodb";
import type { FulfillmentItem } from "./types";

// Zod schemas
const CreateOrderSchema = z.object({
  books: z.array(z.string()).min(1),
});

const FulfillmentSchema = z.array(
  z.object({
    book: z.string(),
    shelf: z.string(),
    numberOfBooks: z.number().int().positive(),
  }),
);

@Route("orders")
@Tags("Orders")
export class OrdersController {
  @Post("/")
  public async createOrder(@Body() body: unknown) {
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error("Invalid request body");
    }

    const { books } = parsed.data;
    const ordersStorage = getOrdersStorage();

    // Validate book IDs exist
    const db = getDatabase();
    const collection = db.collection("books");
    const invalidIds: string[] = [];

    for (const bookId of books) {
      try {
        const objectId = ObjectId.createFromHexString(bookId);
        const book = await collection.findOne({ _id: objectId });
        if (!book) invalidIds.push(bookId);
      } catch {
        invalidIds.push(bookId);
      }
    }

    if (invalidIds.length > 0) {
      throw new Error(`Invalid book IDs: ${invalidIds.join(", ")}`);
    }

    return ordersStorage.createOrder(books);
  }

  @Get("/")
  public async listOrders(@Query() fulfilled?: "true" | "false") {
    const ordersStorage = getOrdersStorage();

    let fulfilledFilter: boolean | undefined;
    if (fulfilled === "true") fulfilledFilter = true;
    if (fulfilled === "false") fulfilledFilter = false;

    const orders = await ordersStorage.listOrders(fulfilledFilter);

    return orders.map((order) => ({
      orderId: order.orderId,
      books: order.books,
      fulfilled: order.fulfilled,
    }));
  }

  @Get("{orderId}")
  public async getOrder(@Path() orderId: string) {
    const ordersStorage = getOrdersStorage();
    const order = await ordersStorage.getOrder(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      orderId: order.orderId,
      books: order.books,
      fulfilled: order.fulfilled,
    };
  }

  @Post("{orderId}/fulfill")
  public async fulfillOrder(
    @Path() orderId: string,
    @Body() body: unknown,
  ) {
    const parsed = FulfillmentSchema.safeParse((body as any).fulfillment);
    if (!parsed.success) {
      throw new Error("Invalid fulfillment body");
    }

    const fulfillment = parsed.data;
    const ordersStorage = getOrdersStorage();
    const warehouse = getWarehouseStorage();

    const order = await ordersStorage.getOrder(orderId);
    if (!order) throw new Error("Order not found");
    if (order.fulfilled) throw new Error("Order already fulfilled");

    // Validate fulfillment counts
    const counts: Record<string, number> = {};
    for (const item of fulfillment) {
      counts[item.book] = (counts[item.book] ?? 0) + item.numberOfBooks;
    }

    for (const [bookId, required] of Object.entries(order.books)) {
      const provided = counts[bookId] ?? 0;
      if (provided !== required) {
        throw new Error(
          `Fulfillment mismatch for book ${bookId}: required ${required}, provided ${provided}`,
        );
      }
    }

    // Remove books from shelves
    for (const item of fulfillment) {
      await warehouse.removeBooksFromShelf(
        item.book,
        item.numberOfBooks,
        item.shelf,
      );
    }

    await ordersStorage.fulfillOrder(orderId);

    return { success: true };
  }
}
