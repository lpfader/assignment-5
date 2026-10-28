import { z } from "zod";
import { type ZodRouter } from "koa-zod-router";
import { getWarehouseStorage } from "../warehouse/memory-adapter";

import { listBooks } from "./list";
import { getBookDatabase } from "../database_access";

export default function booksList(router: ZodRouter): void {
  router.register({
    name: "list books",
    method: "get",
    path: "/books",
    validate: {
      query: z.object({
        filters: z
          .object({
            from: z.coerce.number().optional(),
            to: z.coerce.number().optional(),
            name: z.string().optional(),
            author: z.string().optional(),
          })
          .array()
          .optional(),
      }),
    },
    handler: async (ctx, next) => {
      const { filters } = ctx.request.query;

      const db = getBookDatabase();
      const books = await listBooks(filters ?? [], db);

      const warehouse = getWarehouseStorage();
      const booksWithStock = await Promise.all(
        books.map(async (book) => ({
          ...book,
          stock: await warehouse.getTotalStock(book.id),
        })),
      );

      ctx.body = booksWithStock;
      await next();
    },
  });
}
