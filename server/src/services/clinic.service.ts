import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export class ClinicService {
  static async getClinicProfile(clinicId: string) {
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    if (!clinic || clinic.deletedAt) {
      throw ApiError.notFound('Clinic not found');
    }

    return clinic;
  }

  static async updateClinicProfile(clinicId: string, data: { name?: string; phone?: string; address?: string; timezone?: string }) {
    const clinic = await prisma.clinic.update({
      where: { id: clinicId },
      data,
    });
    return clinic;
  }

  // Clinic user management
  static async listClinicUsers(clinicId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {
      clinicId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async createClinicUser(clinicId: string, data: { firstName: string; lastName: string; email: string; password: string; role: Role; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw ApiError.conflict('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        clinicId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        role: data.role,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    return user;
  }
}
