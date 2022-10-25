import { SQSClient, SendMessageCommand, SQSClientConfig } from '@aws-sdk/client-sqs';
import { WorkerTaskPayloadMap, WorkerTaskType } from '../worker/types';
import { getEnv, Env, getEnvUnsafe } from './env';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

let s3Client: S3Client | undefined;
export function getS3Client() {
  if (!s3Client) {
    const config: S3ClientConfig = {};

    const s3Endpoint = getEnvUnsafe(Env.S3Endpoint);
    const s3AccessKey = getEnvUnsafe(Env.S3AccessKey);
    const s3SecretKey = getEnvUnsafe(Env.S3SecretKey);

    if (s3Endpoint) {
      config.endpoint = s3Endpoint;
      config.forcePathStyle = true;
    } else {
      config.region = getEnv(Env.AwsRegion);
    }

    if (s3AccessKey && s3SecretKey) {
      config.credentials = {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretKey,
      };
    }

    s3Client = new S3Client(config);
  }

  return s3Client;
}

let sqsClient: SQSClient | undefined;
export function getSQSClient() {
  if (!sqsClient) {
    const config: SQSClientConfig = {};

    const sqsEndpoint = getEnvUnsafe(Env.SqsEndpoint);
    if (sqsEndpoint) {
      config.endpoint = sqsEndpoint;
    } else {
      config.region = getEnv(Env.AwsRegion);
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
