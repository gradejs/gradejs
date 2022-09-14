import { createApp } from './app';
import {
  initDatabase,
  getPort,
  checkRequiredEnvironmentVariables,
  Env,
} from '@gradejs-public/shared';

checkRequiredEnvironmentVariables([
  Env.AwsRegion,
  Env.DatabaseUrl,
  Env.SqsWorkerQueueUrl,
  Env.InternalApiRootUrl,
  Env.GradeJsApiKey,
]);

const port = getPort(8080);

initDatabase({ runMigrations: true }).then(() => {
  createApp().listen(port, () => {
    console.log(`gradejs api started, listening on port ${port}`);
  });
});
