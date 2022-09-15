import { systemApi } from '@gradejs-public/shared';
import { Router } from 'express';
import { syncWebPageScanResult } from './website/service';

const systemApiRouter = Router();

systemApiRouter.post('/scan', async (req, res, next) => {
  try {
    const scanReport = systemApi.apiScanReportSchema.parse(req.body);
    await syncWebPageScanResult(scanReport);
  } catch (e) {
    next(e);
    return;
  }

  res.status(204).end();
});

export default systemApiRouter;
