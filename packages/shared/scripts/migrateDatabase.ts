/**
 * This script is only for CI migrations or development purposes
 */
import {
  getDatabaseConnection,
  initDatabase,
  getMigrationExecutor,
} from '../src/database/connection';

const databaseUrl =
  process.env.DB_URL ?? 'postgres://gradejs:gradejs@localhost:5432/gradejs-public';
const action = process.argv[2];

if (action === 'revert') {
  undoLast();
} else {
  migrate();
}

async function migrate() {
  initDatabase({ runMigrations: true, databaseUrl }).then(({ migrations }) => {
    console.log('Successful', migrations);
    process.exit();
  });
}

async function undoLast() {
  const connection = await getDatabaseConnection(databaseUrl);
  const executor = await getMigrationExecutor(connection);
  const executed = await executor.getExecutedMigrations();
  const lastMigration = executed[0];

  await executor.undoLastMigration();

  console.log('Successfully reverted last migration:\n', lastMigration);
  process.exit();
}
