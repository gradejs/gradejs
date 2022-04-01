import http from 'http';
import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { TransactionalTestContext } from 'typeorm-transactional-tests';
import { createApp } from '../app';
import { getDatabaseConnection } from '../database/connection';

export function createSupertestApi() {
  const server = http.createServer(createApp());
  const api = supertest.agent(server);

  afterAll(() => {
    server.close();
  });

  return api;
}

/**
 * Shortcut for creating database connection inside a test
 */
export function useDatabaseConnection() {
  process.env.DB_URL = 'postgres://gradejs:gradejs@localhost:5432/gradejs-public';

  beforeAll(async () => {
    return getDatabaseConnection();
  });

  afterAll(async () => {
    return getConnection().close();
  });
}

/**
 * Executes all database queries as single transaction and reverts it after test
 */
export function useTransactionalTesting() {
  let transactionalContext: TransactionalTestContext;

  beforeEach(async () => {
    const connection = getConnection();
    transactionalContext = new TransactionalTestContext(connection);
    await transactionalContext.start();

    // PostgreSQL does not support multi level transactions, but our tests run inside a transaction
    // and our code may have transactions, so in this case we have a multi level transaction or
    // transaction inside transaction that does not work in postgresql, and to make it work without
    // any code and test changes we mock `Connection.transaction` function and create new transaction
    // if it is not started, or reuse existing one
    jest.spyOn(Connection.prototype, 'transaction').mockImplementation(
      // @ts-ignore
      async (runInTransaction: (entityManager: EntityManager) => Promise<unknown>) => {
        const em = connection.createEntityManager();
        if (connection.createQueryRunner().isTransactionActive) {
          await runInTransaction(em);
        } else {
          await connection.transaction(runInTransaction);
        }
      }
    );
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });
}
