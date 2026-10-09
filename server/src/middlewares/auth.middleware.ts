import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../prisma.js';
import { Role } from '@prisma/client';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No access token provided', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user still exists and is active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, clinicId: true, role: true, email: true, isActive: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw ApiError.unauthorized('User account no longer exists', 'UNAUTHORIZED');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('User account is inactive', 'ACCOUNT_INACTIVE');
    }

    req.user = {
      userId: user.id,
      clinicId: user.clinicId,
      role: user.role,
      email: user.email,
    };

    if (user.clinicId) {
      req.clinicId = user.clinicId;
    }

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Access token has expired', 'TOKEN_EXPIRED'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid access token', 'INVALID_TOKEN'));
    }
    next(error);
  }
};
