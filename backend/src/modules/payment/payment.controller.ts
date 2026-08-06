import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { createOrder, verifyAndFulfillOrder } from './payment.service';
import type { PaymentOrderRequest } from './payment.types';

export async function createPaymentOrderController(req: Request, res: Response): Promise<void> {
  const input = req.body as PaymentOrderRequest;
  const result = await createOrder(input);
  res.status(200).json(successResponse(result));
}

/**
 * Never trusts the frontend's own claim that payment succeeded — the
 * request body only carries `orderId`; the actual paid/not-paid fact
 * comes from verifyAndFulfillOrder() asking the active PaymentProvider
 * (see payment.service.ts). Report generation and email only happen as
 * a side effect of that call, never here directly.
 */
export async function verifyPaymentController(req: Request, res: Response): Promise<void> {
  const { orderId } = req.body as { orderId: string };
  const result = await verifyAndFulfillOrder(orderId);
  res.status(200).json(successResponse(result));
}
