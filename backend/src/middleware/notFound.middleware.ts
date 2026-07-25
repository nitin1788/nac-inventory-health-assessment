import type { Request, Response } from 'express';
import { errorResponse } from '../utils/apiResponse';

/**
 * Catches any request that didn't match a route. Registered after all
 * routes but before the error handler.
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  res
    .status(404)
    .json(errorResponse('NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`));
}
