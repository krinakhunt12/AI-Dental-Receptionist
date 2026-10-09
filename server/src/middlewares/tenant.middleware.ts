import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { Role } from '@prisma/client';

export const tenantScope = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(ApiError.unauthorized('User not authenticated'));
  }

  // If user is SUPER_ADMIN, they have global scope unless clinicId is explicitly supplied
  if (req.user.role === Role.SUPER_ADMIN) {
    req.clinicId = req.user.clinicId || (req.query.clinicId as string) || (req.body?.clinicId as string) || undefined;
    return next();
  }

  // For tenant users (CLINIC_ADMIN, DOCTOR, STAFF), clinicId MUST come from the token (req.user.clinicId)
  if (!req.user.clinicId) {
    return next(ApiError.forbidden('User does not belong to any clinic tenant'));
  }

  const tokenClinicId = req.user.clinicId;

  // Set req.clinicId strictly from token
  req.clinicId = tokenClinicId;

  // Enforce token clinicId over any body/query attempt to override clinicId
  if (req.body && typeof req.body === 'object') {
    req.body.clinicId = tokenClinicId;
  }

  if (req.query && typeof req.query === 'object') {
    req.query.clinicId = tokenClinicId;
  }

  next();
};
