import { MongoClient, type Db, type Collection } from "mongodb";
import type { BookDocument } from "./books/types";

export interface BookDatabaseAccessor {
  database: Db;
  books: Collection<BookDocument>;
}

export function getBookDatabase(): BookDatabaseAccessor {
  // Read MONGO_URI at call time, not import time
  const client = new MongoClient(process.env.MONGO_URI!);

  // Use one consistent database name across the whole project
  const database = client.db("mcmasterful-books");

  const books = database.collection<BookDocument>("books");

  return { database, books };
}
