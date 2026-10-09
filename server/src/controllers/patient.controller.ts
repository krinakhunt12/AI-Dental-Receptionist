import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PatientService } from '../services/patient.service.js';
import { ApiError } from '../utils/apiError.js';

export const createPatientSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(5, 'Phone number is required'),
    email: z.string().email().optional().or(z.literal('')),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    medicalNotes: z.string().optional(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    medicalNotes: z.string().optional(),
  }),
});

export class PatientController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await PatientService.listPatients(req.clinicId, page, limit, search);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const patient = await PatientService.getPatientById(req.clinicId, id);
      res.status(200).json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const patient = await PatientService.createPatient(req.clinicId, req.body);
      res.status(201).json({ success: true, message: 'Patient created', data: patient });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const updated = await PatientService.updatePatient(req.clinicId, id, req.body);
      res.status(200).json({ success: true, message: 'Patient updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      await PatientService.softDeletePatient(req.clinicId, id);
      res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
