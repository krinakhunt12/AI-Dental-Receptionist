import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TriageService } from '../services/triage.service.js';

export const triageMessageSchema = z.object({
  body: z.object({
    patientId: z.string().optional(),
    appointmentId: z.string().optional(),
    message: z.string().min(1, 'message is required'),
  }),
});

export class TriageController {
  /**
   * POST /triage/message
   * Grounded aftercare triage endpoint.
   * Scopes clinic from authenticated user or derived stored appointment/patient record.
   */
  static async triageMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, appointmentId, message } = req.body;
      const clinicId = req.clinicId; // from auth middleware if logged in, otherwise derived by TriageService

      const result = await TriageService.handleMessage({
        clinicId,
        patientId,
        appointmentId,
        message,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * GET /triage/logs
   * Staff triage logs view with urgency, symptomKeys, escalated flag, and redacted text.
   */
  static async listLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const clinicId = req.clinicId;
      if (!clinicId) {
        res.status(401).json({ success: false, error: { message: 'Clinic context missing' } });
        return;
      }

      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '20'), 10);
      const urgency = req.query.urgency ? String(req.query.urgency) : undefined;
      const skip = (page - 1) * limit;

      const where: any = { clinicId };
      if (urgency) where.urgency = urgency;

      const { prisma } = await import('../prisma.js');
      const [logs, total] = await Promise.all([
        prisma.triageLog.findMany({
          where,
          include: {
            patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
            appointment: { select: { id: true, startTime: true, status: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.triageLog.count({ where }),
      ]);

      // Redact raw text to preserve patient privacy
      const sanitizedLogs = logs.map((l) => ({
        id: l.id,
        appointmentId: l.appointmentId,
        patientId: l.patientId,
        patientName: l.patient ? `${l.patient.firstName} ${l.patient.lastName}` : 'Anonymous Patient',
        patientPhone: l.patient ? l.patient.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : '***',
        symptomKeys: l.symptomKeys,
        urgency: l.urgency,
        escalated: l.escalated,
        messageSnippet: l.messageText ? l.messageText.slice(0, 30) + '... [REDACTED]' : null,
        createdAt: l.createdAt,
      }));

      res.status(200).json({
        success: true,
        data: {
          logs: sanitizedLogs,
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
}
