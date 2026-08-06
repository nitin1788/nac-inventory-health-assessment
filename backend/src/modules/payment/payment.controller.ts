import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { createOrder } from './payment.service';
import type { PaymentOrderRequest } from './payment.types';

export async function createPaymentOrderController(req: Request, res: Response): Promise<void> {
  const input = req.body as PaymentOrderRequest;
  const result = await createOrder(input);
  res.status(200).json(successResponse(result));
}
