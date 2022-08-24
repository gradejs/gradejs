import { StrictRouter } from '../middleware/strictRouter';

const strictRouter = new StrictRouter();

strictRouter.get('/', async () => {
  return 'gradejs-public-api';
});

export default strictRouter.router;
