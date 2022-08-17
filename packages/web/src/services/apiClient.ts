import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from '../../../public-api/src/router';

if (!process.env.API_ORIGIN) {
  throw new Error('API_ORIGIN must be defined');
}

export const client = createTRPCClient<AppRouter>({
  url: process.env.API_ORIGIN,
});

export type ApiClient = typeof client;
