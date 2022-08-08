import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { endpointMissingMiddleware, errorHandlerMiddleware, cors } from './middleware/common';
import { appRouter, createContext } from './router';

export function createApp() {
  const app = express();

  if (process.env.NODE_ENV !== 'test') {
    app.use(cors);
  }

  app.use(
    '/',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Error handling
  app.use(endpointMissingMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
