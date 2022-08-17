import * as trpc from '@trpc/server';
// See also: https://colinhacks.com/essays/painless-typesafety
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { z, ZodError } from 'zod';
import { NotFoundError } from './middleware/response';
import {
  getPackagesByHostname,
  getWebPagesByHostname,
  requestWebPageParse,
  syncWebPage,
} from './website/service';
import { getAffectingVulnerabilities } from './vulnerabilities/vulnerabilities';
import { toSerializable } from '@gradejs-public/shared';

const hostnameRe =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

// created for each request
export const createContext = (_: CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const appRouter = trpc
  .router<Context>()
  .query('healthcheck', {
    resolve() {
      return 'gradejs-public-api';
    },
  })
  .mutation('syncWebsite', {
    input: z.string().regex(hostnameRe),
    async resolve({ input: hostname }) {
      const webpages = await getWebPagesByHostname(hostname);

      if (webpages.length === 0) {
        throw new NotFoundError();
      }

      await Promise.all(webpages.map(syncWebPage));
      const packages = await getPackagesByHostname(hostname);
      const vulnerabilities = await getAffectingVulnerabilities(packages);

      return {
        webpages: webpages.map(toSerializable),
        packages: packages.map(toSerializable),
        vulnerabilities,
      };
    },
  })
  .mutation('requestParseWebsite', {
    input: z.string().url(),
    async resolve({ input: url }) {
      return toSerializable(await requestWebPageParse(url));
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
