import { Router } from 'express';
import { respond } from '../middleware/response';
import { version } from '../../package.json';

const router = Router();

router.get('/', (_, res) => {
  respond(res, `gradejs-public-api ${version}`);
});

export default router;
