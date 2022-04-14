import { Router } from 'express';
import { respond } from '../middleware/response';

const router = Router();

router.get('/', (_, res) => {
  respond(res, `gradejs-public-api`);
});

export default router;
