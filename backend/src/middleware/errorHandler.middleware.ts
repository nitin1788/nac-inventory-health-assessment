import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { isProduction } from '../config/env';

/**
 * Single place where every error in the app is translated into the
 * standard API error response. Controllers/services never build their
 * own error responses — they throw AppError (or let unexpected errors
 * propagate) and this middleware does the rest.
 *
 * Must be registered LAST, after all routes, per Express convention.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known, operational errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path }, err.message);
    } else {
      logger.warn({ code: err.code, path: req.path }, err.message);
    }
    res.status(err.statusCode).json(errorResponse(err.code, err.message, err.details));
    return;
  }

  // Zod validation errors that slipped through without being wrapped
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      issue: e.message,
    }));
    res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid request data', details));
    return;
  }

  // Unexpected errors — log full detail server-side, never leak internals to the client
  const error = err instanceof Error ? err : new Error('Unknown error');
  logger.error({ err: error, path: req.path }, 'Unhandled error');

  res
    .status(500)
    .json(
      errorResponse(
        'INTERNAL_ERROR',
        isProduction ? 'Something went wrong. Please try again.' : error.message
      )
    );
}
