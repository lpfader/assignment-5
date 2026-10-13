import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ObjectId } from "mongodb";

import { getBookDatabase, client } from "../../src/database_access";
import { lookupBookById } from "../../src/books/lookup";
import type { BookDocument } from "../../src/books/types";

describe("lookupBookById", () => {
  let db: ReturnType<typeof getBookDatabase>;

  beforeEach(async () => {
    db = getBookDatabase();
  });

  afterEach(async () => {
    await client.close();
  });

  it("returns a book when found by ID", async () => {
    const insertResult = await db.books.insertOne({
      name: "Test Book",
      author: "Test Author",
      description: "A test book",
      price: 19.99,
      image: "https://example.com/image.jpg",
    } satisfies BookDocument);

    const result = await lookupBookById(
      insertResult.insertedId.toHexString(),
      db
    );

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Test Book");
    expect(result?.author).toBe("Test Author");
    expect(result?.id).toBe(insertResult.insertedId.toHexString());
  });

  it("returns null when book is not found", async () => {
    const fakeId = new ObjectId().toHexString();
    const result = await lookupBookById(fakeId, db);

    expect(result).toBeNull();
  });

  it("returns null for invalid ObjectId format", async () => {
    const result = await lookupBookById("invalid-id", db);

    expect(result).toBeNull();
  });
});
