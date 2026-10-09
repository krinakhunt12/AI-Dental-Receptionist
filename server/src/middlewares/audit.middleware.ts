import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { logger } from '../utils/logger.js';

export const logAudit = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Record original res.send to capture response after completion
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const resourceId = req.params.id || req.body.id || null;
          await prisma.auditLog.create({
            data: {
              clinicId: req.clinicId || req.user?.clinicId || null,
              userId: req.user?.userId || null,
              action,
              resource,
              resourceId: resourceId ? String(resourceId) : null,
              ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null,
              userAgent: req.headers['user-agent'] || null,
              details: {
                method: req.method,
                path: req.originalUrl,
                query: req.query,
              },
            },
          });
        } catch (err) {
          logger.error('Failed to save audit log:', err);
        }
      }
    });
    next();
  };
};
