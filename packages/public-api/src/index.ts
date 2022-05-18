import { createApp } from './app';
import {
  initDatabase,
  getPort,
  checkRequiredEnvironmentVariables,
  Env,
} from '@gradejs-public/shared';

checkRequiredEnvironmentVariables([Env.DatabaseUrl, Env.InternalApiOrigin]);

const port = getPort(8080);

initDatabase({ runMigrations: true }).then(() => {
  createApp().listen(port, () => {
    console.log(`gradejs api started, listening on port ${port}`);
  });
});
