import { z } from "zod";
import { type ZodRouter } from "koa-zod-router";

import { getWarehouseStorage } from "../warehouse/memory-adapter";
import { getOrdersStorage } from "./memory-adapter";

export default function ordersRoutes(router: ZodRouter): void {
  const warehouse = getWarehouseStorage();
  const orders = getOrdersStorage(warehouse);

  // POST /orders → place an order
  router.register({
    name: "place order",
    method: "post",
    path: "/orders",
    validate: {
      body: z.object({
        bookId: z.string(),
        quantity: z.number().int().positive(),
      }),
    },
    handler: async (ctx, next) => {
      const { bookId, quantity } = ctx.request.body;

      const order = await orders.placeOrder(bookId, quantity);

      ctx.body = order;

      await next();
    },
  });

  // GET /orders → list all orders
  router.register({
    name: "list orders",
    method: "get",
    path: "/orders",
    handler: async (ctx, next) => {
      const allOrders = await orders.getOrders();
      ctx.body = allOrders;

      await next();
    },
  });
}
