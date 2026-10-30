import { expect, test } from 'vitest';
import { BooksApi, Configuration } from '../client-sdk';
import setupServer, { type ServerTestContext } from './run_server';

setupServer();

function api(address: string): BooksApi {
  return new BooksApi(new Configuration({ basePath: address }));
}

test<ServerTestContext>(
  'creating a book then reading it back works',
  async ({ address }) => {
    const client = api(address);

    const created = await client.createBook({
      createBookRequest: {
        name: 'Dune',
        author: 'Frank Herbert',
        description: 'Spice.',
        price: 19.99,
        image: 'https://example.com/dune.jpg',
      },
    });

    expect(created.id).toBeTruthy();
    expect(created.name).toBe('Dune');
    expect(created.stock).toBe(0);

    const fetched = await client.getBook({ bookId: created.id });
    expect(fetched.name).toBe('Dune');
  },
);

test<ServerTestContext>('listing the catalogue includes the book', async ({ address }) => {
  const client = api(address);

  await client.createBook({
    createBookRequest: {
      name: 'Neuromancer',
      author: 'William Gibson',
      description: 'Cyberpunk.',
      price: 14.5,
      image: 'https://example.com/neuro.jpg',
    },
  });

  const books = await client.listBooks({});
  expect(books.some((b) => b.name === 'Neuromancer')).toBe(true);
});