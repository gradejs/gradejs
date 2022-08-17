import { SQSClient, SendMessageCommand, SQSClientConfig } from '@aws-sdk/client-sqs';
import { WorkerTaskPayloadMap, WorkerTaskType } from '../worker/types';
import { getEnv, Env, getSqsLocalPort } from './env';

let sqsClient: SQSClient | undefined;
function getSQSClient() {
  if (!sqsClient) {
    let config: SQSClientConfig = { region: getEnv(Env.AwsRegion) };
    if (getSqsLocalPort() > 0) {
      // Local development override
      config = {
        endpoint: {
          protocol: 'http',
          hostname: 'localhost',
          port: getSqsLocalPort(),
          path: '/',
        },
      };
    }
    sqsClient = new SQSClient(config);
  }

  return sqsClient;
}

export async function queueWorkerTask<K extends WorkerTaskType>(
  type: K,
  payload: WorkerTaskPayloadMap[K],
  delaySeconds = 0
) {
  const client = getSQSClient();
  const command = new SendMessageCommand({
    MessageBody: JSON.stringify({ type, payload }),
    DelaySeconds: delaySeconds,
    QueueUrl: getEnv(Env.SqsWorkerQueueUrl),
  });

  return client.send(command);
}
