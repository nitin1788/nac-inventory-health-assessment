import type { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async Express handler so any rejected promise is forwarded
 * to next(err) automatically. Without this, an unhandled rejection in
 * an async controller would crash the request silently instead of
 * reaching errorHandler.middleware.ts.
 */
export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}
