export enum Env {
  // General
  Node = 'NODE_ENV',
  Port = 'PORT',
  DatabaseUrl = 'DB_URL',

  // AWS
  AwsRegion = 'AWS_REGION',
  SqsWorkerQueueUrl = 'SQS_WORKER_QUEUE_URL',

  // Internal
  InternalApiOrigin = 'INTERNAL_API_ORIGIN',
}

export const getNodeEnv = () => getEnvUnsafe(Env.Node) || 'development';
export const getPort = (defaultPort: number) => Number(getEnv(Env.Port, defaultPort.toString()));

export const isProduction = () => getNodeEnv() === 'production';
export const isStaging = () => getNodeEnv() === 'staging';
export const isDevelopment = () => getNodeEnv() === 'development';
export const isTest = () => getNodeEnv() === 'test';

export const getInternalApiOrigin = () => getEnv(Env.InternalApiOrigin);

export function getEnv(name: string, defaultValue?: string) {
  const value = process.env[name];

  if (!value && defaultValue === undefined && !isTest()) {
    throw new Error(`${name} environment variable is not defined`);
  }

  return value || defaultValue || '';
}

export function getEnvUnsafe(name: string) {
  return process.env[name];
}

export function checkRequiredEnvironmentVariables(keys: Env[]) {
  keys.forEach((key) => key && getEnv(key));
}
