import { koaSwagger } from 'koa2-swagger-ui';
import swagger from '../build/swagger.json';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import qs from 'koa-qs';
import { connectToDatabase } from './db';

// TSOA routes — use import, NOT require
import { RegisterRoutes } from '../build/routes';

const app = new Koa();
const router = new Router();

qs(app);
app.use(cors());

// Register TSOA routes
RegisterRoutes(router);

// Mount router
app.use(router.routes());
app.use(router.allowedMethods());

// Swagger UI
app.use(
  koaSwagger({
    routePrefix: '/docs',
    specPrefix: '/docs/spec',
    exposeSpec: true,
    swaggerOptions: {
      spec: swagger,
    },
  })
);

// Start DB + server
connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
