import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { ApiError } from '../utils/apiError.js';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const from = req.query.from ? String(req.query.from) : undefined;
      const to = req.query.to ? String(req.query.to) : undefined;

      const summary = await DashboardService.getSummary(req.clinicId, from, to);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }

  static async getAppointmentsTrend(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const from = req.query.from ? String(req.query.from) : undefined;
      const to = req.query.to ? String(req.query.to) : undefined;
      const interval = (req.query.interval as 'day' | 'week') || 'day';

      const trend = await DashboardService.getAppointmentsTrend(req.clinicId, from, to, interval);
      res.status(200).json({ success: true, data: trend });
    } catch (error) {
      next(error);
    }
  }

  static async getTreatmentsBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const from = req.query.from ? String(req.query.from) : undefined;
      const to = req.query.to ? String(req.query.to) : undefined;

      const breakdown = await DashboardService.getTreatmentsBreakdown(req.clinicId, from, to);
      res.status(200).json({ success: true, data: breakdown });
    } catch (error) {
      next(error);
    }
  }

  static async getDentistUtilization(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const from = req.query.from ? String(req.query.from) : undefined;
      const to = req.query.to ? String(req.query.to) : undefined;

      const utilization = await DashboardService.getDentistUtilization(req.clinicId, from, to);
      res.status(200).json({ success: true, data: utilization });
    } catch (error) {
      next(error);
    }
  }

  static async getAiReceptionist(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const from = req.query.from ? String(req.query.from) : undefined;
      const to = req.query.to ? String(req.query.to) : undefined;

      const metrics = await DashboardService.getAiReceptionistMetrics(req.clinicId, from, to);
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}
