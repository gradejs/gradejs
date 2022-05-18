import express from 'express';
import { WorkerTask } from '@gradejs-public/shared';
import * as taskHandlers from './tasks';

export function createWorker() {
  const app = express();

  app.use(express.json());

  // Healthcheck
  app.get('/', (_, res) => {
    res.send(`gradejs-public-worker`);
  });

  // Task handling
  app.post('/', async (req, res, next) => {
    try {
      const message = req.body as WorkerTask;
      if (!(message.type in taskHandlers)) {
        throw new Error(`Unknown task: ${message.type}`);
      }

      const result = await taskHandlers[message.type](message.payload as any);

      res.send({ ok: result });
    } catch (e) {
      next(e);
    }
  });

  return app;
}
