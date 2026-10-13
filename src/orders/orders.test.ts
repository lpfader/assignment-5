import { describe, it, expect, beforeEach } from "vitest";
import { createWarehouseStorage } from "../../src/warehouse/warehouse";
import { createOrdersStorage } from "../../src/orders/orders";

describe("OrdersStorage (Assignment 4)", () => {
  let warehouse: ReturnType<typeof createWarehouseStorage>;
  let orders: ReturnType<typeof createOrdersStorage>;

  beforeEach(() => {
    warehouse = createWarehouseStorage();
    orders = createOrdersStorage(warehouse);
  });

  it("places an order when enough stock exists", async () => {
    await warehouse.addStock("book1", "A1");
    await warehouse.addStock("book1", "A1");
    await warehouse.addStock("book1", "B2");

    const order = await orders.placeOrder("book1", 2);

    expect(order.id).toBeDefined();
    expect(order.bookId).toBe("book1");
    expect(order.quantity).toBe(2);
    expect(typeof order.createdAt).toBe("string");

    const remaining = await warehouse.getTotalStock("book1");
    expect(remaining).toBe(1);
  });

  it("throws when not enough stock exists", async () => {
    await warehouse.addStock("book1", "A1");

    await expect(orders.placeOrder("book1", 2)).rejects.toThrow(
      "Not enough stock to fulfill order"
    );
  });

  it("reduces stock from multiple locations", async () => {
    await warehouse.addStock("book1", "A1"); // 1
    await warehouse.addStock("book1", "A1"); // 2
    await warehouse.addStock("book1", "B2"); // 3

    await orders.placeOrder("book1", 3);

    const remaining = await warehouse.getTotalStock("book1");
    expect(remaining).toBe(0);

    const byLocation = await warehouse.getStockByLocation("book1");
    expect(byLocation).toEqual({});
  });

  it("stores orders in memory", async () => {
    await warehouse.addStock("book1", "A1");
    await warehouse.addStock("book2", "A1");

    await orders.placeOrder("book1", 1);
    await orders.placeOrder("book2", 1);

    const allOrders = await orders.getOrders();
    expect(allOrders).toHaveLength(2);

    expect(allOrders[0].bookId).toBe("book1");
    expect(allOrders[1].bookId).toBe("book2");
  });

  it("orders include timestamps", async () => {
    await warehouse.addStock("book1", "A1");

    const order = await orders.placeOrder("book1", 1);
    expect(typeof order.createdAt).toBe("string");
  });
});
