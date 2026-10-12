import { MongoClient, type Db, type Collection } from "mongodb";
import type { BookDocument } from "./books/types";


const uri = (global as any).MONGO_URI ?? "mongodb://mongo";

export const client = new MongoClient(uri);

export interface BookDatabaseAccessor {
  database: Db;
  books: Collection<BookDocument>;
}

export function getBookDatabase(): BookDatabaseAccessor {
  const databaseName =
    (global as any).MONGO_URI !== undefined
      ? Math.floor(Math.random() * 100000).toString()
      : "books-database";

  const database = client.db(databaseName);
  const books = database.collection<BookDocument>("books");

  return { database, books };
}
