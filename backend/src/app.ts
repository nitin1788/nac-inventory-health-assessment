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

  // Trust the first hop reverse proxy (Render and similar PaaS hosts sit
  // in front of the app). Required for express-rate-limit to key off the
  // real client IP from X-Forwarded-For instead of the proxy's IP — and
  // to avoid express-rate-limit's ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
  // validation error, which throws when that header is present but trust
  // proxy isn't configured. Value of 1 trusts exactly one hop.
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS — locked to the configured frontend origin
  app.use(cors(corsOptions));

  // Body parsing. 8mb (not the previous 1mb) to accommodate the Business
  // Health Check tool's report-email endpoint, which receives the
  // client-generated branded PDF as base64 JSON (~3.5-4MB for a typical
  // report). Every route's own Zod schema still strictly constrains
  // shape/content regardless of this transport-level ceiling, so raising
  // it doesn't loosen validation on any other endpoint.
  app.use(express.json({ limit: '8mb' }));
  app.use(express.urlencoded({ extended: true, limit: '8mb' }));

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
