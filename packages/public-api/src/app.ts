import express from 'express';
import { endpointMissingMiddleware, errorHandlerMiddleware, parseJson } from './middleware/common';
import { healthCheckRouter } from './routes';

export function createApp() {
  const app = express();

  app.use(parseJson);
  app.use(healthCheckRouter);

  // Error handling
  app.use(endpointMissingMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
