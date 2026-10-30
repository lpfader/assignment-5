import { afterEach, beforeEach } from 'vitest';
import server from '../src/server';
import { disconnectFromDatabase } from '../src/db';

export interface ServerTestContext {
  address: string;
}

export default function setupServer(): void {
  beforeEach<ServerTestContext>(async (context) => {
    const { server: instance } = await server(0);
    const address = instance.address();

    if (typeof address === 'string') {
      context.address = `http://${address}`;
    } else if (address !== null) {
      context.address = `http://localhost:${address.port}`;
    } else {
      throw new Error('couldnt set up server');
    }
  });

  afterEach<ServerTestContext>(async () => {
    await disconnectFromDatabase();
  });
}