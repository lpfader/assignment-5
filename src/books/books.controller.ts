import {
  Body,
  Controller,
  Delete,
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
import type { BookDatabaseAccessor } from "../database_access";
import type { BookDocument } from "./types";
import type { ErrorResponse } from "../responses";
import { getWarehouseStorage } from "../warehouse/memory-adapter";
import { createBook as insertBook } from "./create";
import { listBooks as queryBooks } from "./list";
import { lookupBookById } from "./lookup";

/** A book in the catalogue, together with how many copies are in stock. */
export interface BookResponse {
  id: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

/** The fields required to create or update a book. */
export interface CreateBookRequest {
  /**
   * When supplied, the book with this ID is updated instead of a new one
   * being created. Omit it to create a new book.
   */
  id?: string;
  /** Title of the book. */
  name: string;
  /** Who wrote it. */
  author: string;
  /** Short blurb shown on the storefront. */
  description: string;
  /** Price in dollars. Must be zero or greater. */
  price: number;
  /** URL of the cover image. */
  image: string;
}

function bookDatabase(): BookDatabaseAccessor {
  const database = getDatabase();
  return { database, books: database.collection<BookDocument>("books") };
}

async function withStock(
  book: Omit<BookResponse, "stock">,
): Promise<BookResponse> {
  const stock = await getWarehouseStorage().getTotalStock(book.id);
  return { ...book, stock };
}

@Route("books")
@Tags("Books")
export class BooksController extends Controller {
  /**
   * @summary List the books in the catalogue
   * @description Returns every book, optionally narrowed by a price range
   * and/or a name or author substring. Supplied filters are combined with AND.
   * Each book includes the total number of copies currently on shelves.
   */
  @Get()
  public async listBooks(
    @Query() from?: number,
    @Query() to?: number,
    @Query() name?: string,
    @Query() author?: string,
  ): Promise<BookResponse[]> {
    const hasFilter =
      from !== undefined ||
      to !== undefined ||
      (typeof name === "string" && name.trim() !== "") ||
      (typeof author === "string" && author.trim() !== "");

    const filters = hasFilter ? [{ from, to, name, author }] : [];
    const books = await queryBooks(filters, bookDatabase());

    return Promise.all(books.map((book) => withStock(book)));
  }

  /**
   * @summary Get one book
   * @description Looks up a single book by its ID, including its current stock.
   */
  @Get("{bookId}")
  public async getBook(
    @Path() bookId: string,
    @Res() notFound: TsoaResponse<404, ErrorResponse>,
  ): Promise<BookResponse> {
    const book = await lookupBookById(bookId, bookDatabase());

    if (!book) {
      return notFound(404, { error: `Book ${bookId} not found` });
    }

    return withStock(book);
  }

  /**
   * @summary Add or update a book
   * @description Creates a new book. If the body includes an `id`, the book
   * with that ID is updated instead, so this endpoint behaves as an upsert.
   * New books start with zero stock; use `POST /warehouse/shelves` to put
   * physical copies on a shelf.
   */
  @Post()
  @SuccessResponse("201", "Created")
  public async createBook(
    @Body() requestBody: CreateBookRequest,
    @Res() badRequest: TsoaResponse<400, ErrorResponse>,
  ): Promise<BookResponse> {
    const { id, ...fields } = requestBody;

    if (typeof fields.name !== "string" || fields.name.trim() === "") {
      return badRequest(400, { error: "name must not be empty" });
    }

    if (!Number.isFinite(fields.price) || fields.price < 0) {
      return badRequest(400, { error: "price must be zero or greater" });
    }

    if (id !== undefined) {
      let objectId: ObjectId;

      try {
        objectId = ObjectId.createFromHexString(id);
      } catch {
        return badRequest(400, { error: `id ${id} is not a valid book id` });
      }

      await getDatabase()
        .collection("books")
        .updateOne({ _id: objectId }, { $set: fields }, { upsert: true });

      const updated = await lookupBookById(id, bookDatabase());
      if (!updated) {
        return badRequest(400, { error: `Book ${id} could not be saved` });
      }

      return withStock(updated);
    }

    const created = await insertBook(fields, bookDatabase());
    this.setStatus(201);

    return withStock(created);
  }

  /**
   * @summary Remove a book
   * @description Deletes a book from the catalogue. Any copies still on a
   * shelf are left in the warehouse.
   */
  @Delete("{bookId}")
  public async deleteBook(
    @Path() bookId: string,
    @Res() notFound: TsoaResponse<404, ErrorResponse>,
  ): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = ObjectId.createFromHexString(bookId);
    } catch {
      return notFound(404, { error: `Book ${bookId} not found` });
    }

    const result = await getDatabase()
      .collection("books")
      .deleteOne({ _id: objectId });

    if (result.deletedCount !== 1) {
      return notFound(404, { error: `Book ${bookId} not found` });
    }

    this.setStatus(204);
  }
}
