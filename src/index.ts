import server from './server';

server(3000).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});