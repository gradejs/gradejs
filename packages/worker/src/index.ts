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
  Env.PublicRootUrl,
]);

const port = getPort(8080);

initRollbarLogger();

initDatabase({ runMigrations: false })
  .then(() => {
    createWorker().listen(port, () => {
      logger.info(`gradejs worker started, listening on port ${port}`);
    });
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
