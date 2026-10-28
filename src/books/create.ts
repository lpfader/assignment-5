import type { BookDatabaseAccessor } from "../database_access";
import type { BookDocument } from "./types";

export interface CreateBookInput {
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

export async function createBook(
  input: CreateBookInput,
  database: BookDatabaseAccessor,
): Promise<{
  id: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}> {
  const result = await database.books.insertOne(input satisfies BookDocument);

  return {
    id: result.insertedId.toHexString(),
    name: input.name,
    author: input.author,
    description: input.description,
    price: input.price,
    image: input.image,
  };
}
