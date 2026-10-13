import { ObjectId } from "mongodb";
import type { BookDatabaseAccessor } from "../database_access";
import type { BookDocument } from "./types";

export async function lookupBookById(
  id: string,
  database: BookDatabaseAccessor
): Promise<{
  id: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
} | null> {
  try {
    const objectId = ObjectId.createFromHexString(id);
    const document = await database.books.findOne({ _id: objectId });

    if (!document) {
      return null;
    }

    return {
      id: document._id.toHexString(),
      name: document.name,
      author: document.author,
      description: document.description,
      price: document.price,
      image: document.image,
    };
  } catch {
    // invalid ObjectId
    return null;
  }
}
