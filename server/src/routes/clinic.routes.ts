import { Router } from 'express';
import {
  ClinicController,
  updateClinicSchema,
  updateClinicStatusSchema,
} from '../controllers/clinic.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Clinic self-management endpoints (/api/v1/clinics/me)
router.get('/me', tenantScope, ClinicController.getProfile);

router.patch(
  '/me',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  tenantScope,
  validateRequest(updateClinicSchema),
  ClinicController.updateProfile
);

// SUPER_ADMIN clinic administration endpoints
router.get(
  '/',
  authorizeRoles(Role.SUPER_ADMIN),
  ClinicController.listAllClinics
);

router.patch(
  '/:id/status',
  authorizeRoles(Role.SUPER_ADMIN),
  validateRequest(updateClinicStatusSchema),
  ClinicController.updateStatus
);

export default router;
