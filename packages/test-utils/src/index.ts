import http from 'http';
import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { TransactionalTestContext } from 'typeorm-transactional-tests';
import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { getDatabaseConnection, WorkerTask } from '@gradejs-public/shared';

export function createSupertestApi(createApp: Function) {
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
      // @ts-expect-error
      async (runInTransaction: (entityManager: EntityManager) => Promise<unknown>) => {
        const em = connection.createEntityManager();
        if (connection.createQueryRunner().isTransactionActive) {
          return await runInTransaction(em);
        } else {
          return await connection.transaction(runInTransaction);
        }
      }
    );
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });
}

export function expectQueuedTasks(tasks: WorkerTask[]) {
  const batchCalls = (SendMessageBatchCommand as jest.Mock).mock.calls;
  const singleCalls = (SendMessageCommand as jest.Mock).mock.calls;

  const expectedTasks = tasks.map((task) => JSON.stringify(task));
  const scheduledTasks = [
    ...batchCalls
      .map((commandArgs) => commandArgs[0])
      .flatMap((commandPayload) => commandPayload.Entries || [])
      .map((entry: any) => entry.MessageBody),

    ...singleCalls.map((commandArgs) => commandArgs[0]).map((entry: any) => entry.MessageBody),
  ];

  expect(scheduledTasks).toEqual(expectedTasks);

  if (tasks.length > 0) {
    expect(SQSClient.prototype.send).toHaveBeenCalled();
  }
}
