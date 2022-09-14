import { z } from 'zod';

export const identifiedModuleSchema = z.object({
  packageName: z.string(),
  packageVersionSet: z.array(z.string()),
  packageFile: z.string(),
  approximateByteSize: z.number(),
});

export const identifiedPackageSchema = z.object({
  name: z.string(),
  versionSet: z.array(z.string()),
  moduleIds: z.array(z.string()),
});

// TODO: add processed scripts
// TODO: add identified bundler

export const apiScanReportSchema = z.union([
  z.object({
    requestId: z.optional(z.string()),
    url: z.string().url(),
    status: z.literal('ready'),
    identifiedModuleMap: z.record(identifiedModuleSchema),
    identifiedPackages: z.array(identifiedPackageSchema),
  }),
  z.object({
    requestId: z.optional(z.string()),
    url: z.string().url(),
    status: z.literal('error'),
  }),
]);

export namespace ScanReport {
  export type IdentifiedPackage = z.infer<typeof identifiedPackageSchema>;
  export type IdentifiedModule = z.infer<typeof identifiedModuleSchema>;
  export enum Status {
    Ready = 'ready',
    Error = 'error',
  }
}

export type ScanReport = z.infer<typeof apiScanReportSchema>;

export interface PackageRequest {
  name: string;
  latestVersion: string;
}

export interface PackageIndexRequest {
  name: string;
  versions: string[];
  [key: string]: unknown;
}

export type PaginatonRequest = {
  offset: number;
  limit: number;
  total: number;
};
