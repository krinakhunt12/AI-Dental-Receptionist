import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserService } from '../services/user.service.js';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

const passwordComplexitySchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: passwordComplexitySchema,
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.nativeEnum(Role, { message: 'Role is required' }),
    phone: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    password: passwordComplexitySchema.optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.nativeEnum(Role).optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getUserParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
});

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId && req.user?.role !== Role.SUPER_ADMIN) {
        throw ApiError.unauthorized('Clinic context missing', 'CLINIC_CONTEXT_MISSING');
      }
      const clinicId = req.clinicId || req.body.clinicId;
      const user = await UserService.createUser(clinicId, req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const role = typeof req.query.role === 'string' ? (req.query.role as Role) : undefined;
      const queryClinicId = typeof req.query.clinicId === 'string' ? req.query.clinicId : undefined;

      const clinicId = req.user?.role === Role.SUPER_ADMIN ? (queryClinicId || req.clinicId) : req.clinicId;

      const result = await UserService.listUsers(clinicId, page, limit, search, role);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await UserService.getUserById(id, req.clinicId, req.user!.role);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await UserService.updateUser(
        id,
        req.user!.userId,
        req.clinicId,
        req.user!.role,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deactivated = await UserService.deactivateUser(
        id,
        req.user!.userId,
        req.clinicId,
        req.user!.role
      );
      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
        data: deactivated,
      });
    } catch (error) {
      next(error);
    }
  }
}
