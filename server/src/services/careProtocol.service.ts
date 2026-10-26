import {
  CareCategory,
  CarePhase,
  CareProtocolStatus,
  EscalationAction,
  Prisma,
} from '@prisma/client';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export interface CreateProtocolInput {
  treatmentId: string;
  name: string;
}

export interface UpdateProtocolInput {
  name?: string;
}

export interface CreateInstructionInput {
  phase: CarePhase;
  title: string;
  body: string;
  offsetMinutes: number;
  category: CareCategory;
  isCritical?: boolean;
  sortOrder?: number;
}

export interface UpdateInstructionInput {
  phase?: CarePhase;
  title?: string;
  body?: string;
  offsetMinutes?: number;
  category?: CareCategory;
  isCritical?: boolean;
  sortOrder?: number;
}

export interface CreateEscalationRuleInput {
  protocolId?: string | null;
  symptomKey: string;
  description: string;
  action: EscalationAction;
  message: string;
  daysAfterMin?: number | null;
}

export interface UpdateEscalationRuleInput {
  symptomKey?: string;
  description?: string;
  action?: EscalationAction;
  message?: string;
  daysAfterMin?: number | null;
}

export class CareProtocolService {
  /**
   * Helper to clone an APPROVED protocol into a new DRAFT version (version + 1).
   * All instructions and protocol-specific escalation rules are cloned.
   * If a DRAFT version already exists for the treatment, returns that existing draft.
   */
  private static async cloneApprovedToDraft(
    clinicId: string,
    approvedProtocol: {
      id: string;
      treatmentId: string;
      name: string;
      version: number;
    }
  ) {
    // Check if an existing DRAFT already exists for this clinic & treatment
    const existingDraft = await prisma.careProtocol.findFirst({
      where: {
        clinicId,
        treatmentId: approvedProtocol.treatmentId,
        status: CareProtocolStatus.DRAFT,
      },
      include: {
        instructions: { orderBy: { sortOrder: 'asc' } },
        escalationRules: true,
        treatment: true,
      },
    });

    if (existingDraft) {
      return existingDraft;
    }

    // Determine max version for this treatment
    const maxVersionRecord = await prisma.careProtocol.findFirst({
      where: { clinicId, treatmentId: approvedProtocol.treatmentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    const newVersion = (maxVersionRecord?.version ?? approvedProtocol.version) + 1;

    return prisma.$transaction(async (tx) => {
      const newDraft = await tx.careProtocol.create({
        data: {
          clinicId,
          treatmentId: approvedProtocol.treatmentId,
          name: approvedProtocol.name,
          status: CareProtocolStatus.DRAFT,
          version: newVersion,
          approvedByUserId: null,
          approvedAt: null,
        },
      });

      // Clone instructions
      const oldInstructions = await tx.careInstruction.findMany({
        where: { clinicId, protocolId: approvedProtocol.id },
      });
      for (const inst of oldInstructions) {
        await tx.careInstruction.create({
          data: {
            clinicId,
            protocolId: newDraft.id,
            phase: inst.phase,
            title: inst.title,
            body: inst.body,
            offsetMinutes: inst.offsetMinutes,
            category: inst.category,
            isCritical: inst.isCritical,
            sortOrder: inst.sortOrder,
          },
        });
      }

      // Clone rules
      const oldRules = await tx.escalationRule.findMany({
        where: { clinicId, protocolId: approvedProtocol.id },
      });
      for (const r of oldRules) {
        await tx.escalationRule.create({
          data: {
            clinicId,
            protocolId: newDraft.id,
            symptomKey: r.symptomKey,
            description: r.description,
            action: r.action,
            message: r.message,
            daysAfterMin: r.daysAfterMin,
          },
        });
      }

      return tx.careProtocol.findUniqueOrThrow({
        where: { id: newDraft.id },
        include: {
          instructions: { orderBy: { sortOrder: 'asc' } },
          escalationRules: true,
          treatment: true,
        },
      });
    });
  }

  // --- PROTOCOLS ---

  static async listProtocols(
    clinicId: string,
    filters?: { treatmentId?: string; status?: CareProtocolStatus }
  ) {
    const where: Prisma.CareProtocolWhereInput = {
      clinicId,
      ...(filters?.treatmentId && { treatmentId: filters.treatmentId }),
      ...(filters?.status && { status: filters.status }),
    };

    return prisma.careProtocol.findMany({
      where,
      include: {
        treatment: { select: { id: true, name: true, durationMins: true, price: true } },
        instructions: { orderBy: { sortOrder: 'asc' } },
        escalationRules: true,
        approvedByUser: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
      },
      orderBy: [{ version: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async getProtocolById(clinicId: string, id: string) {
    const protocol = await prisma.careProtocol.findFirst({
      where: { id, clinicId },
      include: {
        treatment: true,
        instructions: { orderBy: { sortOrder: 'asc' } },
        escalationRules: true,
        approvedByUser: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
      },
    });

    if (!protocol) {
      throw ApiError.notFound('Care protocol not found');
    }

    return protocol;
  }

  static async createProtocol(clinicId: string, input: CreateProtocolInput) {
    // Verify treatment belongs to this clinic
    const treatment = await prisma.treatment.findFirst({
      where: { id: input.treatmentId, clinicId, deletedAt: null },
    });
    if (!treatment) {
      throw ApiError.notFound('Treatment not found');
    }

    // Determine version
    const latest = await prisma.careProtocol.findFirst({
      where: { clinicId, treatmentId: input.treatmentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    const version = (latest?.version ?? 0) + 1;

    return prisma.careProtocol.create({
      data: {
        clinicId,
        treatmentId: input.treatmentId,
        name: input.name,
        status: CareProtocolStatus.DRAFT,
        version,
      },
      include: {
        treatment: true,
        instructions: true,
        escalationRules: true,
      },
    });
  }

  static async updateProtocol(clinicId: string, id: string, input: UpdateProtocolInput) {
    const existing = await prisma.careProtocol.findFirst({
      where: { id, clinicId },
    });

    if (!existing) {
      throw ApiError.notFound('Care protocol not found');
    }

    if (existing.status === CareProtocolStatus.ARCHIVED) {
      throw ApiError.badRequest('Archived protocols cannot be edited');
    }

    // If APPROVED, create new DRAFT version (version + 1)
    if (existing.status === CareProtocolStatus.APPROVED) {
      const draft = await this.cloneApprovedToDraft(clinicId, existing);
      if (input.name && input.name !== draft.name) {
        return prisma.careProtocol.update({
          where: { id: draft.id },
          data: { name: input.name },
          include: {
            treatment: true,
            instructions: { orderBy: { sortOrder: 'asc' } },
            escalationRules: true,
          },
        });
      }
      return draft;
    }

    // If DRAFT, update in-place
    return prisma.careProtocol.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
      },
      include: {
        treatment: true,
        instructions: { orderBy: { sortOrder: 'asc' } },
        escalationRules: true,
      },
    });
  }

  static async approveProtocol(clinicId: string, id: string, userId: string) {
    const existing = await prisma.careProtocol.findFirst({
      where: { id, clinicId },
    });

    if (!existing) {
      throw ApiError.notFound('Care protocol not found');
    }

    if (existing.status === CareProtocolStatus.APPROVED) {
      return this.getProtocolById(clinicId, id);
    }

    return prisma.$transaction(async (tx) => {
      // Archive any currently approved protocol for the same treatment
      await tx.careProtocol.updateMany({
        where: {
          clinicId,
          treatmentId: existing.treatmentId,
          status: CareProtocolStatus.APPROVED,
        },
        data: {
          status: CareProtocolStatus.ARCHIVED,
        },
      });

      // Mark this protocol as APPROVED
      return tx.careProtocol.update({
        where: { id },
        data: {
          status: CareProtocolStatus.APPROVED,
          approvedByUserId: userId,
          approvedAt: new Date(),
        },
        include: {
          treatment: true,
          instructions: { orderBy: { sortOrder: 'asc' } },
          escalationRules: true,
          approvedByUser: {
            select: { id: true, firstName: true, lastName: true, email: true, role: true },
          },
        },
      });
    });
  }

  // --- INSTRUCTIONS ---

  static async addInstruction(
    clinicId: string,
    protocolId: string,
    input: CreateInstructionInput
  ) {
    const protocol = await prisma.careProtocol.findFirst({
      where: { id: protocolId, clinicId },
    });

    if (!protocol) {
      throw ApiError.notFound('Care protocol not found');
    }

    let targetProtocolId = protocolId;

    // If protocol is APPROVED, fork a new DRAFT version first
    if (protocol.status === CareProtocolStatus.APPROVED) {
      const draft = await this.cloneApprovedToDraft(clinicId, protocol);
      targetProtocolId = draft.id;
    } else if (protocol.status === CareProtocolStatus.ARCHIVED) {
      throw ApiError.badRequest('Cannot add instructions to an archived protocol');
    }

    return prisma.careInstruction.create({
      data: {
        clinicId,
        protocolId: targetProtocolId,
        phase: input.phase,
        title: input.title,
        body: input.body,
        offsetMinutes: input.offsetMinutes,
        category: input.category,
        isCritical: input.isCritical ?? false,
        sortOrder: input.sortOrder ?? 0,
      },
    });
  }

  static async updateInstruction(
    clinicId: string,
    instructionId: string,
    input: UpdateInstructionInput
  ) {
    const instruction = await prisma.careInstruction.findFirst({
      where: { id: instructionId, clinicId },
      include: { protocol: true },
    });

    if (!instruction) {
      throw ApiError.notFound('Care instruction not found');
    }

    if (instruction.protocol.status === CareProtocolStatus.APPROVED) {
      // Fork new draft
      const draft = await this.cloneApprovedToDraft(clinicId, instruction.protocol);
      // Find matching cloned instruction by title/sortOrder
      const cloned = await prisma.careInstruction.findFirst({
        where: {
          clinicId,
          protocolId: draft.id,
          title: instruction.title,
          phase: instruction.phase,
        },
      });

      if (cloned) {
        return prisma.careInstruction.update({
          where: { id: cloned.id },
          data: {
            ...(input.phase && { phase: input.phase }),
            ...(input.title && { title: input.title }),
            ...(input.body && { body: input.body }),
            ...(input.offsetMinutes !== undefined && { offsetMinutes: input.offsetMinutes }),
            ...(input.category && { category: input.category }),
            ...(input.isCritical !== undefined && { isCritical: input.isCritical }),
            ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
          },
        });
      }
    }

    if (instruction.protocol.status === CareProtocolStatus.ARCHIVED) {
      throw ApiError.badRequest('Cannot edit instructions of an archived protocol');
    }

    return prisma.careInstruction.update({
      where: { id: instructionId },
      data: {
        ...(input.phase && { phase: input.phase }),
        ...(input.title && { title: input.title }),
        ...(input.body && { body: input.body }),
        ...(input.offsetMinutes !== undefined && { offsetMinutes: input.offsetMinutes }),
        ...(input.category && { category: input.category }),
        ...(input.isCritical !== undefined && { isCritical: input.isCritical }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });
  }

  static async deleteInstruction(clinicId: string, instructionId: string) {
    const instruction = await prisma.careInstruction.findFirst({
      where: { id: instructionId, clinicId },
      include: { protocol: true },
    });

    if (!instruction) {
      throw ApiError.notFound('Care instruction not found');
    }

    if (instruction.protocol.status === CareProtocolStatus.APPROVED) {
      // Fork draft omitting this instruction
      const draft = await this.cloneApprovedToDraft(clinicId, instruction.protocol);
      await prisma.careInstruction.deleteMany({
        where: {
          clinicId,
          protocolId: draft.id,
          title: instruction.title,
          phase: instruction.phase,
        },
      });
      return { success: true, message: 'Created draft without deleted instruction' };
    }

    if (instruction.protocol.status === CareProtocolStatus.ARCHIVED) {
      throw ApiError.badRequest('Cannot delete instructions from an archived protocol');
    }

    await prisma.careInstruction.delete({
      where: { id: instructionId },
    });

    return { success: true, message: 'Care instruction deleted' };
  }

  // --- ESCALATION RULES ---

  static async listEscalationRules(clinicId: string, protocolId?: string | null) {
    return prisma.escalationRule.findMany({
      where: {
        clinicId,
        ...(protocolId !== undefined && { protocolId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createEscalationRule(clinicId: string, input: CreateEscalationRuleInput) {
    let targetProtocolId = input.protocolId || null;

    if (targetProtocolId) {
      const protocol = await prisma.careProtocol.findFirst({
        where: { id: targetProtocolId, clinicId },
      });
      if (!protocol) {
        throw ApiError.notFound('Care protocol not found');
      }

      if (protocol.status === CareProtocolStatus.APPROVED) {
        const draft = await this.cloneApprovedToDraft(clinicId, protocol);
        targetProtocolId = draft.id;
      }
    }

    return prisma.escalationRule.create({
      data: {
        clinicId,
        protocolId: targetProtocolId,
        symptomKey: input.symptomKey,
        description: input.description,
        action: input.action,
        message: input.message,
        daysAfterMin: input.daysAfterMin ?? null,
      },
    });
  }

  static async updateEscalationRule(
    clinicId: string,
    ruleId: string,
    input: UpdateEscalationRuleInput
  ) {
    const rule = await prisma.escalationRule.findFirst({
      where: { id: ruleId, clinicId },
      include: { protocol: true },
    });

    if (!rule) {
      throw ApiError.notFound('Escalation rule not found');
    }

    if (rule.protocol && rule.protocol.status === CareProtocolStatus.APPROVED) {
      const draft = await this.cloneApprovedToDraft(clinicId, rule.protocol);
      const cloned = await prisma.escalationRule.findFirst({
        where: { clinicId, protocolId: draft.id, symptomKey: rule.symptomKey },
      });
      if (cloned) {
        return prisma.escalationRule.update({
          where: { id: cloned.id },
          data: {
            ...(input.symptomKey && { symptomKey: input.symptomKey }),
            ...(input.description && { description: input.description }),
            ...(input.action && { action: input.action }),
            ...(input.message && { message: input.message }),
            ...(input.daysAfterMin !== undefined && { daysAfterMin: input.daysAfterMin }),
          },
        });
      }
    }

    return prisma.escalationRule.update({
      where: { id: ruleId },
      data: {
        ...(input.symptomKey && { symptomKey: input.symptomKey }),
        ...(input.description && { description: input.description }),
        ...(input.action && { action: input.action }),
        ...(input.message && { message: input.message }),
        ...(input.daysAfterMin !== undefined && { daysAfterMin: input.daysAfterMin }),
      },
    });
  }

  static async deleteEscalationRule(clinicId: string, ruleId: string) {
    const rule = await prisma.escalationRule.findFirst({
      where: { id: ruleId, clinicId },
      include: { protocol: true },
    });

    if (!rule) {
      throw ApiError.notFound('Escalation rule not found');
    }

    if (rule.protocol && rule.protocol.status === CareProtocolStatus.APPROVED) {
      const draft = await this.cloneApprovedToDraft(clinicId, rule.protocol);
      await prisma.escalationRule.deleteMany({
        where: { clinicId, protocolId: draft.id, symptomKey: rule.symptomKey },
      });
      return { success: true, message: 'Removed rule in new draft version' };
    }

    await prisma.escalationRule.delete({
      where: { id: ruleId },
    });

    return { success: true, message: 'Escalation rule deleted' };
  }

  // --- RESOLVED CARE PLAN FOR APPOINTMENT ---

  static async getCarePlanForAppointment(clinicId: string, appointmentId: string) {
    // 1. Fetch appointment scoped strictly to this clinic
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId, deletedAt: null },
      include: {
        clinic: { select: { id: true, name: true, timezone: true } },
        treatment: true,
        service: true,
      },
    });

    if (!appointment) {
      throw ApiError.notFound('Appointment not found');
    }

    // 2. Resolve Treatment
    let resolvedTreatment = appointment.treatment;

    if (!resolvedTreatment && appointment.treatmentId) {
      resolvedTreatment = await prisma.treatment.findFirst({
        where: { id: appointment.treatmentId, clinicId, deletedAt: null },
      });
    }

    if (!resolvedTreatment && appointment.serviceId) {
      // Check if a treatment with matching ID or name exists
      resolvedTreatment =
        (await prisma.treatment.findFirst({
          where: { id: appointment.serviceId, clinicId, deletedAt: null },
        })) ||
        (appointment.service
          ? await prisma.treatment.findFirst({
              where: { name: appointment.service.name, clinicId, deletedAt: null },
            })
          : null);
    }

    if (!resolvedTreatment) {
      // Try matching by treatment name string
      const defaultTreatment = await prisma.treatment.findFirst({
        where: { clinicId, deletedAt: null },
      });
      resolvedTreatment = defaultTreatment;
    }

    const clinicWideRules = await prisma.escalationRule.findMany({
      where: { clinicId, protocolId: null },
    });

    if (!resolvedTreatment) {
      return {
        appointmentId: appointment.id,
        treatmentId: null,
        treatmentName: appointment.service?.name || 'General Treatment',
        protocolId: null,
        protocolName: null,
        version: null,
        approvedAt: null,
        instructions: [],
        escalationRules: clinicWideRules,
      };
    }

    // 3. Find APPROVED protocol for this treatment (ONLY APPROVED protocols)
    const approvedProtocol = await prisma.careProtocol.findFirst({
      where: {
        clinicId,
        treatmentId: resolvedTreatment.id,
        status: CareProtocolStatus.APPROVED,
      },
      orderBy: { version: 'desc' },
      include: {
        instructions: {
          orderBy: [{ phase: 'asc' }, { sortOrder: 'asc' }],
        },
        escalationRules: true,
      },
    });

    if (!approvedProtocol) {
      return {
        appointmentId: appointment.id,
        treatmentId: resolvedTreatment.id,
        treatmentName: resolvedTreatment.name,
        protocolId: null,
        protocolName: null,
        version: null,
        approvedAt: null,
        instructions: [],
        escalationRules: clinicWideRules,
      };
    }

    // 4. Compute sendAt for each instruction
    // negative offsetMinutes = before appointment start
    // positive/zero offsetMinutes = after appointment end
    // stored/returned as UTC ISO string
    const startTimeMs = new Date(appointment.startTime).getTime();
    const endTimeMs = new Date(appointment.endTime).getTime();

    const resolvedInstructions = approvedProtocol.instructions.map((inst) => {
      let targetTimeMs: number;
      if (inst.offsetMinutes < 0) {
        targetTimeMs = startTimeMs + inst.offsetMinutes * 60 * 1000;
      } else {
        targetTimeMs = endTimeMs + inst.offsetMinutes * 60 * 1000;
      }

      const sendAt = new Date(targetTimeMs).toISOString();

      return {
        ...inst,
        sendAt,
      };
    });

    const protocolRules = approvedProtocol.escalationRules || [];
    const allRules = [...protocolRules, ...clinicWideRules];

    return {
      appointmentId: appointment.id,
      treatmentId: resolvedTreatment.id,
      treatmentName: resolvedTreatment.name,
      protocolId: approvedProtocol.id,
      protocolName: approvedProtocol.name,
      version: approvedProtocol.version,
      approvedAt: approvedProtocol.approvedAt ? approvedProtocol.approvedAt.toISOString() : null,
      instructions: resolvedInstructions,
      escalationRules: allRules,
    };
  }
}
