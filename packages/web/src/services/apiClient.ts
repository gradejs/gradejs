import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from '../../../public-api/src/router';

export const client = createTRPCClient<AppRouter>({
  url: process.env.API_ORIGIN!,
});

export type ApiClient = typeof client;
