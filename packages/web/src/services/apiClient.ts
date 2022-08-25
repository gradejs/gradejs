import { createTRPCClient } from '@trpc/client';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter, Api } from '../../../public-api/src/router';

// Helper types
export type TQuery = keyof AppRouter['_def']['queries'];
export type TMutation = keyof AppRouter['_def']['mutations'];
export type InferMutationOutput<TRouteKey extends TMutation> = inferProcedureOutput<
  AppRouter['_def']['mutations'][TRouteKey]
>;
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>;

if (!process.env.API_ORIGIN) {
  throw new Error('API_ORIGIN must be defined');
}

export const client = createTRPCClient<AppRouter>({
  url: process.env.API_ORIGIN,
});

export type SyncWebsiteOutput = InferMutationOutput<'syncWebsite'>;
export type RequestParseWebsiteOutput = InferMutationOutput<'requestParseWebsite'>;
export type { Api };
export type ApiClient = typeof client;
