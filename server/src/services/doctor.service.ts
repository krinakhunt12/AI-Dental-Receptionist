import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export interface CreateDoctorInput {
  name: string;
  specialty?: string;
  email?: string;
  phone?: string;
  bio?: string;
  colorCode?: string;
  workingHours?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isClosed?: boolean;
  }[];
}

export class DoctorService {
  static async listDoctors(clinicId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {
      clinicId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        include: { workingHours: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.doctor.count({ where }),
    ]);

    return {
      doctors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getDoctorById(clinicId: string, doctorId: string) {
    const doctor = await prisma.doctor.findFirst({
      where: {
        id: doctorId,
        clinicId,
        deletedAt: null,
      },
      include: {
        workingHours: true,
      },
    });

    if (!doctor) {
      throw ApiError.notFound('Doctor not found');
    }

    return doctor;
  }

  static async createDoctor(clinicId: string, input: CreateDoctorInput) {
    // Check doctor limit on subscription plan
    const subscription = await prisma.subscription.findUnique({
      where: { clinicId },
      include: { plan: true },
    });

    if (subscription && subscription.plan) {
      const activeDoctorsCount = await prisma.doctor.count({
        where: { clinicId, deletedAt: null },
      });
      if (activeDoctorsCount >= subscription.plan.maxDoctors) {
        throw ApiError.forbidden(
          `Plan doctor limit reached (${subscription.plan.maxDoctors} doctors max). Upgrade subscription plan.`
        );
      }
    }

    const doctor = await prisma.doctor.create({
      data: {
        clinicId,
        name: input.name,
        specialty: input.specialty,
        email: input.email,
        phone: input.phone,
        bio: input.bio,
        colorCode: input.colorCode || '#3B82F6',
        workingHours: input.workingHours
          ? {
              create: input.workingHours.map((wh) => ({
                clinicId,
                dayOfWeek: wh.dayOfWeek,
                startTime: wh.startTime,
                endTime: wh.endTime,
                isClosed: wh.isClosed || false,
              })),
            }
          : undefined,
      },
      include: { workingHours: true },
    });

    return doctor;
  }

  static async updateDoctor(clinicId: string, doctorId: string, input: Partial<CreateDoctorInput>) {
    await this.getDoctorById(clinicId, doctorId);

    const { workingHours, ...doctorData } = input;

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: doctorData,
      include: { workingHours: true },
    });

    if (workingHours) {
      // Refresh working hours
      await prisma.workingHours.deleteMany({
        where: { doctorId, clinicId },
      });

      await prisma.workingHours.createMany({
        data: workingHours.map((wh) => ({
          clinicId,
          doctorId,
          dayOfWeek: wh.dayOfWeek,
          startTime: wh.startTime,
          endTime: wh.endTime,
          isClosed: wh.isClosed || false,
        })),
      });
    }

    return this.getDoctorById(clinicId, doctorId);
  }

  static async softDeleteDoctor(clinicId: string, doctorId: string) {
    await this.getDoctorById(clinicId, doctorId);

    await prisma.doctor.update({
      where: { id: doctorId },
      data: { deletedAt: new Date() },
    });

    return true;
  }
}
