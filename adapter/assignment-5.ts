import {
  BooksApi,
  Configuration,
  OrdersApi,
  WarehouseApi,
} from "../client-sdk";

const API_BASE = "http://localhost:3000";

const config = new Configuration({ basePath: API_BASE });
const books = new BooksApi(config);
const orders = new OrdersApi(config);
const warehouse = new WarehouseApi(config);

export type BookID = string;
export type ShelfId = string;
export type OrderId = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
}

export interface Filter {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

// Multiple filters are ORed: a book matches if any one of them matches.
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  if (!filters || filters.length === 0) {
    return await books.listBooks({});
  }

  const pages = await Promise.all(
    filters.map((filter) =>
      books.listBooks({
        from: filter.from,
        to: filter.to,
        name: filter.name,
        author: filter.author,
      }),
    ),
  );

  const byId = new Map<BookID, Book>();
  for (const page of pages) {
    for (const book of page) {
      byId.set(book.id, book);
    }
  }

  return Array.from(byId.values());
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  const saved = await books.createBook({
    createBookRequest: {
      id: book.id,
      name: book.name,
      author: book.author,
      description: book.description,
      price: book.price,
      image: book.image,
    },
  });

  return saved.id;
}

async function removeBook(book: BookID): Promise<void> {
  await books.deleteBook({ bookId: book });
}

async function lookupBookById(bookId: BookID): Promise<Book> {
  return await books.getBook({ bookId });
}

async function placeBooksOnShelf(
  bookId: BookID,
  numberOfBooks: number,
  shelf: ShelfId,
): Promise<void> {
  await warehouse.placeBooksOnShelf({
    placeBooksRequest: { bookId, numberOfBooks, shelf },
  });
}

async function findBookOnShelf(
  bookId: BookID,
): Promise<Array<{ shelf: ShelfId; count: number }>> {
  return await warehouse.getBookLocations({ bookId });
}

async function orderBooks(bookIds: BookID[]): Promise<{ orderId: OrderId }> {
  return await orders.createOrder({
    createOrderRequest: { books: bookIds },
  });
}

async function fulfilOrder(
  orderId: OrderId,
  booksFulfilled: Array<{
    book: BookID;
    shelf: ShelfId;
    numberOfBooks: number;
  }>,
): Promise<void> {
  await orders.fulfillOrder({
    orderId,
    fulfillmentRequest: { fulfillment: booksFulfilled },
  });
}

async function listOrders(): Promise<
  Array<{ orderId: OrderId; books: Record<BookID, number> }>
> {
  const all = await orders.listOrders({});

  return all.map((order) => ({
    orderId: order.orderId,
    books: order.books,
  }));
}

const assignment = "assignment-5";

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById,
};
