import { createApp } from './app';
import { initDatabase } from './database/connection';
import { getPort, checkRequiredEnvironmentVariables, Env } from './utils/env';

checkRequiredEnvironmentVariables([Env.DatabaseUrl, Env.InternalApiOrigin]);

const port = getPort(8080);

initDatabase({ runMigrations: true }).then(() => {
  createApp().listen(port, () => {
    console.log(`gradejs api started, listening on port ${port}`);
  });
});
