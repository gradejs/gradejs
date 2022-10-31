import { getDatabaseConnection, Hostname } from '@gradejs-public/shared';
import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import { syncHostnameRanking } from './syncHostnameRanking';

useDatabaseConnection();
useTransactionalTesting();

jest.setTimeout(50000);

describe('task / syncHostnamePopularity', () => {
  it('should update rankings', async () => {
    const connection = await getDatabaseConnection();

    await connection.getRepository(Hostname).insert([
      { hostname: 'invalid-any-hostname.com', globalRank: 1 },
      { hostname: 'google.com', globalRank: undefined },
      { hostname: 'ebay.com', globalRank: undefined },
      { hostname: 'subdomain.ebay.com', globalRank: undefined },
    ]);

    await syncHostnameRanking();

    const updatedEntries = await connection.getRepository(Hostname).find();

    expect(updatedEntries.find((it) => it.hostname === 'invalid-any-hostname.com')).toMatchObject({
      globalRank: null,
    });

    expect(updatedEntries.find((it) => it.hostname === 'google.com')).toMatchObject({
      globalRank: expect.any(Number),
    });

    expect(updatedEntries.find((it) => it.hostname === 'ebay.com')).toMatchObject({
      globalRank: expect.any(Number),
    });

    expect(updatedEntries.find((it) => it.hostname === 'subdomain.ebay.com')).toMatchObject({
      globalRank: expect.any(Number),
    });
  });
});
