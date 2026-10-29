import { koaSwagger } from 'koa2-swagger-ui';
import swagger from '../build/swagger.json';
import Koa from "koa";
import cors from "@koa/cors";
import qs from "koa-qs";
import { connectToDatabase } from "./db";
import { RegisterRoutes } from "./routes/routes";   // ✅ TSOA-generated router
import Router from "@koa/router";                   // ✅ Koa router class

const app = new Koa();
qs(app);
app.use(cors());

// Create a real Koa router (TSOA needs this)
const router = new Router();

// Register all TSOA routes
RegisterRoutes(router);   // ✅ This is the “extra line” you were asking about

// Attach routes to the app
app.use(router.routes());
app.use(router.allowedMethods());

app.use(
  koaSwagger({
    routePrefix: '/docs',
    specPrefix: '/docs/spec',
    exposeSpec: true,
    swaggerOptions: {
      spec: swagger
    }
  })
);

connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
