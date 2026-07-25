import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { APP_NAME } from './config/constants';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 ${APP_NAME} API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

function shutdown(signal: string): void {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});
