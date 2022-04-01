import express from 'express';
import { endpointMissingMiddleware, errorHandlerMiddleware, parseJson } from './middleware/common';
import healthCheckRouter from './healthcheck/router';
import websiteRouter from './website/router';

export function createApp() {
  const app = express();

  app.use(parseJson);
  app.use(healthCheckRouter);
  app.use(websiteRouter);

  // Error handling
  app.use(endpointMissingMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
