import express from 'express';
import { logger, WorkerTask } from '@gradejs-public/shared';
import * as taskHandlers from './tasks';

export function createWorker() {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/', (_, res) => {
    res.send(`gradejs-public-worker`);
  });

  // Task handling
  app.post('/', async (req, res, next) => {
    try {
      const message = req.body as WorkerTask;

      logger.info(`Received task: ${message.type}`);

      if (!Object.keys(taskHandlers).includes(message.type)) {
        throw new Error(`Unknown task: ${message.type}`);
      }

      const result = await taskHandlers[message.type](message.payload as any);
      res.send({ ok: result });
    } catch (e) {
      logger.error('Unexpected worker error', e);
      next(e);
    }
  });

  return app;
}
