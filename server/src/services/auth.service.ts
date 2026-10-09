import bcrypt from 'bcryptjs';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { Role } from '@prisma/client';

export interface RegisterClinicInput {
  clinicName: string;
  slug: string;
  email: string;
  phone: string;
  address?: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  static async registerClinic(input: RegisterClinicInput) {
    // 1. Check if user email or clinic slug already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const existingClinic = await prisma.clinic.findUnique({
      where: { slug: input.slug },
    });
    if (existingClinic) {
      throw ApiError.conflict('Clinic with this unique URL slug already exists');
    }

    // 2. Fetch or seed default "Free Trial" plan
    let freePlan = await prisma.plan.findUnique({
      where: { code: 'FREE_TRIAL' },
    });

    if (!freePlan) {
      freePlan = await prisma.plan.create({
        data: {
          name: 'Free Trial',
          code: 'FREE_TRIAL',
          priceMonthly: 0,
          priceYearly: 0,
          maxDoctors: 2,
          maxAppointmentsPerMonth: 50,
          maxAiCallsPerMonth: 100,
          features: { aiReceptionist: true, analytics: false },
        },
      });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(input.adminPassword, 12);

    // 4. Create Clinic, Admin User, and Trial Subscription in a transaction
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days trial

    const result = await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: input.clinicName,
          slug: input.slug,
          email: input.email,
          phone: input.phone,
          address: input.address,
        },
      });

      const user = await tx.user.create({
        data: {
          clinicId: clinic.id,
          email: input.email,
          passwordHash,
          firstName: input.adminFirstName,
          lastName: input.adminLastName,
          role: Role.CLINIC_ADMIN,
          phone: input.phone,
        },
      });

      const subscription = await tx.subscription.create({
        data: {
          clinicId: clinic.id,
          planId: freePlan.id,
          status: 'TRIALING',
          currentPeriodStart: now,
          currentPeriodEnd: trialEnd,
        },
      });

      return { clinic, user, subscription };
    });

    const tokenPayload = {
      userId: result.user.id,
      clinicId: result.clinic.id,
      role: result.user.role,
      email: result.user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in DB
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        userId: result.user.id,
        token: refreshToken,
        expiresAt: refreshExpires,
      },
    });

    return {
      clinic: {
        id: result.clinic.id,
        name: result.clinic.name,
        slug: result.clinic.slug,
      },
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { clinic: true },
    });

    if (!user || user.deletedAt) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your user account has been deactivated');
    }

    if (user.clinic && (!user.clinic.isActive || user.clinic.deletedAt)) {
      throw ApiError.forbidden('Your clinic account is inactive or disabled');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokenPayload = {
      userId: user.id,
      clinicId: user.clinicId,
      role: user.role,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshExpires,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        clinicId: user.clinicId,
        clinicName: user.clinic?.name || null,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async refreshAccessToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
      }

      const user = storedToken.user;
      if (!user || !user.isActive || user.deletedAt) {
        throw ApiError.unauthorized('User account unavailable');
      }

      const tokenPayload = {
        userId: user.id,
        clinicId: user.clinicId,
        role: user.role,
        email: user.email,
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Revoke old token and save new token
      await prisma.$transaction([
        prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { revoked: true },
        }),
        prisma.refreshToken.create({
          data: {
            userId: user.id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        }),
      ]);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }

  static async logout(refreshToken: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
    return true;
  }
}
