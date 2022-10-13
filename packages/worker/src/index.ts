import { createWorker } from './app';
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
  Env.AwsS3Bucket,
  Env.DatabaseUrl,
  Env.InternalApiRootUrl,
  Env.SqsWorkerQueueUrl,
  Env.RollbarApiKey,
]);

const port = getPort(8080);

initRollbarLogger();

initDatabase({ runMigrations: true }).then(() => {
  createWorker().listen(port, () => {
    logger.info(`gradejs worker started, listening on port ${port}`);
  });
});
