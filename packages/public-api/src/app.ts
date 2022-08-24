import express from 'express';
import { endpointMissingMiddleware, errorHandlerMiddleware, cors } from './middleware/common';
import healthCheckRouter from './healthcheck/router';
import websiteRouter from './website/router';

export function createApp() {
  const app = express();

  app.use(cors);
  app.use(express.json());

  // Routes
  app.use(healthCheckRouter);
  app.use(websiteRouter);

  // Error handling
  app.use(endpointMissingMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
