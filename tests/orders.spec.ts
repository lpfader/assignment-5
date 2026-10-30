import { expect, test } from 'vitest';
import { BooksApi, Configuration, OrdersApi, WarehouseApi } from '../client-sdk';
import setupServer, { type ServerTestContext } from './run_server';

setupServer();

function apis(address: string) {
  const config = new Configuration({ basePath: address });
  return {
    books: new BooksApi(config),
    orders: new OrdersApi(config),
    warehouse: new WarehouseApi(config),
  };
}

function makeBook(address: string, name: string) {
  return apis(address).books.createBook({
    createBookRequest: {
      name,
      author: 'Someone',
      description: 'A book.',
      price: 10,
      image: 'https://example.com/x.jpg',
    },
  });
}

test<ServerTestContext>(
  'placing an order returns an id that can be read back',
  async ({ address }) => {
    const { orders } = apis(address);
    const book = await makeBook(address, 'Orderable');

    const { orderId } = await orders.createOrder({
      createOrderRequest: { books: [book.id] },
    });
    expect(orderId).toBeTruthy();

    const order = await orders.getOrder({ orderId });
    expect(order.fulfilled).toBe(false);
    expect(order.books[book.id]).toBe(1);

    const all = await orders.listOrders({});
    expect(all.some((o) => o.orderId === orderId)).toBe(true);
  },
);

test<ServerTestContext>(
  'fulfilling an order takes stock off the shelf',
  async ({ address }) => {
    const { orders, warehouse } = apis(address);
    const book = await makeBook(address, 'Fulfilable');

    await warehouse.placeBooksOnShelf({
      placeBooksRequest: { bookId: book.id, numberOfBooks: 5, shelf: 'A-1' },
    });

    const { orderId } = await orders.createOrder({
      createOrderRequest: { books: [book.id, book.id] },
    });

    await orders.fulfillOrder({
      orderId,
      fulfillmentRequest: {
        fulfillment: [{ book: book.id, shelf: 'A-1', numberOfBooks: 2 }],
      },
    });

    const after = await orders.getOrder({ orderId });
    expect(after.fulfilled).toBe(true);

    const stock = await warehouse.getBookStock({ bookId: book.id });
    expect(stock.stock).toBe(3);
  },
);