import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  ChangeMessageVisibilityCommand,
} from '@aws-sdk/client-sqs';
import fetch from 'node-fetch';

/*
 * Simple server to pull messages from FE queue and push it into worker
 * express app. Intended to be used ONLY LOCALLY, since AWS has this functionality
 * built-in (contrary to elasticmq).
 */

// This hardcode should be in sync with values in local_start.sh
const workerRootUrl = process.env.WORKER_ROOT_URL ?? '';
const sqsEndpoint = process.env.SQS_ENDPOINT ?? '';
const sqsQueueUrl = '/test/frontend-queue';
const timeout = 300; // sec, visibility timeout
const pollInterval = 20; // sec

if (!workerRootUrl || !sqsEndpoint) {
  throw new Error('WORKER_ROOT_URL and SQS_ENDPOINT must be defined');
}

export async function startWorker(loop = true) {
  let currentTask: WorkerTaskWrapper | undefined;

  async function abortTimeoutCallback() {
    if (currentTask) {
      await skipWorkerTask(currentTask);
    }

    // Restart the application
    process.exit();
  }

  do {
    try {
      currentTask = await receiveNextWorkerTask();

      if (currentTask) {
        const abortTimeoutId = setTimeout(() => abortTimeoutCallback(), timeout * 1000);
        await fetch(workerRootUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentTask.body),
        });
        clearTimeout(abortTimeoutId);
        await deleteWorkerTask(currentTask);
      } else {
        await wait(pollInterval);
      }
    } catch (e) {
      console.log(e);

      if (currentTask) {
        await skipWorkerTask(currentTask);
      }
    }
    // eslint-disable-next-line no-unmodified-loop-condition
  } while (loop);
}

let sqsClient: SQSClient | undefined;
function getSQSClient() {
  if (!sqsClient) {
    sqsClient = new SQSClient({
      endpoint: sqsEndpoint,
    });
  }

  return sqsClient;
}

export async function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export type WorkerTaskWrapper = {
  receiptHandle?: string;
  body: any;
};

export async function receiveNextWorkerTask(): Promise<WorkerTaskWrapper | undefined> {
  const client = getSQSClient();
  const command = new ReceiveMessageCommand({
    QueueUrl: sqsQueueUrl,
    MaxNumberOfMessages: 1,
    MessageAttributeNames: ['All'],
    VisibilityTimeout: timeout,
    WaitTimeSeconds: pollInterval,
  });

  try {
    const result = await client.send(command);
    const message = result.Messages?.pop();

    if (message?.Body) {
      return {
        receiptHandle: message.ReceiptHandle,
        body: JSON.parse(message.Body),
      };
    }
  } catch (e) {
    console.error(e);
  }

  return undefined;
}

export async function deleteWorkerTask({ receiptHandle }: { receiptHandle?: string }) {
  if (!receiptHandle) {
    return;
  }

  const client = getSQSClient();
  const command = new DeleteMessageCommand({
    QueueUrl: sqsQueueUrl,
    ReceiptHandle: receiptHandle,
  });

  return client.send(command);
}

export async function skipWorkerTask({ receiptHandle }: { receiptHandle?: string }) {
  if (!receiptHandle) {
    return;
  }

  const client = getSQSClient();
  const command = new ChangeMessageVisibilityCommand({
    QueueUrl: sqsQueueUrl,
    ReceiptHandle: receiptHandle,
    VisibilityTimeout: 0,
  });

  return client.send(command);
}

(async function () {
  await startWorker(true);
})();
