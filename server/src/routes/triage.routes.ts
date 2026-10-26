import { Router } from 'express';
import { TriageController, triageMessageSchema } from '../controllers/triage.controller.js';
import { validateRequest } from '../middlewares/validate.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';
import {
  triagePatientRateLimiter,
  triageClinicRateLimiter,
} from '../middlewares/triageRateLimit.js';

const router = Router();

// POST /triage/message
// Patient & clinic rate-limited, validated, clinic-scoped
router.post(
  '/message',
  optionalAuthenticate,
  triagePatientRateLimiter,
  triageClinicRateLimiter,
  validateRequest(triageMessageSchema),
  TriageController.triageMessage
);

export default router;
