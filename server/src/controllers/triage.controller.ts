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
}
