import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CareCategory, CarePhase, CareProtocolStatus, EscalationAction, Role } from '@prisma/client';
import { CareProtocolService } from '../services/careProtocol.service.js';
import { ApiError } from '../utils/apiError.js';

// --- ZOD SCHEMAS ---

export const listCareProtocolsSchema = z.object({
  query: z.object({
    treatmentId: z.string().optional(),
    status: z.nativeEnum(CareProtocolStatus).optional(),
  }),
});

export const getCareProtocolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const createCareProtocolSchema = z.object({
  body: z.object({
    treatmentId: z.string().min(1, 'treatmentId is required'),
    name: z.string().min(1, 'Protocol name is required'),
  }),
});

export const updateCareProtocolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
  }),
});

export const approveCareProtocolSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const createCareInstructionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    phase: z.nativeEnum(CarePhase),
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Instruction body is required'),
    offsetMinutes: z.number().int(),
    category: z.nativeEnum(CareCategory),
    isCritical: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateCareInstructionSchema = z.object({
  params: z.object({
    instructionId: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
  }),
  body: z.object({
    phase: z.nativeEnum(CarePhase).optional(),
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    offsetMinutes: z.number().int().optional(),
    category: z.nativeEnum(CareCategory).optional(),
    isCritical: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const createEscalationRuleSchema = z.object({
  body: z.object({
    protocolId: z.string().nullable().optional(),
    symptomKey: z.string().min(1, 'symptomKey is required'),
    description: z.string().min(1, 'description is required'),
    action: z.nativeEnum(EscalationAction),
    message: z.string().min(1, 'message is required'),
    daysAfterMin: z.number().int().nullable().optional(),
  }),
});

export const updateEscalationRuleSchema = z.object({
  params: z.object({
    ruleId: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
  }),
  body: z.object({
    symptomKey: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    action: z.nativeEnum(EscalationAction).optional(),
    message: z.string().min(1).optional(),
    daysAfterMin: z.number().int().nullable().optional(),
  }),
});

export const getCarePlanSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Appointment ID is required'),
  }),
});

// --- CONTROLLER ---

export class CareProtocolController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const treatmentId = req.query.treatmentId ? String(req.query.treatmentId) : undefined;
      const status = req.query.status ? (req.query.status as CareProtocolStatus) : undefined;

      const protocols = await CareProtocolService.listProtocols(req.clinicId, {
        treatmentId,
        status,
      });

      res.status(200).json({ success: true, data: protocols });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const protocol = await CareProtocolService.getProtocolById(req.clinicId, id);

      res.status(200).json({ success: true, data: protocol });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const protocol = await CareProtocolService.createProtocol(req.clinicId, req.body);

      res.status(201).json({ success: true, message: 'Care protocol created', data: protocol });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const updated = await CareProtocolService.updateProtocol(req.clinicId, id, req.body);

      res.status(200).json({ success: true, message: 'Care protocol updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      if (!req.user) throw ApiError.unauthorized('User not authenticated');

      // Only DOCTOR, CLINIC_ADMIN, or CLINIC_OWNER
      const allowedRoles: Role[] = [Role.DOCTOR, Role.CLINIC_ADMIN, Role.CLINIC_OWNER, Role.SUPER_ADMIN];
      if (!allowedRoles.includes(req.user.role)) {
        throw ApiError.forbidden(
          'Only a user with role DOCTOR, CLINIC_ADMIN, or CLINIC_OWNER can approve care protocols'
        );
      }

      const id = String(req.params.id);
      const approved = await CareProtocolService.approveProtocol(req.clinicId, id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Care protocol approved and active',
        data: approved,
      });
    } catch (error) {
      next(error);
    }
  }

  // --- INSTRUCTIONS ---

  static async addInstruction(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const protocolId = String(req.params.id);
      const instruction = await CareProtocolService.addInstruction(
        req.clinicId,
        protocolId,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Care instruction added',
        data: instruction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateInstruction(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const instructionId = String(req.params.instructionId || req.params.id);
      const updated = await CareProtocolService.updateInstruction(
        req.clinicId,
        instructionId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Care instruction updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteInstruction(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const instructionId = String(req.params.instructionId || req.params.id);
      const result = await CareProtocolService.deleteInstruction(req.clinicId, instructionId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // --- ESCALATION RULES ---

  static async createEscalationRule(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const protocolId = req.params.id || req.body.protocolId || null;
      const rule = await CareProtocolService.createEscalationRule(req.clinicId, {
        ...req.body,
        protocolId,
      });

      res.status(201).json({
        success: true,
        message: 'Escalation rule created',
        data: rule,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEscalationRule(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const ruleId = String(req.params.ruleId || req.params.id);
      const updated = await CareProtocolService.updateEscalationRule(
        req.clinicId,
        ruleId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Escalation rule updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEscalationRule(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const ruleId = String(req.params.ruleId || req.params.id);
      const result = await CareProtocolService.deleteEscalationRule(req.clinicId, ruleId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // --- CARE PLAN ---

  static async getCarePlan(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const appointmentId = String(req.params.id);
      const carePlan = await CareProtocolService.getCarePlanForAppointment(
        req.clinicId,
        appointmentId
      );

      res.status(200).json({ success: true, data: carePlan });
    } catch (error) {
      next(error);
    }
  }
}
