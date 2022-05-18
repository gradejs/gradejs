import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { WorkerTaskPayloadMap, WorkerTaskType } from '../worker/types';
import { getEnv, Env } from './env';

let sqsClient: SQSClient | undefined;
function getSQSClient() {
  if (!sqsClient) {
    sqsClient = new SQSClient({ region: getEnv(Env.AwsRegion) });
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
