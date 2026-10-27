import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export class NotificationController {
  static async listStaffNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const unreadOnly = req.query.unreadOnly === 'true';

      const where: any = {
        clinicId: req.clinicId,
      };

      if (unreadOnly) {
        where.isRead = false;
      }

      const [notifications, unreadCount] = await Promise.all([
        prisma.staffNotification.findMany({
          where,
          include: {
            patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
            appointment: { select: { id: true, startTime: true, status: true } },
          },
          orderBy: [
            { isRead: 'asc' },
            { createdAt: 'desc' },
          ],
          take: 50,
        }),
        prisma.staffNotification.count({
          where: {
            clinicId: req.clinicId,
            isRead: false,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async acknowledgeNotification(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);

      const existing = await prisma.staffNotification.findFirst({
        where: { id, clinicId: req.clinicId },
      });

      if (!existing) {
        throw ApiError.notFound('Notification not found');
      }

      const updated = await prisma.staffNotification.update({
        where: { id },
        data: { isRead: true },
      });

      res.status(200).json({
        success: true,
        message: 'Notification acknowledged',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
