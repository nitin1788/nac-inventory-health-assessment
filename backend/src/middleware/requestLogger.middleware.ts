import pinoHttp from 'pino-http';
import { logger } from '../utils/logger';

/**
 * Logs method, path, status code, and response time for every request.
 * Deliberately does NOT log request bodies — assessment submissions
 * contain PII (name, email, phone) that should never land in plaintext
 * logs.
 */
export const requestLoggerMiddleware = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
