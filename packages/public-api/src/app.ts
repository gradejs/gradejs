import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { endpointMissingMiddleware, errorHandlerMiddleware, cors } from './middleware/common';
import { appRouter, createContext } from './clientApiRouter';
import { verifySystemApiToken } from './middleware/verifySystemApiToken';
import systemApiRouter from './systemApiRouter';

export function createApp() {
  const app = express();
  app.get('/', (_, res) => res.send('gradejs-public-api')); // healthcheck path

  // System scan reports may be relatively big, so we need to increase the limit
  app.use('/system', verifySystemApiToken, express.json({ limit: '2MB' }), systemApiRouter);

  app.use(
    '/client',
    cors,
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
