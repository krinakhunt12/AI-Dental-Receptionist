import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ConsentStatus, NotificationChannel, ReminderJobStatus, Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export const updateConsentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Patient ID is required'),
  }),
  body: z.object({
    channel: z.nativeEnum(NotificationChannel),
    status: z.nativeEnum(ConsentStatus),
    source: z.string().optional(),
  }),
});

export const retryJobSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Reminder Job ID is required'),
  }),
});

export class ReminderController {
  /**
   * GET /reminder-jobs
   * Lists all reminder jobs for the clinic with status filter and pagination.
   */
  static async listJobs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '20'), 10);
      const status = req.query.status ? (req.query.status as ReminderJobStatus) : undefined;
      const skip = (page - 1) * limit;

      const where: any = {
        clinicId: req.clinicId,
      };

      if (status) {
        where.status = status;
      }

      const [jobs, total] = await Promise.all([
        prisma.reminderJob.findMany({
          where,
          include: {
            patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
            appointment: { select: { id: true, startTime: true, status: true } },
            instruction: { select: { id: true, title: true, phase: true, category: true, isCritical: true } },
          },
          orderBy: { sendAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.reminderJob.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          jobs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * GET /appointments/:id/reminders
   * Returns all reminder jobs for a specific appointment, strictly clinic-scoped.
   */
  static async getAppointmentReminders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const appointmentId = String(req.params.id);

      // Verify appointment belongs to clinic
      const appointment = await prisma.appointment.findFirst({
        where: { id: appointmentId, clinicId: req.clinicId, deletedAt: null },
      });
      if (!appointment) {
        throw ApiError.notFound('Appointment not found');
      }

      const reminders = await prisma.reminderJob.findMany({
        where: {
          clinicId: req.clinicId,
          appointmentId,
        },
        include: {
          instruction: {
            select: {
              id: true,
              title: true,
              body: true,
              category: true,
              phase: true,
              isCritical: true,
              offsetMinutes: true,
            },
          },
        },
        orderBy: [{ sendAt: 'asc' }, { createdAt: 'asc' }],
      });

      res.status(200).json({ success: true, data: reminders });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /reminder-jobs/:id/retry
   * Staff only: Retries a FAILED reminder job.
   */
  static async retryJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      if (!req.user) throw ApiError.unauthorized('User not authenticated');

      const allowedRoles: Role[] = [
        Role.STAFF,
        Role.DOCTOR,
        Role.CLINIC_ADMIN,
        Role.CLINIC_OWNER,
        Role.SUPER_ADMIN,
      ];
      if (!allowedRoles.includes(req.user.role)) {
        throw ApiError.forbidden('Only staff members can retry failed reminder jobs');
      }

      const jobId = String(req.params.id);
      const job = await prisma.reminderJob.findFirst({
        where: { id: jobId, clinicId: req.clinicId },
      });

      if (!job) {
        throw ApiError.notFound('Reminder job not found');
      }

      if (job.status !== ReminderJobStatus.FAILED) {
        throw ApiError.badRequest(`Only FAILED jobs can be retried. Current status is ${job.status}`);
      }

      // Reset to PENDING and set sendAt to now so worker picks it up immediately
      const updatedJob = await prisma.reminderJob.update({
        where: { id: jobId },
        data: {
          status: ReminderJobStatus.PENDING,
          attempts: 0,
          lastError: null,
          sendAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          instruction: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Reminder job queued for retry',
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /patients/:id/consent
   * Updates or sets notification consent for a patient on a channel.
   * If OPTED_OUT, cancels any PENDING jobs for that patient on that channel.
   */
  static async updateConsent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const patientId = String(req.params.id);
      const { channel, status, source } = req.body;

      // Verify patient exists in this clinic
      const patient = await prisma.patient.findFirst({
        where: { id: patientId, clinicId: req.clinicId, deletedAt: null },
      });
      if (!patient) {
        throw ApiError.notFound('Patient not found');
      }

      const consent = await prisma.notificationConsent.upsert({
        where: {
          clinicId_patientId_channel: {
            clinicId: req.clinicId,
            patientId,
            channel,
          },
        },
        update: {
          status,
          source: source || 'STAFF_UPDATE',
          updatedAt: new Date(),
        },
        create: {
          clinicId: req.clinicId,
          patientId,
          channel,
          status,
          source: source || 'STAFF_UPDATE',
        },
      });

      // If opting out, cancel any pending jobs for this patient on this channel
      if (status === ConsentStatus.OPTED_OUT) {
        await prisma.reminderJob.updateMany({
          where: {
            clinicId: req.clinicId,
            patientId,
            channel,
            status: ReminderJobStatus.PENDING,
          },
          data: {
            status: ReminderJobStatus.CANCELLED,
            skipReason: `Patient opted out of ${channel}`,
            updatedAt: new Date(),
          },
        });
      }

      res.status(200).json({
        success: true,
        message: `Notification consent updated to ${status} for ${channel}`,
        data: consent,
      });
    } catch (error) {
      next(error);
    }
  }
}
