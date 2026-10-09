import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export interface UpdateClinicInput {
  name?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  logoUrl?: string;
  workingHours?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isClosed?: boolean;
  }>;
}

export class ClinicService {
  static async getClinicProfile(clinicId: string) {
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            users: true,
            doctors: true,
            patients: true,
          },
        },
      },
    });

    if (!clinic || clinic.deletedAt) {
      throw ApiError.notFound('Clinic not found', 'CLINIC_NOT_FOUND');
    }

    return clinic;
  }

  static async updateClinicProfile(clinicId: string, input: UpdateClinicInput) {
    const existing = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!existing || existing.deletedAt) {
      throw ApiError.notFound('Clinic not found', 'CLINIC_NOT_FOUND');
    }

    const { workingHours, ...clinicData } = input;

    const result = await prisma.$transaction(async (tx) => {
      const updatedClinic = await tx.clinic.update({
        where: { id: clinicId },
        data: clinicData,
      });

      if (workingHours && Array.isArray(workingHours)) {
        // Delete existing clinic working hours (where doctorId is null)
        await tx.workingHours.deleteMany({
          where: { clinicId, doctorId: null },
        });

        // Insert new working hours
        if (workingHours.length > 0) {
          await tx.workingHours.createMany({
            data: workingHours.map((wh) => ({
              clinicId,
              dayOfWeek: wh.dayOfWeek,
              startTime: wh.startTime,
              endTime: wh.endTime,
              isClosed: wh.isClosed || false,
            })),
          });
        }
      }

      return tx.clinic.findUnique({
        where: { id: clinicId },
        include: { workingHours: { orderBy: { dayOfWeek: 'asc' } } },
      });
    });

    return result;
  }

  // SUPER_ADMIN methods
  static async listAllClinics(page = 1, limit = 10, search?: string, isActive?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [clinics, total] = await Promise.all([
      prisma.clinic.findMany({
        where,
        skip,
        take: limit,
        include: {
          subscriptions: {
            include: { plan: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { users: true, doctors: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.clinic.count({ where }),
    ]);

    return {
      clinics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateClinicStatus(clinicId: string, isActive: boolean) {
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinic || clinic.deletedAt) {
      throw ApiError.notFound('Clinic not found', 'CLINIC_NOT_FOUND');
    }

    const updated = await prisma.clinic.update({
      where: { id: clinicId },
      data: { isActive },
    });

    return updated;
  }
}
