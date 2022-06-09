import path from 'path';
import { createConnection, Connection, MigrationExecutor } from 'typeorm';
import { getEnv, Env } from '../utils/env';
import { NamingStrategy } from './namingStrategy';

/**
 * Creates a connection instance to database and can automatically run all migrations
 * Ref: https://typeorm.io/#/connection
 */
export async function initDatabase({
  runMigrations = false,
  databaseUrl = getEnv(Env.DatabaseUrl),
} = {}) {
  const connection = await getDatabaseConnection(databaseUrl);

  if (runMigrations) {
    const executor = await getMigrationExecutor(connection);
    const migrations = await executor.executePendingMigrations();

    return { connection, migrations: migrations.map(({ name }) => name) };
  } else {
    return { connection, migrations: [] };
  }
}

let dbConnection: Promise<Connection> | undefined;

/**
 * Ref: https://typeorm.io/#/using-ormconfig
 */
export async function getDatabaseConnection(databaseUrl: string = getEnv(Env.DatabaseUrl)) {
  if (!dbConnection) {
    dbConnection = createConnection({
      type: 'postgres',
      url: databaseUrl,
      namingStrategy: new NamingStrategy(),
      entities: [path.join(__dirname, 'entities/*')],
      migrations: [path.join(__dirname, 'migrations/*')],
      migrationsTableName: 'typeorm_migrations',
      logging: false,
    });
  }

  return dbConnection;
}

export async function getMigrationExecutor(connection: Connection) {
  const queryRunner = connection.createQueryRunner();
  return new MigrationExecutor(connection, queryRunner);
}
