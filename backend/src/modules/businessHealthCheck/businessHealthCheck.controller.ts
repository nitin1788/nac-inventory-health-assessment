import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { submitBusinessHealthCheckReport } from './businessHealthCheck.service';
import type { SubmitBusinessHealthCheckReportInput } from './businessHealthCheck.validation';

export async function submitBusinessHealthCheckReportController(req: Request, res: Response): Promise<void> {
  const input = req.body as SubmitBusinessHealthCheckReportInput;
  await submitBusinessHealthCheckReport(input);
  res.status(201).json(successResponse({ delivered: true }));
}
