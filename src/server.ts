import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import qs from "koa-qs";
import bodyParser from "koa-bodyparser";
import { koaSwagger } from "koa2-swagger-ui";
import type { Server } from "http";

import swagger from "../build/swagger.json";
import { RegisterRoutes } from "../build/routes";
import { connectToDatabase } from "./db";

export interface RunningServer {
  server: Server;
  state: unknown;
}

export default async function server(port = 3000): Promise<RunningServer> {
  const app = new Koa();

  app.use(bodyParser());
  qs(app);
  app.use(cors());

  const router = new Router();
  RegisterRoutes(router);
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(
    koaSwagger({
      routePrefix: "/docs",
      specPrefix: "/docs/spec",
      exposeSpec: true,
      swaggerOptions: { spec: swagger },
    }),
  );

  await connectToDatabase();

  const instance = app.listen(port);
  if (port > 0) {
    console.log(`Server listening on port ${port}`);
  }

  return { server: instance, state: {} };
}
