import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export class TreatmentController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      let treatments = await prisma.treatment.findMany({
        where: { clinicId: req.clinicId, deletedAt: null },
        orderBy: { name: 'asc' },
      });

      if (treatments.length === 0) {
        // Fallback to services if treatments table empty
        const services = await prisma.service.findMany({
          where: { clinicId: req.clinicId, deletedAt: null },
          orderBy: { name: 'asc' },
        });
        if (services.length > 0) {
          treatments = services.map((s) => ({
            id: s.id,
            clinicId: s.clinicId,
            name: s.name,
            description: s.description,
            durationMins: s.durationMins,
            price: s.price,
            isActive: s.isActive,
            deletedAt: s.deletedAt,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          }));
        }
      }

      res.status(200).json({ success: true, data: treatments });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const { name, description, durationMins, price } = req.body;
      if (!name) throw ApiError.badRequest('Treatment name is required');

      const treatment = await prisma.treatment.create({
        data: {
          clinicId: req.clinicId,
          name,
          description,
          durationMins: durationMins || 30,
          price: price || 100,
        },
      });

      res.status(201).json({ success: true, data: treatment });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);

      const existing = await prisma.treatment.findFirst({
        where: { id, clinicId: req.clinicId, deletedAt: null },
      });
      if (!existing) throw ApiError.notFound('Treatment not found');

      const updated = await prisma.treatment.update({
        where: { id },
        data: req.body,
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}
