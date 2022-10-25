export enum Env {
  // General
  Node = 'NODE_ENV',
  Port = 'PORT',
  DatabaseUrl = 'DB_URL',
  ProdEnv = 'PROD_ENV', // staging or production

  // Web related
  PublicApiOrigin = 'API_ORIGIN',
  PublicCorsOrigin = 'CORS_ORIGIN',
  PublicRootUrl = 'PUBLIC_ROOT_URL',
  PlausibleDomain = 'PLAUSIBLE_DOMAIN',
  AnalyticsId = 'GA_ID',
  VerboseAnalytics = 'DUMP_ANALYTICS',

  // Third-Party
  RollbarApiKey = 'ROLLBAR_API_KEY',

  // AWS
  AwsRegion = 'AWS_REGION',
  AwsS3Bucket = 'AWS_S3_BUCKET',
  S3AccessKey = 'AWS_S3_ACCESS_KEY',
  S3SecretKey = 'AWS_S3_SECRET_KEY',
  S3Endpoint = 'AWS_S3_ENDPOINT',
  SqsWorkerQueueUrl = 'SQS_WORKER_QUEUE_URL',
  SqsEndpoint = 'SQS_ENDPOINT',

  // GitHub
  GitHubAccessToken = 'GITHUB_ACCESS_TOKEN',

  // Internal
  InternalApiRootUrl = 'INTERNAL_API_ROOT_URL',
  GradeJsApiKey = 'GRADEJS_API_KEY',

  CorsAllowedOrigin = 'CORS_ALLOWED_ORIGIN',
}

export const getNodeEnv = () => {
  const env = getEnvUnsafe(Env.Node);
  if (!env || !['production', 'development', 'test'].includes(env)) {
    return 'development';
  }
  return env as 'production' | 'development' | 'test';
};
export const getProdEnv = () =>
  getEnvUnsafe(Env.ProdEnv) === 'staging' ? 'staging' : 'production';
export const getPort = (defaultPort: number) => Number(getEnv(Env.Port, defaultPort.toString()));

export const isProduction = () => getNodeEnv() === 'production' && getProdEnv() === 'production';
export const isStaging = () => getNodeEnv() === 'production' && getProdEnv() === 'staging';
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

export const getAwsRegion = () => getEnv(Env.AwsRegion);
export const getAwsS3Bucket = () => getEnv(Env.AwsS3Bucket);

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
    Env.RollbarApiKey,
    Env.ProdEnv,
  ].reduce((acc, val) => {
    acc[val] = getEnvUnsafe(val) ?? '';
    return acc;
  }, {} as Record<string, string>);
};
