import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ObjectId } from "mongodb";
import { getBookDatabase, client } from "../../src/database_access";
import { createBook } from "../../src/books/create";

describe("createBook", () => {
  let db: ReturnType<typeof getBookDatabase>;

  beforeEach(() => {
    db = getBookDatabase();
  });

  afterEach(async () => {
    await client.close();
  });

  it("creates a new book", async () => {
    const input = {
      name: "New Book",
      author: "Author X",
      description: "A brand new book",
      price: 25.5,
      image: "https://example.com/book.jpg",
    };

    const result = await createBook(input, db);

    expect(result.id).toBeDefined();
    expect(result.name).toBe("New Book");
    expect(result.author).toBe("Author X");

    const stored = await db.books.findOne({
      _id: ObjectId.createFromHexString(result.id),
    });
    expect(stored).not.toBeNull();
  });
});
