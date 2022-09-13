export enum Env {
  // General
  Node = 'NODE_ENV',
  Port = 'PORT',
  DatabaseUrl = 'DB_URL',

  // Web related
  PublicApiOrigin = 'API_ORIGIN',
  PublicCorsOrigin = 'CORS_ORIGIN',
  PublicRootUrl = 'PUBLIC_ROOT_URL',
  PlausibleDomain = 'PLAUSIBLE_DOMAIN',
  AnalyticsId = 'GA_ID',
  VerboseAnalytics = 'DUMP_ANALYTICS',

  // AWS
  AwsRegion = 'AWS_REGION',
  SqsWorkerQueueUrl = 'SQS_WORKER_QUEUE_URL',
  SqsLocalPort = 'SQS_LOCAL_PORT',

  // GitHub
  GitHubAccessToken = 'GITHUB_ACCESS_TOKEN',

  // Internal
  InternalApiRootUrl = 'INTERNAL_API_ROOT_URL',
  GradeJsApiKey = 'GRADEJS_API_KEY',

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

export const getInternalApiRootUrl = () => {
  if (isTest()) {
    return getEnvUnsafe(Env.InternalApiRootUrl) ?? 'https://api.test.gradejs.com/';
  }

  return getEnv(Env.InternalApiRootUrl);
};
export const getGradeJsApiKey = () => {
  if (isTest()) {
    return getEnvUnsafe(Env.GradeJsApiKey) ?? 'TEST_API_KEY';
  }

  return getEnv(Env.GradeJsApiKey);
};

export const getSqsLocalPort = () => Number(getEnv(Env.SqsLocalPort, '0'));

export const getGitHubAccessToken = () => getEnv(Env.GitHubAccessToken);

export const getCorsAllowedOrigins = () => {
  const origins = getEnvUnsafe(Env.CorsAllowedOrigin);
  if (!origins) {
    return [];
  }

  return origins.split(',').map((origin) => origin.trim());
};

export const getPublicRootUrl = () => getEnv(Env.PublicRootUrl);

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

export const getClientVars = () => {
  return [
    Env.PublicRootUrl,
    Env.PublicApiOrigin,
    Env.PublicCorsOrigin,
    Env.PlausibleDomain,
    Env.AnalyticsId,
    Env.VerboseAnalytics,
  ].reduce((acc, val) => {
    acc[val] = getEnvUnsafe(val) ?? '';
    return acc;
  }, {} as Record<string, string>);
};
