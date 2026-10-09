import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClinicService } from '../services/clinic.service.js';
import { ApiError } from '../utils/apiError.js';

const workingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:mm)'),
  isClosed: z.boolean().optional(),
});

export const updateClinicSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(5).optional(),
    address: z.string().optional(),
    timezone: z.string().optional(),
    logoUrl: z.string().url('Invalid logo URL').or(z.literal('')).optional(),
    workingHours: z.array(workingHourSchema).optional(),
  }),
});

export const updateClinicStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid clinic ID format'),
  }),
  body: z.object({
    isActive: z.boolean({ message: 'isActive status is required' }),
  }),
});

export class ClinicController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) {
        throw ApiError.unauthorized('Clinic context missing', 'CLINIC_CONTEXT_MISSING');
      }
      const clinic = await ClinicService.getClinicProfile(req.clinicId);
      res.status(200).json({ success: true, data: clinic });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) {
        throw ApiError.unauthorized('Clinic context missing', 'CLINIC_CONTEXT_MISSING');
      }
      const updated = await ClinicService.updateClinicProfile(req.clinicId, req.body);
      res.status(200).json({
        success: true,
        message: 'Clinic profile updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async listAllClinics(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

      const result = await ClinicService.listAllClinics(page, limit, search, isActive);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { isActive } = req.body;
      const clinic = await ClinicService.updateClinicStatus(id, isActive);
      res.status(200).json({
        success: true,
        message: `Clinic has been ${isActive ? 'activated' : 'suspended'} successfully`,
        data: clinic,
      });
    } catch (error) {
      next(error);
    }
  }
}
