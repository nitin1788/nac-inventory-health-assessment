import type { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { successResponse } from '../../utils/apiResponse';
import { createOrder, verifyAndFulfillOrder } from './payment.service';
import type { PaymentOrderRequest } from './payment.types';

/**
 * Order creation must stay lightweight (no PDF/email/report work here —
 * see report.service.ts's deliverPaidReport, only ever invoked later
 * from verifyAndFulfillOrder). These timing logs exist to make that
 * verifiable in production: if `totalMs` ever creeps up, the cause is
 * order creation itself (DB/provider), not report generation, since
 * that literally cannot run on this path. IDs and durations only —
 * never a gateway's secret keys/salts, or full request payloads.
 */
export async function createPaymentOrderController(req: Request, res: Response): Promise<void> {
  const startedAt = Date.now();
  const input = req.body as PaymentOrderRequest;
  logger.info({ assessmentId: input.assessmentId, tier: input.tier }, 'Payment order request received.');

  const result = await createOrder(input);

  logger.info(
    {
      assessmentId: input.assessmentId,
      tier: input.tier,
      orderId: result.orderId,
      status: result.status,
      totalMs: Date.now() - startedAt,
    },
    'Payment order response ready.'
  );

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
