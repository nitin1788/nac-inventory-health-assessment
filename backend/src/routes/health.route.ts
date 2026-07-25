import { Router, type Request, type Response } from 'express';
import { successResponse } from '../utils/apiResponse';
import { isSupabaseConfigured } from '../database/supabaseClient';
import type { HealthCheckResult } from '../types/common.types';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  const result: HealthCheckResult = {
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    dependencies: {
      supabase: isSupabaseConfigured() ? 'configured' : 'not_configured',
    },
  };

  res.status(200).json(successResponse(result));
});
