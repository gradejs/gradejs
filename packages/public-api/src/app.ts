import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { endpointMissingMiddleware, errorHandlerMiddleware, cors } from './middleware/common';
import { appRouter, createContext } from './router';

export function createApp() {
  const app = express();
  app.use(cors);

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
