import pino from 'pino';
import { isProduction } from '../config/env';

/**
 * Structured logger. JSON output in production (for Railway's log
 * ingestion), human-readable pretty output in development.
 *
 * Do NOT log full request bodies or PII (email, phone) at info/debug
 * level — see requestLogger.middleware.ts, which deliberately omits
 * request bodies from its log lines.
 */
export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
});
