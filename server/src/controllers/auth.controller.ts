import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service.js';

export const registerClinicSchema = z.object({
  body: z.object({
    clinicName: z.string().min(2, 'Clinic name must be at least 2 characters'),
    slug: z.string().min(2).regex(/^[a-z0-0-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(5, 'Phone number is required'),
    address: z.string().optional(),
    adminFirstName: z.string().min(1, 'First name is required'),
    adminLastName: z.string().min(1, 'Last name is required'),
    adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export class AuthController {
  static async registerClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerClinic(req.body);
      res.status(201).json({
        success: true,
        message: 'Clinic registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshAccessToken(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
