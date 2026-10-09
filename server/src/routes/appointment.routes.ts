import { Router } from 'express';
import {
  AppointmentController,
  createAppointmentSchema,
  updateStatusSchema,
} from '../controllers/appointment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { logAudit } from '../middlewares/audit.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/slots', AppointmentController.getAvailableSlots);
router.get('/', AppointmentController.list);
router.get('/:id', AppointmentController.getById);
router.post(
  '/',
  logAudit('APPOINTMENT_CREATE', 'Appointment'),
  validateRequest(createAppointmentSchema),
  AppointmentController.create
);
router.patch(
  '/:id/status',
  logAudit('APPOINTMENT_STATUS_CHANGE', 'Appointment'),
  validateRequest(updateStatusSchema),
  AppointmentController.updateStatus
);
router.post(
  '/:id/cancel',
  logAudit('APPOINTMENT_CANCEL', 'Appointment'),
  AppointmentController.cancel
);

export default router;
