import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { Role } from '@prisma/client';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No access token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      clinicId: decoded.clinicId,
      role: decoded.role as Role,
      email: decoded.email,
    };

    if (decoded.clinicId) {
      req.clinicId = decoded.clinicId;
    }

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Access token has expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid access token'));
    }
    next(error);
  }
};
