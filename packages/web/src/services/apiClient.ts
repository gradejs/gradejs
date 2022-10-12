import { createTRPCClient } from '@trpc/client';
import type { inferProcedureOutput } from '@trpc/server';
import type { ClientApiRouter, ClientApi } from '@gradejs-public/public-api/src/clientApiRouter';

// Helper types
export type TQuery = keyof ClientApiRouter['_def']['queries'];
export type TMutation = keyof ClientApiRouter['_def']['mutations'];
export type InferMutationOutput<TRouteKey extends TMutation> = inferProcedureOutput<
  ClientApiRouter['_def']['mutations'][TRouteKey]
>;
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  ClientApiRouter['_def']['queries'][TRouteKey]
>;

// Temporary fix for storybook
const url = process.env.API_ORIGIN ? new URL('/client', process.env.API_ORIGIN) : '';

export const client = createTRPCClient<ClientApiRouter>({
  url: url.toString(),
  headers: {
    Origin: process.env.CORS_ORIGIN,
  },
});

export type GetOrRequestWebPageRescanOutput = InferMutationOutput<'getOrRequestWebPageScan'>;
export type GetShowcaseOutput = InferQueryOutput<'getShowcase'>;
export type GetPackageInfoOutput = InferQueryOutput<'getPackageInfo'>;
export type { ClientApi };
export type ApiClient = typeof client;
