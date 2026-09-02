import { Router } from 'express';
import { healthRouter } from './health.route';
import { assessmentRouter, reportRouter } from '../modules/assessment/assessment.route';
import { paymentRouter } from '../modules/payment/payment.route';
import { businessHealthCheckRouter } from '../modules/businessHealthCheck/businessHealthCheck.route';

/**
 * Central mounting point for every route module. As assessment,
 * question-bank, etc. routers are built in later milestones, they are
 * registered here — app.ts only ever imports this single router.
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/assessments', assessmentRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/business-health-check', businessHealthCheckRouter);

// Milestone 4+: apiRouter.use('/questions', questionRouter);
