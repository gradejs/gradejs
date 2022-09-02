import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { endpointMissingMiddleware, errorHandlerMiddleware, cors } from './middleware/common';
import { appRouter, createContext } from './router';
import { verifyApiToken } from './middleware/verifyApiToken';
import internalApiRouter from './internalApiRouter';

export function createApp() {
  const app = express();
  app.get('/', (_, res) => res.send('gradejs-public-api')); // healthcheck path
  app.use(cors);

  app.use('/internal', verifyApiToken, express.json(), internalApiRouter);

  app.use(
    '/',
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Error handling
  app.use(endpointMissingMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
