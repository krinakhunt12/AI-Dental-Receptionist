import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import { CallStatus, ConversationStatus } from '@prisma/client';

export class AiService {
  // --- Conversations & Chat ---
  static async createConversation(clinicId: string, patientId?: string, channel = 'chat') {
    return prisma.conversation.create({
      data: {
        clinicId,
        patientId,
        channel,
        status: ConversationStatus.ACTIVE,
      },
      include: { messages: true },
    });
  }

  static async addMessage(conversationId: string, senderRole: string, content: string, tokensUsed?: number) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw ApiError.notFound('Conversation session not found');

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderRole,
        content,
        tokensUsed,
      },
    });

    // Touch conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  static async listConversations(clinicId: string, page = 1, limit = 10, patientId?: string) {
    const skip = (page - 1) * limit;
    const where: any = { clinicId };
    if (patientId) where.patientId = patientId;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
          _count: { select: { messages: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.conversation.count({ where }),
    ]);

    return {
      conversations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getConversationWithMessages(clinicId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, clinicId },
      include: {
        patient: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) throw ApiError.notFound('Conversation not found');
    return conversation;
  }

  // --- Call Logs ---
  static async logCall(clinicId: string, data: {
    callerPhone: string;
    patientId?: string;
    durationSecs?: number;
    status?: CallStatus;
    recordingUrl?: string;
    transcript?: string;
    summary?: string;
    sentiment?: string;
  }) {
    // Check subscription plan call limits
    const subscription = await prisma.subscription.findUnique({
      where: { clinicId },
      include: { plan: true },
    });

    if (subscription && subscription.plan) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const callsCount = await prisma.callLog.count({
        where: { clinicId, createdAt: { gte: startOfMonth } },
      });

      if (callsCount >= subscription.plan.maxAiCallsPerMonth) {
        throw ApiError.forbidden(
          `Monthly AI Call limit of ${subscription.plan.maxAiCallsPerMonth} reached for current plan.`
        );
      }
    }

    const callLog = await prisma.callLog.create({
      data: {
        clinicId,
        callerPhone: data.callerPhone,
        patientId: data.patientId,
        durationSecs: data.durationSecs || 0,
        status: data.status || CallStatus.COMPLETED,
        recordingUrl: data.recordingUrl,
        transcript: data.transcript,
        summary: data.summary,
        sentiment: data.sentiment,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return callLog;
  }

  static async listCallLogs(clinicId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { clinicId };

    if (search) {
      where.OR = [
        { callerPhone: { contains: search } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [callLogs, total] = await Promise.all([
      prisma.callLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.callLog.count({ where }),
    ]);

    return {
      callLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
