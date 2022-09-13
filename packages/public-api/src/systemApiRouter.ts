import { Router } from 'express';
import { internalApi } from '@gradejs-public/shared';
import { z } from 'zod';
import { syncWebPageScanResult } from './website/service';

const apiReportedPackageSchema = z.object({
  name: z.string(),
  versionSet: z.array(z.string()),
  versionRange: z.string(),
  approximateByteSize: z.nullable(z.number()),
});

const apiScanReportSchema = z.object({
  id: z.optional(z.string()),
  url: z.string().url(),
  status: z.nativeEnum(internalApi.WebPageScan.Status),
  scan: z.object({
    packages: z.array(apiReportedPackageSchema),
  }),
});

export namespace SystemApi {
  export type ScanReport = z.infer<typeof apiScanReportSchema>;
  export type ReportedPackage = z.infer<typeof apiReportedPackageSchema>;
}

const systemApiRouter = Router();

systemApiRouter.post('/scan', async (req, res, next) => {
  try {
    const scanReport = apiScanReportSchema.parse(req.body);
    await syncWebPageScanResult(scanReport);
  } catch (e) {
    next(e);
    return;
  }

  res.status(204).end();
});

export default systemApiRouter;
