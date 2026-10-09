import { Router } from 'express';
import {
  ClinicController,
  updateClinicSchema,
  createUserSchema,
} from '../controllers/clinic.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', ClinicController.getProfile);
router.patch(
  '/',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateClinicSchema),
  ClinicController.updateProfile
);

router.get('/users', authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN), ClinicController.listUsers);
router.post(
  '/users',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(createUserSchema),
  ClinicController.createUser
);

export default router;
