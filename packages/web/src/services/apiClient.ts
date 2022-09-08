import { createTRPCClient } from '@trpc/client';
import type { inferProcedureOutput } from '@trpc/server';
import type { ClientApiRouter, ClientApi } from '@gradejs-public/public-api/src/clientApiRouter';

// polyfill fetch, trpc needs it
import f from 'node-fetch';

// Helper types
export type TQuery = keyof ClientApiRouter['_def']['queries'];
export type TMutation = keyof ClientApiRouter['_def']['mutations'];
export type InferMutationOutput<TRouteKey extends TMutation> = inferProcedureOutput<
  ClientApiRouter['_def']['mutations'][TRouteKey]
>;
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  ClientApiRouter['_def']['queries'][TRouteKey]
>;

if (!process.env.API_ORIGIN) {
  throw new Error('API_ORIGIN must be defined');
}

export const client = createTRPCClient<ClientApiRouter>({
  url: new URL('/client', process.env.API_ORIGIN).toString(),
  fetch: typeof window === 'undefined' ? (f as any) : window.fetch.bind(window),
  headers: {
    Origin: process.env.CORS_ORIGIN,
  },
});

export type RequestWebPageScanOutput = InferMutationOutput<'requestWebPageScan'>;
export type { ClientApi };
export type ApiClient = typeof client;
