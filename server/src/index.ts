import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './prisma.js';
import { logger } from './utils/logger.js';

const server = app.listen(config.PORT, async () => {
  logger.info(`🚀 SmileCare AI Backend server running on port ${config.PORT}`);
  try {
    await prisma.$connect();
    logger.info('✅ Database connection established successfully via Prisma');
  } catch (err) {
    logger.error('❌ Failed to connect to PostgreSQL database:', err);
  }
});

const gracefulShutdown = async () => {
  logger.info('Shutting down server gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Database disconnected. Process exited.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
