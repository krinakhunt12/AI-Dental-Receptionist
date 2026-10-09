import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DoctorService } from '../services/doctor.service.js';
import { ApiError } from '../utils/apiError.js';

export const createDoctorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Doctor name is required'),
    specialty: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    bio: z.string().optional(),
    colorCode: z.string().optional(),
    workingHours: z
      .array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string().regex(/^([01]\d|2[03]):([0-5]\d)$/),
          endTime: z.string().regex(/^([01]\d|2[03]):([0-5]\d)$/),
          isClosed: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

export class DoctorController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await DoctorService.listDoctors(req.clinicId, page, limit, search);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const doctor = await DoctorService.getDoctorById(req.clinicId, id);
      res.status(200).json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const doctor = await DoctorService.createDoctor(req.clinicId, req.body);
      res.status(201).json({ success: true, message: 'Doctor created', data: doctor });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const updated = await DoctorService.updateDoctor(req.clinicId, id, req.body);
      res.status(200).json({ success: true, message: 'Doctor updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      await DoctorService.softDeleteDoctor(req.clinicId, id);
      res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
