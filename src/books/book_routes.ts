import { type ZodRouter } from "koa-zod-router";
import booksList from "./lists";
import createBookRoute from "./create_route";
import deleteBook from "./delete";
import lookupBookByIdRoute from "../lookup_route";

export function registerBookRoutes(router: ZodRouter): void {
  booksList(router);
  createBookRoute(router);
  deleteBook(router);
  lookupBookByIdRoute(router);
}
