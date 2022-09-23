import * as trpc from '@trpc/server';
// See also: https://colinhacks.com/essays/painless-typesafety
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { z, ZodError } from 'zod';
import { getWebPageScan, requestWebPageRescan } from './website/service';
import { getAffectingVulnerabilities } from './vulnerabilities/vulnerabilities';
import {
  PackageMetadata,
  PackageVulnerabilityData,
  SerializableEntity,
  toSerializable,
  WebPageScan,
} from '@gradejs-public/shared';
import { getPackageMetadataByPackageNames } from './packageMetadata/packageMetadataService';

// created for each request
export const createContext = (_: CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

type ScanResultPackageWithMetadata = WebPageScan.IdentifiedPackage & {
  registryMetadata?: PackageMetadata;
};

export namespace ClientApi {
  export type PackageVulnerabilityResponse = SerializableEntity<PackageVulnerabilityData>;
  export type ScanResultPackageResponse = SerializableEntity<ScanResultPackageWithMetadata>;
}

function mergeRegistryMetadata(
  packages: WebPageScan.IdentifiedPackage[],
  registryMetadata: Record<string, PackageMetadata>
) {
  return packages.map((it) => ({
    ...it,
    registryMetadata: registryMetadata[it.name],
  }));
}

enum WebPageStatusNoData {
  NoData = 'noData',
}
type WebPageStatus = WebPageScan.Status | WebPageStatusNoData;

type RequestWebPageScanResponse = Pick<WebPageScan, 'finishedAt'> & {
  id: string;
  status: WebPageStatus;
  scanResult?: {
    identifiedModuleMap: Record<string, WebPageScan.IdentifiedModule>;
    identifiedPackages: ScanResultPackageWithMetadata[];
    vulnerabilities: Record<string, PackageVulnerabilityData[]>;
  };
};

export const appRouter = trpc
  .router<Context>()
  .mutation('requestWebPageRescan', {
    input: z.string().url(),
    async resolve({ input: url }) {
      return await requestWebPageRescan(url);
    },
  })
  .query('getWebPageScan', {
    input: z.string().url(),
    async resolve({ input: url }) {
      const scan = await getWebPageScan(url);
      if (!scan) {
        return null;
      }

      const scanResponse: RequestWebPageScanResponse = {
        id: scan.id.toString(),
        status: scan.status,
        finishedAt: scan.finishedAt,
        scanResult: undefined,
      };

      if (scan.scanResult) {
        const packageNames = scan.scanResult.identifiedPackages.map((it) => it.name);

        const [metadata, vulnerabilities] = await Promise.all([
          getPackageMetadataByPackageNames(packageNames),
          getAffectingVulnerabilities(scan.scanResult),
        ]);

        scanResponse.scanResult = {
          identifiedModuleMap: scan.scanResult.identifiedModuleMap,
          identifiedPackages: mergeRegistryMetadata(scan.scanResult.identifiedPackages, metadata),
          vulnerabilities,
        };
      }

      return toSerializable(scanResponse);
    },
  })
  .formatError(({ shape, error }) => {
    // TODO: proper reporting
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  });

// export type definition of API
export type ClientApiRouter = typeof appRouter;
