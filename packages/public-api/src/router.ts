import * as trpc from '@trpc/server';
// See also: https://colinhacks.com/essays/painless-typesafety
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { z, ZodError } from 'zod';
import { requestWebPageScan } from './website/service';
import { getAffectingVulnerabilities } from './vulnerabilities/vulnerabilities';
import {
  PackageMetadata,
  PackageVulnerability,
  ScanResultPackage,
  SerializableEntity,
  toSerializable,
  WebPageScan,
} from '@gradejs-public/shared';
import { getPackageMetadataByPackageNames } from './packageMetadata/packageMetadataService';

// const hostnameRe =
//   /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

// created for each request
export const createContext = (_: CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

export namespace Api {
  export type ScanResultResponse = SerializableEntity<WebPageScan>;
  export type ScanResultPackageResponse = SerializableEntity<ScanResultPackage>;
  export type PackageVulnerabilityResponse = SerializableEntity<PackageVulnerability>;
  export type PackageMetadataResponse = SerializableEntity<PackageMetadata>;
}

export const appRouter = trpc
  .router<Context>()
  .mutation('requestWebPageScan', {
    input: z.string().url(),
    async resolve({ input: url }) {
      const scan = await requestWebPageScan(url);

      if (scan.scanResult) {
        const packageNames = scan.scanResult.packages.map((it) => it.name);

        const [metadata, vulnerabilities] = await Promise.all([
          getPackageMetadataByPackageNames(packageNames),
          getAffectingVulnerabilities(scan.scanResult),
        ]);

        return toSerializable({
          ...scan,
          scanResult: {
            ...scan.scanResult,
            metadata,
            vulnerabilities,
          },
        });
      }

      return toSerializable(scan);
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
export type AppRouter = typeof appRouter;
