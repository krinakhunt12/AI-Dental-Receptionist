import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import { AppointmentSource, AppointmentStatus } from '@prisma/client';

export interface CreateAppointmentInput {
  doctorId: string;
  patientId: string;
  serviceId?: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  source?: AppointmentSource;
  notes?: string;
}

export class AppointmentService {
  static async listAppointments(
    clinicId: string,
    page = 1,
    limit = 10,
    doctorId?: string,
    patientId?: string,
    status?: AppointmentStatus,
    date?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = {
      clinicId,
      deletedAt: null,
    };

    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    if (date) {
      const dayStart = new Date(date);
      dayStart.setUTCHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setUTCHours(23, 59, 59, 999);
      where.startTime = { gte: dayStart, lte: dayEnd };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          doctor: { select: { id: true, name: true, specialty: true } },
          patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
          service: { select: { id: true, name: true, durationMins: true, price: true } },
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getAppointmentById(clinicId: string, id: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id, clinicId, deletedAt: null },
      include: {
        doctor: true,
        patient: true,
        service: true,
      },
    });

    if (!appointment) {
      throw ApiError.notFound('Appointment not found');
    }

    return appointment;
  }

  static async createAppointment(clinicId: string, input: CreateAppointmentInput) {
    const start = new Date(input.startTime);
    const end = new Date(input.endTime);

    if (start >= end) {
      throw ApiError.badRequest('End time must be after start time');
    }

    // 1. Check Plan Appointment Limits
    const subscription = await prisma.subscription.findUnique({
      where: { clinicId },
      include: { plan: true },
    });

    if (subscription && subscription.plan) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const countThisMonth = await prisma.appointment.count({
        where: {
          clinicId,
          createdAt: { gte: startOfMonth },
          deletedAt: null,
        },
      });

      if (countThisMonth >= subscription.plan.maxAppointmentsPerMonth) {
        throw ApiError.forbidden(
          `Monthly appointment limit of ${subscription.plan.maxAppointmentsPerMonth} reached for current subscription plan.`
        );
      }
    }

    // 2. Prevent Double Booking for the Doctor
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        clinicId,
        doctorId: input.doctorId,
        deletedAt: null,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        OR: [
          {
            startTime: { lte: start },
            endTime: { gt: start },
          },
          {
            startTime: { lt: end },
            endTime: { gte: end },
          },
          {
            startTime: { gte: start },
            endTime: { lte: end },
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw ApiError.conflict('Doctor is double-booked for the selected time slot');
    }

    // 3. Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        clinicId,
        doctorId: input.doctorId,
        patientId: input.patientId,
        serviceId: input.serviceId,
        startTime: start,
        endTime: end,
        source: input.source || AppointmentSource.MANUAL,
        notes: input.notes,
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        doctor: { select: { id: true, name: true } },
        patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
        service: { select: { id: true, name: true } },
      },
    });

    return appointment;
  }

  static async updateAppointmentStatus(clinicId: string, id: string, status: AppointmentStatus, notes?: string) {
    await this.getAppointmentById(clinicId, id);

    return prisma.appointment.update({
      where: { id },
      data: {
        status,
        ...(notes && { notes }),
      },
    });
  }

  static async cancelAppointment(clinicId: string, id: string, reason?: string) {
    await this.getAppointmentById(clinicId, id);

    return prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
      },
    });
  }
}
