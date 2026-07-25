import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { API_PREFIX } from './config/constants';
import { apiRouter } from './routes';
import { requestLoggerMiddleware } from './middleware/requestLogger.middleware';
import { defaultRateLimiter } from './middleware/rateLimiter.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';

/**
 * Builds and returns the configured Express application. Kept separate
 * from server.ts (which starts the HTTP listener) so the app instance
 * can be imported directly in tests without binding a port.
 */
export function createApp(): Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS — locked to the configured frontend origin
  app.use(cors(corsOptions));

  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Request logging (method/path/status/duration only — no bodies)
  app.use(requestLoggerMiddleware);

  // General API rate limiting; stricter, endpoint-specific limits are
  // applied on top of this where needed (e.g. assessment submission)
  app.use(API_PREFIX, defaultRateLimiter);

  // Routes
  app.use(API_PREFIX, apiRouter);

  // 404 for anything unmatched
  app.use(notFoundMiddleware);

  // Central error handler — must be registered last
  app.use(errorHandlerMiddleware);

  return app;
}
