import { Router } from 'express';
import { healthRouter } from './health.route';

/**
 * Central mounting point for every route module. As assessment,
 * question-bank, etc. routers are built in later milestones, they are
 * registered here — app.ts only ever imports this single router.
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);

// Milestone 4+: apiRouter.use('/assessments', assessmentRouter);
// Milestone 4+: apiRouter.use('/questions', questionRouter);
