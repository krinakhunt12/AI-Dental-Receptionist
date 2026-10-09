import { Router } from 'express';
import {
  UserController,
  createUserSchema,
  updateUserSchema,
  getUserParamsSchema,
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(tenantScope);

// CLINIC_ADMIN, DOCTOR, STAFF can view user list in their clinic
router.get('/', UserController.listUsers);

// CLINIC_ADMIN & SUPER_ADMIN can create users in their clinic
router.post(
  '/',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(createUserSchema),
  UserController.createUser
);

// View single user by ID (tenant-isolated)
router.get(
  '/:id',
  validateRequest(getUserParamsSchema),
  UserController.getUserById
);

// Update user details or role (CLINIC_ADMIN & SUPER_ADMIN)
router.patch(
  '/:id',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateUserSchema),
  UserController.updateUser
);

// Deactivate user in clinic (CLINIC_ADMIN & SUPER_ADMIN)
router.patch(
  '/:id/deactivate',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(getUserParamsSchema),
  UserController.deactivateUser
);

router.delete(
  '/:id',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(getUserParamsSchema),
  UserController.deactivateUser
);

export default router;
