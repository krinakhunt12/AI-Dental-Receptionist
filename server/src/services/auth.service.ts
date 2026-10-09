import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { Role } from '@prisma/client';

export interface RegisterClinicInput {
  clinicName: string;
  slug?: string;
  email: string;
  phone: string;
  address?: string;
  timezone?: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
  clinicId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ForgotPasswordInput {
  email: string;
  clinicId?: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export class AuthService {
  static async registerClinic(input: RegisterClinicInput) {
    const slug = input.slug || input.clinicName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 1. Check if clinic slug already exists
    const existingClinic = await prisma.clinic.findUnique({
      where: { slug },
    });
    if (existingClinic) {
      throw ApiError.conflict('Clinic with this URL slug already exists', 'SLUG_EXISTS');
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
          features: { aiReceptionist: true, voiceAi: false },
        },
      });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(input.adminPassword, 10);

    // 4. Create Clinic, Admin User, and 14-day Trial Subscription in ONE transaction
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14-day free trial

    const result = await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: input.clinicName,
          slug,
          email: input.email,
          phone: input.phone,
          address: input.address,
          timezone: input.timezone || 'UTC',
        },
      });

      // Check user email uniqueness within new clinic
      const existingUser = await tx.user.findFirst({
        where: { clinicId: clinic.id, email: input.adminEmail },
      });
      if (existingUser) {
        throw ApiError.conflict('User with this email already exists in clinic', 'EMAIL_EXISTS');
      }

      const user = await tx.user.create({
        data: {
          clinicId: clinic.id,
          email: input.adminEmail,
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

      await tx.auditLog.create({
        data: {
          clinicId: clinic.id,
          userId: user.id,
          action: 'REGISTER_CLINIC',
          resource: 'Clinic',
          resourceId: clinic.id,
          details: { clinicName: clinic.name, adminEmail: user.email },
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
        email: result.clinic.email,
        phone: result.clinic.phone,
        timezone: result.clinic.timezone,
      },
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        clinicId: result.user.clinicId,
      },
      subscription: {
        status: result.subscription.status,
        trialEndsAt: result.subscription.currentPeriodEnd,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async login(input: LoginInput) {
    // Audit logging attempt - NEVER log password!
    logger.info(`Login attempt for email: ${input.email}`);

    // Search user by email (and optional clinicId)
    const whereCondition: any = { email: input.email };
    if (input.clinicId) {
      whereCondition.clinicId = input.clinicId;
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      include: { clinic: true },
    });

    if (!users || users.length === 0) {
      logger.warn(`Login failed: User not found (${input.email})`);
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // If multiple users exist across clinics and clinicId wasn't provided, test password match
    let user = users[0];
    if (users.length > 1) {
      let matched = false;
      for (const u of users) {
        if (await bcrypt.compare(input.password, u.passwordHash)) {
          user = u;
          matched = true;
          break;
        }
      }
      if (!matched) {
        logger.warn(`Login failed: Invalid password (${input.email})`);
        throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
      }
    } else {
      const isMatch = await bcrypt.compare(input.password, user.passwordHash);
      if (!isMatch) {
        logger.warn(`Login failed: Invalid password (${input.email})`);
        throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
      }
    }

    if (user.deletedAt) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your user account has been deactivated', 'ACCOUNT_DEACTIVATED');
    }

    if (user.clinic && (!user.clinic.isActive || user.clinic.deletedAt)) {
      throw ApiError.forbidden('Your clinic account is inactive or disabled', 'CLINIC_INACTIVE');
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

    // Create audit log for successful login
    await prisma.auditLog.create({
      data: {
        clinicId: user.clinicId,
        userId: user.id,
        action: 'USER_LOGIN',
        resource: 'User',
        resourceId: user.id,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        details: { email: user.email },
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

  static async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required', 'TOKEN_REQUIRED');
    }

    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token signature', 'INVALID_TOKEN');
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token is revoked or expired', 'TOKEN_EXPIRED');
    }

    const user = storedToken.user;
    if (!user || !user.isActive || user.deletedAt) {
      throw ApiError.unauthorized('User account unavailable', 'ACCOUNT_UNAVAILABLE');
    }

    const tokenPayload = {
      userId: user.id,
      clinicId: user.clinicId,
      role: user.role,
      email: user.email,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Refresh Token Rotation: Revoke old token and save new token in DB
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

  static async forgotPassword(input: ForgotPasswordInput) {
    const whereCondition: any = { email: input.email };
    if (input.clinicId) {
      whereCondition.clinicId = input.clinicId;
    }

    const user = await prisma.user.findFirst({ where: whereCondition });

    if (user && user.isActive && !user.deletedAt) {
      // Generate secure 32-byte hex token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiration

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt,
          used: false,
        },
      });

      // MOCK EMAIL SERVICE LOG
      logger.info(
        `[MOCK EMAIL SERVICE] To: ${user.email} | Subject: Password Reset Request | Token: ${resetToken} | Expires: 30 mins`
      );
    }

    // Always return neutral message to prevent account enumeration
    return {
      message: 'If an account exists with that email, a password reset link has been sent.',
    };
  }

  static async resetPassword(input: ResetPasswordInput) {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: input.token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      throw ApiError.badRequest('Invalid or expired password reset token', undefined, 'INVALID_RESET_TOKEN');
    }

    const user = resetRecord.user;
    if (!user || !user.isActive || user.deletedAt) {
      throw ApiError.badRequest('Associated user account is unavailable', undefined, 'ACCOUNT_UNAVAILABLE');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
      // Revoke all active refresh tokens for safety after password reset
      prisma.refreshToken.updateMany({
        where: { userId: user.id },
        data: { revoked: true },
      }),
    ]);

    logger.info(`Password successfully reset for user: ${user.email}`);
    return { message: 'Password reset successful. You can now log in with your new password.' };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        clinicId: true,
        createdAt: true,
        clinic: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            phone: true,
            address: true,
            logoUrl: true,
            timezone: true,
            isActive: true,
            subscriptions: {
              select: {
                status: true,
                currentPeriodEnd: true,
                plan: { select: { name: true, code: true } },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User account not found or inactive');
    }

    return user;
  }
}
