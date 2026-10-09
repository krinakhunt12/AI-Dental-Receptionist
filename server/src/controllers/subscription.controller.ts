import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SubscriptionService } from '../services/subscription.service.js';
import { ApiError } from '../utils/apiError.js';
import { BillingPeriod } from '@prisma/client';

export const updatePlanSchema = z.object({
  body: z.object({
    planCode: z.enum(['FREE_TRIAL', 'BASIC', 'PRO']),
    billingPeriod: z.nativeEnum(BillingPeriod).optional(),
  }),
});

export class SubscriptionController {
  static async listPlans(_req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await SubscriptionService.listPlans();
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }

  static async getSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const sub = await SubscriptionService.getClinicSubscription(req.clinicId);
      res.status(200).json({ success: true, data: sub });
    } catch (error) {
      next(error);
    }
  }

  static async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const { planCode, billingPeriod } = req.body;
      const sub = await SubscriptionService.upgradeOrChangePlan(req.clinicId, planCode, billingPeriod);
      res.status(200).json({ success: true, message: 'Subscription plan updated', data: sub });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const sub = await SubscriptionService.cancelSubscription(req.clinicId);
      res.status(200).json({ success: true, message: 'Subscription cancelled', data: sub });
    } catch (error) {
      next(error);
    }
  }

  static async listInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const invoices = await SubscriptionService.listInvoices(req.clinicId);
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  }
}
