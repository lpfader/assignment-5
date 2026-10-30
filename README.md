# Lewis' McMasterful Books API

This is a bookstore API for BCD-103 Assignment 5

Books are stored in MongoDB. Warehouse stock and orders are held in memory (see
[Known limitations](#known-limitations)). The API is described by an OpenAPI 3
spec generated from the code with [tsoa](https://tsoa-community.github.io/docs/),
browsable at `/docs`, and consumed through a generated TypeScript client SDK.

layout

```
build/                  Generated: OpenAPI spec + tsoa router (do not edit)
client-sdk/             Generated: TypeScript client (do not edit)
src/
  server.ts             Koa app factory — middleware, routes, /docs
  index.ts              Entry point; starts the server on port 3000
  db.ts                 MongoDB connection handling
  responses.ts          Shared error response model
  books/                Book catalogue: controller, domain logic, types
  warehouse/            Physical stock: controller, storage port, in-memory adapter
  orders/               Orders: controller, storage port, in-memory adapter
tests/                  API tests + test server harness
adapter/                Client-facing adapter used by the course website
```
