import rateLimit from 'express-rate-limit';
import { Request } from 'express';

/**
 * Rate limit per patient: max 20 requests per 10 minutes
 */
export const triagePatientRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.body?.patientId ? `patient_${req.body.patientId}` : (req.ip || 'unknown_ip');
  },
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many triage requests for this patient. Please wait a few minutes before trying again.',
      details: null,
    },
  },
});

/**
 * Rate limit per clinic: max 150 requests per 10 minutes
 */
export const triageClinicRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.clinicId ? `clinic_${req.clinicId}` : (req.ip || 'unknown_clinic');
  },
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many triage requests for this clinic. Please wait before retrying.',
      details: null,
    },
  },
});
