import { getBookDatabase } from "../database_access";

export interface WarehouseRecord {
  bookId: string;
  quantity: number;
}

export async function getStock(bookId: string): Promise<number> {
  const { database } = getBookDatabase();
  const warehouse = database.collection<WarehouseRecord>("warehouse");

  const record = await warehouse.findOne({ bookId });
  return record?.quantity ?? 0;
}

export async function addStock(bookId: string, qty: number): Promise<void> {
  const { database } = getBookDatabase();
  const warehouse = database.collection<WarehouseRecord>("warehouse");

  await warehouse.updateOne(
    { bookId },
    { $inc: { quantity: qty } },
    { upsert: true }
  );
}

export async function removeStock(bookId: string, qty: number): Promise<void> {
  const { database } = getBookDatabase();
  const warehouse = database.collection<WarehouseRecord>("warehouse");

  await warehouse.updateOne(
    { bookId },
    { $inc: { quantity: -qty } },
    { upsert: true }
  );
}

export async function listStock(): Promise<WarehouseRecord[]> {
  const { database } = getBookDatabase();
  const warehouse = database.collection<WarehouseRecord>("warehouse");

  return warehouse.find().toArray();
}
