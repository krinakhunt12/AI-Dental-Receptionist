import { Router } from 'express';
import {
  AppointmentController,
  createAppointmentSchema,
  updateStatusSchema,
} from '../controllers/appointment.controller.js';
import {
  CareProtocolController,
  getCarePlanSchema,
} from '../controllers/careProtocol.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { logAudit } from '../middlewares/audit.middleware.js';

import { ReminderController } from '../controllers/reminder.controller.js';

const router = Router();

router.use(authenticate);

router.get('/:id/care-plan', validateRequest(getCarePlanSchema), CareProtocolController.getCarePlan);
router.get('/:id/reminders', ReminderController.getAppointmentReminders);

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
  '/:id',
  logAudit('APPOINTMENT_UPDATE', 'Appointment'),
  AppointmentController.update
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
