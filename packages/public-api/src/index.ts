import { createApp } from './app';
import {
  initDatabase,
  getPort,
  checkRequiredEnvironmentVariables,
  Env,
  initRollbarLogger,
  logger,
} from '@gradejs-public/shared';

checkRequiredEnvironmentVariables([
  Env.AwsRegion,
  Env.DatabaseUrl,
  Env.SqsWorkerQueueUrl,
  Env.InternalApiRootUrl,
  Env.GradeJsApiKey,
]);

const port = getPort(8080);
initRollbarLogger();

initDatabase({ runMigrations: true })
  .then(() => {
    createApp().listen(port, () => {
      logger.info(`gradejs api started, listening on port ${port}`);
    });
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
