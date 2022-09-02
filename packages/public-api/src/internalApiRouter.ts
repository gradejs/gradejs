import { Router } from 'express';
import { internalApi } from '@gradejs-public/shared';
import { z } from 'zod';
import { syncWebPageScanResult } from './website/service';

const ApiReportedPackage = z.object({
  name: z.string(),
  versionSet: z.array(z.string()),
  versionRange: z.string(),
  approximateSize: z.nullable(z.number()),
});
export type ReportedPackage = z.infer<typeof ApiReportedPackage>;

const ApiScanReport = z.object({
  id: z.optional(z.string()),
  url: z.string().url(),
  status: z.nativeEnum(internalApi.WebPageScanStatus),
  scan: z.object({
    packages: z.array(ApiReportedPackage),
  }),
});
export type ApiScanReport = z.infer<typeof ApiScanReport>;

const internalApiRouter = Router();

internalApiRouter.post('/scan', async (req, res, next) => {
  try {
    const scanReport = ApiScanReport.parse(req.body);
    await syncWebPageScanResult(scanReport);
  } catch (e) {
    next(e);
    return;
  }

  res.status(204).end();
});

export default internalApiRouter;
