import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { submitLead } from './leads.service';
import type { SubmitLeadInput } from './leads.validation';

export async function submitLeadController(req: Request, res: Response): Promise<void> {
  const input = req.body as SubmitLeadInput;
  await submitLead(input);
  res.status(201).json(successResponse({ delivered: true }));
}
