import Rollbar from 'rollbar';
import { getProdEnv, getEnv, Env, getEnvUnsafe } from './env';

interface LogMethod {
  (message: string, ...meta: unknown[]): void;
  (error: Error | unknown, ...meta: unknown[]): void;
}

type LogLevel = keyof Pick<Logger, 'error' | 'warn' | 'debug' | 'info' | 'verbose'>;

interface ErrorData {
  message?: string;
  error?: Error;
  meta?: Record<string, unknown>;
}

export interface LoggerTransport {
  log(level: LogLevel, data: ErrorData): void;
}

// default console logger
export const logger = createLogger([console]);

export async function initRollbarLogger() {
  if (getEnvUnsafe(Env.RollbarApiKey)) {
    logger.addTransport(createRollbarTransport());
  }
}

export interface Logger {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  verbose: LogMethod;

  addTransport: (transport: LoggerTransport) => void;
}

function createLogger(transports: LoggerTransport[] = []): Logger {
  const _transports = transports;

  return {
    error: log.bind(null, 'error'),
    warn: log.bind(null, 'warn'),
    info: log.bind(null, 'info'),
    debug: log.bind(null, 'debug'),
    verbose: log.bind(null, 'verbose'),

    addTransport(transport: LoggerTransport) {
      _transports.push(transport);
    },
  };

  function log(level: LogLevel, message: string | Error | unknown, ...meta: unknown[]) {
    const metaObj = getErrorMeta(message, meta);

    _transports.forEach((tr) => {
      tr.log(level, metaObj);
    });
  }
}

export function createRollbarTransport(): LoggerTransport {
  const rollbar = new Rollbar({
    accessToken: getEnv(Env.RollbarApiKey),
    environment: getProdEnv(),
    captureUncaught: true,
    captureUnhandledRejections: true,
    reportLevel: 'info',
  });

  return {
    log(level: LogLevel, { message, error, meta }: ErrorData) {
      // skip verbose messages
      if (level === 'verbose') {
        return;
      }

      process.nextTick(() => {
        const rollbarLevel = level === 'warn' ? 'warning' : level;
        const logMethod = rollbar[rollbarLevel];

        logMethod.call(rollbar, message, error, meta);
      });
    },
  };
}

/**
 * Since we support pretty flexible Winston style API where you can pass various types
 * in an arbitrary places we have to normalize the payload for transports here
 */
function getErrorMeta(message: string | Error | unknown, meta: unknown[]): ErrorData {
  const isMessageString = typeof message === 'string';
  const isMessageError = message instanceof Error;
  const [firstMetaParam] = meta;
  const isMetaError = meta.length === 1 && firstMetaParam instanceof Error;

  if (isMessageError && isMetaError) {
    const error = `Unsupported usage of log function, you can't provide exception as both: message and payload`;
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(error);
  }

  if (isMessageError) {
    return {
      message: message.name + ': ' + message.message,
      error: message,
      meta: convertMetaArgumentsToObject(meta),
    };
  }

  const resultMessage = isMessageString ? message : 'Unknown message type';

  if (isMetaError) {
    return { message: resultMessage, error: firstMetaParam, meta: {} };
  }

  return {
    message: resultMessage,
    meta: convertMetaArgumentsToObject(meta),
  };
}

function convertMetaArgumentsToObject(meta: unknown[]) {
  return meta.reduce<Record<string, unknown>>(
    (acc, curr) => (typeof curr === 'object' ? { ...acc, ...curr } : acc),
    {}
  );
}
