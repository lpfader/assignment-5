import { z } from "zod";
import { type ZodRouter } from "koa-zod-router";
import { getWarehouseStorage } from "./warehouse/memory-adapter";

import { lookupBookById } from "./books/lookup";
import { getBookDatabase } from "./database_access";

export default function lookupBookByIdRoute(router: ZodRouter): void {
  router.register({
    name: "lookup book by id",
    method: "get",
    path: "/books/:id",
    validate: {
      params: z.object({
        id: z.string(),
      }),
    },
    handler: async (ctx, next) => {
      const { id } = ctx.request.params;

      // 1. Call pure domain logic
      const db = getBookDatabase();
      const book = await lookupBookById(id, db);

      if (!book) {
        ctx.status = 404;
        ctx.body = { error: "Book not found" };
        return;
      }

      // 2. Add stock (route concern)
      const warehouse = getWarehouseStorage();
      const stock = await warehouse.getTotalStock(book.id);

      ctx.body = { ...book, stock };

      await next();
    },
  });
}
