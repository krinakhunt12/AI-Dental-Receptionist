import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppointmentService } from '../services/appointment.service.js';
import { SlotService } from '../services/slot.service.js';
import { ApiError } from '../utils/apiError.js';
import { AppointmentSource, AppointmentStatus } from '@prisma/client';

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid(),
    patientId: z.string().uuid(),
    serviceId: z.string().uuid().optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    source: z.nativeEnum(AppointmentSource).optional(),
    notes: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AppointmentStatus),
    notes: z.string().optional(),
  }),
});

export class AppointmentController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const doctorId = req.query.doctorId ? String(req.query.doctorId) : undefined;
      const patientId = req.query.patientId ? String(req.query.patientId) : undefined;
      const status = req.query.status ? (req.query.status as AppointmentStatus) : undefined;
      const date = req.query.date ? String(req.query.date) : undefined;

      const result = await AppointmentService.listAppointments(
        req.clinicId,
        page,
        limit,
        doctorId,
        patientId,
        status,
        date
      );

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const appointment = await AppointmentService.getAppointmentById(req.clinicId, id);
      res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  static async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const doctorId = req.query.doctorId ? String(req.query.doctorId) : undefined;
      const date = req.query.date ? String(req.query.date) : undefined;
      const durationMins = parseInt(String(req.query.durationMins || '30'), 10);

      if (!doctorId || !date) {
        throw ApiError.badRequest('doctorId and date (YYYY-MM-DD) query parameters are required');
      }

      const slots = await SlotService.getAvailableSlots(req.clinicId, doctorId, date, durationMins);
      res.status(200).json({ success: true, data: slots });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const appointment = await AppointmentService.createAppointment(req.clinicId, req.body);
      res.status(201).json({ success: true, message: 'Appointment booked', data: appointment });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const updated = await AppointmentService.updateAppointmentStatus(
        req.clinicId,
        id,
        req.body.status,
        req.body.notes
      );
      res.status(200).json({ success: true, message: 'Appointment status updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const cancelled = await AppointmentService.cancelAppointment(
        req.clinicId,
        id,
        req.body.reason
      );
      res.status(200).json({ success: true, message: 'Appointment cancelled', data: cancelled });
    } catch (error) {
      next(error);
    }
  }
}
