import { Router } from 'express';
import { TriageController, triageMessageSchema } from '../controllers/triage.controller.js';
import { validateRequest } from '../middlewares/validate.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';
import {
  triagePatientRateLimiter,
  triageClinicRateLimiter,
} from '../middlewares/triageRateLimit.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';

const router = Router();

// GET /triage/logs - Authenticated staff triage logs view
router.get('/logs', authenticate, tenantScope, TriageController.listLogs);

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
