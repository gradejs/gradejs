import * as trpc from '@trpc/server';
// See also: https://colinhacks.com/essays/painless-typesafety
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { z, ZodError } from 'zod';
import { getOrRequestWebPageScan, isRescanAvailable } from './website/service';
import { getAffectingVulnerabilities } from './vulnerabilities/vulnerabilities';
import {
  logger,
  PackageMetadata,
  PackageVulnerabilityData,
  SerializableEntity,
  toSerializable,
  WebPageScan,
} from '@gradejs-public/shared';
import { getPackagePartialMetadataByPackageNames } from './packageMetadata/packageMetadataService';
import { getShowcaseData } from './showcase/showcaseService';
import { getPackageSummaryByName } from './packageInfo/packageSummaryService';
import { getPackageUsage, MAX_ALLOWED_USAGE_LIMIT } from './packageInfo/packageUsage';
import { searchEntitiesByName } from './search/searchService';

// created for each request
export const createContext = (_: CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

type ScanResultPackageWithMetadata = WebPageScan.IdentifiedPackage & {
  registryMetadata?: PackageMetadata;
};

export namespace ClientApi {
  export type PackageVulnerabilityResponse = SerializableEntity<PackageVulnerabilityData>;
  export type ScanResultPackageResponse = SerializableEntity<ScanResultPackageWithMetadata>;
  export type IdentifiedModule = SerializableEntity<WebPageScan.IdentifiedModule>;
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

type RequestWebPageScanResponse = {
  id: string;
  status: WebPageScan.Status;
  finishedAt?: string;
  isRescanAvailable?: boolean;
  scanResult?: {
    identifiedModuleMap: Record<string, WebPageScan.IdentifiedModule>;
    identifiedPackages: ScanResultPackageWithMetadata[];
    vulnerabilities: Record<string, PackageVulnerabilityData[]>;
    processedScripts: WebPageScan.ProcessedScript[];
    identifiedBundler?: WebPageScan.IdentifiedBundler;
  };
};

export const appRouter = trpc
  .router<Context>()
  .query('getShowcase', {
    async resolve() {
      const showcaseData = await getShowcaseData();

      const showcasedScans = showcaseData.showcasedScans.map((showcasedScan) => ({
        hostname: {
          hostname: showcasedScan.webPage.hostname.hostname,
        },
        webPage: {
          path: showcasedScan.webPage.path,
        },
        scanPreview: {
          packageNames:
            showcasedScan.scanResult?.identifiedPackages
              // TODO: sort by popularity
              .slice(0, 5)
              .map((pkg) => pkg.name) ?? [],
          totalCount: showcasedScan.scanResult?.identifiedPackages.length ?? 0,
        },
      }));

      const scansWithVulnerabilities = showcaseData.scansWithVulnerabilities.map(
        (scanWithVulnerabilities) => ({
          hostname: {
            hostname: scanWithVulnerabilities.sourceScan.webPage.hostname.hostname,
          },
          webPage: {
            path: scanWithVulnerabilities.sourceScan.webPage.path,
          },
          vulnerabilities: scanWithVulnerabilities.vulnerabilities,
        })
      );

      return toSerializable({
        showcasedScans,
        scansWithVulnerabilities,
        showcasedPackages: showcaseData.showcasedPackages,
      });
    },
  })
  .query('getPackageInfo', {
    input: z.object({
      packageName: z.string(),
    }),
    async resolve({ input: { packageName } }) {
      const packageInfo = await getPackageSummaryByName(packageName);
      if (!packageInfo) {
        throw new trpc.TRPCError({ code: 'NOT_FOUND' });
      }

      return toSerializable(packageInfo);
    },
  })
  .query('getPackageUsage', {
    input: z.object({
      packageName: z.string(),
      offset: z.number().gt(0),
      limit: z.number().gt(0).lte(MAX_ALLOWED_USAGE_LIMIT),
    }),
    async resolve({ input: { packageName, offset, limit } }) {
      const usage = await getPackageUsage(packageName, {
        offset,
        limit,
        countPackages: true,
      });

      return toSerializable({ usage });
    },
  })
  .query('search', {
    input: z.string().min(1).max(50),
    async resolve({ input: searchQuery }) {
      const { scans, packages } = await searchEntitiesByName(searchQuery);

      const mappedPackages = packages.map((it) => ({
        type: 'package',
        name: it.name,
        description: it.description,
      }));

      const mappedHostnames = scans.map((it) => ({
        type: 'scan',
        hostname: it.hostname,
        path: it.path,
        packageCount: it.packageCount,
      }));

      return [...mappedHostnames, ...mappedPackages];
    },
  })
  .mutation('getOrRequestWebPageScan', {
    input: z.object({
      url: z.string().url(),
      rescan: z.boolean().optional(),
    }),
    async resolve({ input: { url, rescan } }) {
      const scan = await getOrRequestWebPageScan(url, rescan);
      if (!scan) {
        throw new trpc.TRPCError({ code: 'NOT_FOUND' });
      }

      const scanResponse: RequestWebPageScanResponse = {
        id: scan.id.toString(),
        status: scan.status,
        finishedAt: scan.finishedAt?.toString(),
        isRescanAvailable: true,
        scanResult: undefined,
      };

      if (scan.scanResult) {
        const packageNames = scan.scanResult.identifiedPackages.map((it) => it.name);

        const [metadata, vulnerabilities] = await Promise.all([
          getPackagePartialMetadataByPackageNames(packageNames),
          getAffectingVulnerabilities(scan.scanResult),
        ]);

        scanResponse.scanResult = {
          identifiedModuleMap: scan.scanResult.identifiedModuleMap,
          identifiedPackages: mergeRegistryMetadata(scan.scanResult.identifiedPackages, metadata),
          processedScripts: scan.scanResult.processedScripts,
          identifiedBundler: scan.scanResult.identifiedBundler,
          vulnerabilities,
        };

        scanResponse.isRescanAvailable = isRescanAvailable(scan);
      }

      return toSerializable(scanResponse);
    },
  })
  .formatError(({ shape, error }) => {
    logger.error(shape.message, shape, error);
    return {
      ...shape,
      data: {
        ...shape.data,
        stack: null,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  });

// export type definition of API
export type ClientApiRouter = typeof appRouter;
