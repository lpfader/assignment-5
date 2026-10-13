export interface WarehouseStorage {
  addStock(bookId: string, location: string): Promise<void>;
  removeStock(bookId: string, location: string): Promise<void>;
  getTotalStock(bookId: string): Promise<number>;
  getStockByLocation(bookId: string): Promise<Record<string, number>>;
}

/**
 * In-memory warehouse implementation.
 * This is PURE DOMAIN LOGIC — no routes, no DB, no HTTP.
 */
export function createWarehouseStorage(): WarehouseStorage {
  // Structure:
  // {
  //   [bookId]: {
  //      [location]: quantity
  //   }
  // }
  const stock: Record<string, Record<string, number>> = {};

  return {
    async addStock(bookId, location) {
      if (!stock[bookId]) {
        stock[bookId] = {};
      }
      stock[bookId][location] = (stock[bookId][location] ?? 0) + 1;
    },

    async removeStock(bookId, location) {
      const bookStock = stock[bookId];
      if (!bookStock) return;

      const qty = bookStock[location] ?? 0;
      if (qty <= 1) {
        delete bookStock[location];
      } else {
        bookStock[location] = qty - 1;
      }

      // If no locations left, remove the book entirely
      if (Object.keys(bookStock).length === 0) {
        delete stock[bookId];
      }
    },

    async getTotalStock(bookId) {
      const bookStock = stock[bookId];
      if (!bookStock) return 0;

      return Object.values(bookStock).reduce((sum, qty) => sum + qty, 0);
    },

    async getStockByLocation(bookId) {
      return stock[bookId] ? { ...stock[bookId] } : {};
    },
  };
}
