import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClinicService } from '../services/clinic.service.js';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

export const updateClinicSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    timezone: z.string().optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(Role),
    phone: z.string().optional(),
  }),
});

export class ClinicController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const clinic = await ClinicService.getClinicProfile(req.clinicId);
      res.status(200).json({ success: true, data: clinic });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const updated = await ClinicService.updateClinicProfile(req.clinicId, req.body);
      res.status(200).json({ success: true, message: 'Clinic updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const search = req.query.search as string;

      const result = await ClinicService.listClinicUsers(req.clinicId, page, limit, search);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const user = await ClinicService.createClinicUser(req.clinicId, req.body);
      res.status(201).json({ success: true, message: 'User created', data: user });
    } catch (error) {
      next(error);
    }
  }
}
