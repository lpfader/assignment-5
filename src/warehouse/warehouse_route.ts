import { z } from "zod";
import { type ZodRouter } from "koa-zod-router";
import { getWarehouseStorage } from "./memory-adapter";

export default function warehouseRoutes(router: ZodRouter): void {
  const warehouse = getWarehouseStorage();

  // GET /warehouse/:bookId → total + per-location stock
  router.register({
    name: "get warehouse stock",
    method: "get",
    path: "/warehouse/:bookId",
    validate: {
      params: z.object({
        bookId: z.string(),
      }),
    },
    handler: async (ctx, next) => {
      const { bookId } = ctx.request.params;

      const total = await warehouse.getTotalStock(bookId);
      const byLocation = await warehouse.findBookOnShelf(bookId);

      ctx.body = {
        bookId,
        total,
        locations: byLocation,
      };

      await next();
    },
  });

  // POST /warehouse/:bookId/add → add one physical copy
  router.register({
    name: "add warehouse stock",
    method: "post",
    path: "/warehouse/:bookId/add",
    validate: {
      params: z.object({
        bookId: z.string(),
      }),
      body: z.object({
        location: z.string(),
      }),
    },
    handler: async (ctx, next) => {
      const { bookId } = ctx.request.params;
      const { location } = ctx.request.body;

      await warehouse.placeBooksOnShelf(bookId, 1, location);

      ctx.body = { success: true };

      await next();
    },
  });

  // POST /warehouse/:bookId/remove → remove one physical copy
  router.register({
    name: "remove warehouse stock",
    method: "post",
    path: "/warehouse/:bookId/remove",
    validate: {
      params: z.object({
        bookId: z.string(),
      }),
      body: z.object({
        location: z.string(),
      }),
    },
    handler: async (ctx, next) => {
      const { bookId } = ctx.request.params;
      const { location } = ctx.request.body;

      await warehouse.removeBooksFromShelf(bookId, 1, location);

      ctx.body = { success: true };

      await next();
    },
  });
}
