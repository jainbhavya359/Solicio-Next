import pino from 'pino';
import TelemetryModel from '@/src/models/TelemetryModel';
import connect from '@/src/dbConfig/dbConnection';

const isDev = process.env.NODE_ENV !== 'production';

const pinoLogger = pino({
  level: isDev ? 'trace' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    service: 'solicio-erp',
  },
  redact: {
    paths: ['password', 'token', 'secret', 'amount', 'creditCard', 'apiKey', '*.password', '*.token', '*.secret'],
    censor: '[REDACTED]',
  },
});

async function logToDb(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', message: string, metadata: any) {
  // Always log to terminal via Pino immediately
  pinoLogger[level](metadata || {}, message);

  try {
    // Ensure Mongoose is connected before creating a model entry
    await connect();

    // Mongoose creates entry asynchronously (fire and forget)
    TelemetryModel.create({
      level,
      message,
      trace_id: metadata?.trace_id || metadata?.traceId || null,
      user_id: metadata?.user_id || metadata?.userId || null,
      metadata,
    }).catch(err => {
      pinoLogger.error({ error: err.message }, "MongoDB Telemetry Write Failed");
    });
  } catch (error: any) {
    pinoLogger.error({ error: error.message }, "Telemetry DB connection failed");
  }
}

export const logger = {
  trace: (metadata: any, message: string) => logToDb('trace', message, metadata),
  debug: (metadata: any, message: string) => logToDb('debug', message, metadata),
  info: (metadata: any, message: string) => logToDb('info', message, metadata),
  warn: (metadata: any, message: string) => logToDb('warn', message, metadata),
  error: (metadata: any, message: string) => logToDb('error', message, metadata),
  fatal: (metadata: any, message: string) => logToDb('fatal', message, metadata),
};
