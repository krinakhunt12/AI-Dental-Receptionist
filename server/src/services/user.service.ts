import bcrypt from 'bcryptjs';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import { Role } from '@prisma/client';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  phone?: string;
  isActive?: boolean;
}

export class UserService {
  static async createUser(clinicId: string, input: CreateUserInput) {
    if (input.role === Role.SUPER_ADMIN) {
      throw ApiError.forbidden('Cannot create SUPER_ADMIN user via clinic user management', 'INVALID_ROLE');
    }

    // Check email uniqueness per clinic
    const existing = await prisma.user.findFirst({
      where: { clinicId, email: input.email, deletedAt: null },
    });
    if (existing) {
      throw ApiError.conflict('User with this email already exists in your clinic', 'EMAIL_EXISTS_IN_CLINIC');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          clinicId,
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          phone: input.phone,
        },
        select: {
          id: true,
          clinicId: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      });

      // If user is DOCTOR, automatically create linked Doctor profile
      if (input.role === Role.DOCTOR) {
        await tx.doctor.create({
          data: {
            clinicId,
            userId: createdUser.id,
            name: `Dr. ${input.firstName} ${input.lastName}`,
            email: input.email,
            phone: input.phone,
          },
        });
      }

      return createdUser;
    });

    return user;
  }

  static async listUsers(
    clinicId?: string,
    page = 1,
    limit = 10,
    search?: string,
    role?: Role
  ) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (clinicId) {
      where.clinicId = clinicId;
    }

    if (role) {
      where.role = role;
    }

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
          clinicId: true,
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

  static async getUserById(targetUserId: string, requesterClinicId?: string, requesterRole?: Role) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        clinicId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        clinic: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }

    // Tenant Isolation Check
    if (requesterRole !== Role.SUPER_ADMIN && user.clinicId !== requesterClinicId) {
      throw ApiError.forbidden('Access denied: User belongs to another clinic tenant', 'TENANT_VIOLATION');
    }

    return user;
  }

  static async updateUser(
    targetUserId: string,
    requesterUserId: string,
    requesterClinicId: string | undefined,
    requesterRole: Role,
    input: UpdateUserInput
  ) {
    const existing = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!existing || existing.deletedAt) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }

    // Tenant Isolation Check
    if (requesterRole !== Role.SUPER_ADMIN && existing.clinicId !== requesterClinicId) {
      throw ApiError.forbidden('Access denied: User belongs to another clinic tenant', 'TENANT_VIOLATION');
    }

    // "Users cannot change their own role."
    if (targetUserId === requesterUserId && input.role && input.role !== existing.role) {
      throw ApiError.forbidden('Users cannot change their own role', 'CANNOT_CHANGE_OWN_ROLE');
    }

    // Email uniqueness check per clinic
    if (input.email && input.email !== existing.email && existing.clinicId) {
      const duplicate = await prisma.user.findFirst({
        where: { clinicId: existing.clinicId, email: input.email, deletedAt: null },
      });
      if (duplicate) {
        throw ApiError.conflict('User with this email already exists in your clinic', 'EMAIL_EXISTS_IN_CLINIC');
      }
    }

    const updateData: any = { ...input };
    if (input.password) {
      updateData.passwordHash = await bcrypt.hash(input.password, 10);
      delete updateData.password;
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        clinicId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  static async deactivateUser(
    targetUserId: string,
    requesterUserId: string,
    requesterClinicId: string | undefined,
    requesterRole: Role
  ) {
    if (targetUserId === requesterUserId) {
      throw ApiError.badRequest('You cannot deactivate your own account', undefined, 'CANNOT_DEACTIVATE_SELF');
    }

    const existing = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!existing || existing.deletedAt) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }

    // Tenant Isolation Check
    if (requesterRole !== Role.SUPER_ADMIN && existing.clinicId !== requesterClinicId) {
      throw ApiError.forbidden('Access denied: User belongs to another clinic tenant', 'TENANT_VIOLATION');
    }

    const deactivatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return deactivatedUser;
  }
}
