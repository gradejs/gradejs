export enum Env {
  // General
  Node = 'NODE_ENV',
  Port = 'PORT',
  DatabaseUrl = 'DB_URL',

  // AWS
  AwsRegion = 'AWS_REGION',
  SqsWorkerQueueUrl = 'SQS_WORKER_QUEUE_URL',
  SqsLocalPort = 'SQS_LOCAL_PORT',

  // GitHub
  GitHubAccessToken = 'GITHUB_ACCESS_TOKEN',

  // Internal
  InternalApiOrigin = 'INTERNAL_API_ORIGIN',

  CorsAllowedOrigin = 'CORS_ALLOWED_ORIGIN',
}

export const getNodeEnv = () => {
  const env = getEnvUnsafe(Env.Node);
  if (!env || !['production', 'staging', 'development', 'test'].includes(env)) {
    return 'development';
  }
  return env as 'production' | 'staging' | 'development' | 'test';
};
export const getPort = (defaultPort: number) => Number(getEnv(Env.Port, defaultPort.toString()));

export const isProduction = () => getNodeEnv() === 'production';
export const isStaging = () => getNodeEnv() === 'staging';
export const isDevelopment = () => getNodeEnv() === 'development';
export const isTest = () => getNodeEnv() === 'test';

export const getInternalApiOrigin = () => getEnv(Env.InternalApiOrigin);
export const getSqsLocalPort = () => Number(getEnv(Env.SqsLocalPort, '0'));

export const getGitHubAccessToken = () => getEnv(Env.GitHubAccessToken);

export const getCorsAllowedOrigins = () => {
  const origins = getEnvUnsafe(Env.CorsAllowedOrigin);
  if (!origins) {
    return [];
  }

  return origins.split(',').map((origin) => origin.trim());
};

export function getEnv(name: string, defaultValue?: string) {
  const value = process.env[name];

  if (!value && defaultValue === undefined && !isTest()) {
    throw new Error(`${name} environment variable is not defined`);
  }

  return value ?? defaultValue ?? '';
}

export function getEnvUnsafe(name: string) {
  return process.env[name];
}

export function checkRequiredEnvironmentVariables(keys: Env[]) {
  keys.forEach((key) => key && getEnv(key));
}
