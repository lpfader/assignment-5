import type { WarehouseStorage } from "../warehouse/warehouse";

export interface Order {
  id: string;
  bookId: string;
  quantity: number;
  createdAt: string;
}

export interface OrdersStorage {
  placeOrder(bookId: string, quantity: number): Promise<Order>;
  getOrders(): Promise<Order[]>;
}

/**
 * In-memory orders implementation.
 * Pure domain logic — no routes, no DB, no HTTP.
 */
export function createOrdersStorage(
  warehouse: WarehouseStorage
): OrdersStorage {
  const orders: Order[] = [];

  return {
    async placeOrder(bookId, quantity) {
      // 1. Check stock
      const totalStock = await warehouse.getTotalStock(bookId);
      if (totalStock < quantity) {
        throw new Error("Not enough stock to fulfill order");
      }

      // 2. Reduce stock from warehouse
      // Remove from any locations until quantity is satisfied
      const stockByLocation = await warehouse.getStockByLocation(bookId);
      let remaining = quantity;

      for (const [location, qty] of Object.entries(stockByLocation)) {
        if (remaining <= 0) break;

        const removeCount = Math.min(qty, remaining);

        for (let i = 0; i < removeCount; i++) {
          await warehouse.removeStock(bookId, location);
        }

        remaining -= removeCount;
      }

      // 3. Create order object
      const order: Order = {
        id: crypto.randomUUID(),
        bookId,
        quantity,
        createdAt: new Date().toISOString(),
      };

      orders.push(order);

      return order;
    },

    async getOrders() {
      return [...orders];
    },
  };
}
