import { Router } from 'express';
import {
  DoctorController,
  createDoctorSchema,
} from '../controllers/doctor.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', DoctorController.list);
router.get('/:id', DoctorController.getById);
router.post(
  '/',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDoctorSchema),
  DoctorController.create
);
router.patch(
  '/:id',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  DoctorController.update
);
router.delete(
  '/:id',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  DoctorController.softDelete
);

export default router;
