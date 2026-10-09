import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AiService } from '../services/ai.service.js';
import { ApiError } from '../utils/apiError.js';
import { CallStatus } from '@prisma/client';

export const createConversationSchema = z.object({
  body: z.object({
    patientId: z.string().uuid().optional(),
    channel: z.string().optional(),
  }),
});

export const addMessageSchema = z.object({
  body: z.object({
    senderRole: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, 'Message content cannot be empty'),
    tokensUsed: z.number().optional(),
  }),
});

export const logCallSchema = z.object({
  body: z.object({
    callerPhone: z.string().min(5),
    patientId: z.string().uuid().optional(),
    durationSecs: z.number().optional(),
    status: z.nativeEnum(CallStatus).optional(),
    recordingUrl: z.string().optional(),
    transcript: z.string().optional(),
    summary: z.string().optional(),
    sentiment: z.string().optional(),
  }),
});

export class AiController {
  static async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const conv = await AiService.createConversation(
        req.clinicId,
        req.body.patientId,
        req.body.channel
      );
      res.status(201).json({ success: true, data: conv });
    } catch (error) {
      next(error);
    }
  }

  static async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { senderRole, content, tokensUsed } = req.body;
      const msg = await AiService.addMessage(id, senderRole, content, tokensUsed);
      res.status(201).json({ success: true, data: msg });
    } catch (error) {
      next(error);
    }
  }

  static async listConversations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const patientId = req.query.patientId ? String(req.query.patientId) : undefined;

      const result = await AiService.listConversations(req.clinicId, page, limit, patientId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const id = String(req.params.id);
      const conv = await AiService.getConversationWithMessages(req.clinicId, id);
      res.status(200).json({ success: true, data: conv });
    } catch (error) {
      next(error);
    }
  }

  static async logCall(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const call = await AiService.logCall(req.clinicId, req.body);
      res.status(201).json({ success: true, message: 'Call log stored', data: call });
    } catch (error) {
      next(error);
    }
  }

  static async listCallLogs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.clinicId) throw ApiError.unauthorized('Clinic context missing');
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await AiService.listCallLogs(req.clinicId, page, limit, search);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
