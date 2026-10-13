import { z } from "zod";
import { type ZodRouter } from "koa-zod-router";

import { createBook } from "./create";
import { getBookDatabase } from "../database_access";
import { getWarehouseStorage } from "../warehouse/memory-adapter";

export default function createBookRoute(router: ZodRouter): void {
  router.register({
    name: "create book",
    method: "post",
    path: "/books",
    validate: {
      body: z.object({
        name: z.string(),
        author: z.string(),
        description: z.string(),
        price: z.number(),
        image: z.string(),
      }),
    },
    handler: async (ctx, next) => {
      const db = getBookDatabase();
      const warehouse = getWarehouseStorage();

      const book = await createBook(ctx.request.body, db);

      // Add stock (route concern)
      const stock = await warehouse.getTotalStock(book.id);

      ctx.body = { ...book, stock };

      await next();
    },
  });
}
