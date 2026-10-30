import {
  Body, Controller, Get, Path, Post, Res, Route,
  SuccessResponse, Tags, type TsoaResponse,
} from "tsoa";

import type { ErrorResponse } from "../responses";
import { getWarehouseStorage } from "./memory-adapter";
import type { ShelfStock } from "./types";

/** Request body for putting physical copies on a shelf. */
export interface PlaceBooksRequest {
  /** ID of the book being shelved. */
  bookId: string;
  /** How many physical copies to place. Must be a positive whole number. */
  numberOfBooks: number;
  /** Identifier of the shelf, for example `"A-12"`. */
  shelf: string;
}

/** Total number of physical copies of a book. */
export interface BookStockResponse {
  bookId: string;
  stock: number;
}

@Route("warehouse")
@Tags("Warehouse")
export class WarehouseController extends Controller {
  /**
   * @summary Put physical copies of a book on a shelf
   * @description Adds stock to a shelf. Calling this repeatedly for the same
   * book and shelf adds to the existing count rather than replacing it.
   * Responds with where copies of that book now live.
   */
  @Post("shelves")
  @SuccessResponse("201", "Created")
  public async placeBooksOnShelf(
    @Body() requestBody: PlaceBooksRequest,
    @Res() badRequest: TsoaResponse<400, ErrorResponse>,
  ): Promise<ShelfStock[]> {
    if (
      !Number.isInteger(requestBody.numberOfBooks) ||
      requestBody.numberOfBooks <= 0
    ) {
      return badRequest(400, {
        error: "numberOfBooks must be a positive whole number",
      });
    }

    const warehouse = getWarehouseStorage();

    try {
      await warehouse.placeBooksOnShelf(
        requestBody.bookId,
        requestBody.numberOfBooks,
        requestBody.shelf,
      );
    } catch (err) {
      return badRequest(400, { error: (err as Error).message });
    }

    this.setStatus(201);

    return warehouse.findBookOnShelf(requestBody.bookId);
  }

  /**
   * @summary Find which shelves hold a book
   * @description Returns one entry per shelf that currently has at least one
   * copy of the book. Books with no stock return an empty list.
   */
  @Get("books/{bookId}/locations")
  public async getBookLocations(
    @Path() bookId: string,
  ): Promise<ShelfStock[]> {
    return getWarehouseStorage().findBookOnShelf(bookId);
  }

  /**
   * @summary Get total stock for a book
   * @description Sums the copies of one book across every shelf.
   */
  @Get("books/{bookId}/stock")
  public async getBookStock(
    @Path() bookId: string,
  ): Promise<BookStockResponse> {
    const stock = await getWarehouseStorage().getTotalStock(bookId);

    return { bookId, stock };
  }
}