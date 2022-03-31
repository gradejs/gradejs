import { Router } from 'express';
import { respond } from '../middleware/response';
import { version } from '../../package.json';

const healthCheckRouter = Router();
healthCheckRouter.get('/', (_, res) => {
  respond(res, `gradejs-public-api ${version}`);
});

export { healthCheckRouter };
