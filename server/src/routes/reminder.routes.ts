import { Router } from 'express';
import { ReminderController, retryJobSchema } from '../controllers/reminder.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { logAudit } from '../middlewares/audit.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ReminderController.listJobs);

router.post(
  '/:id/retry',
  logAudit('REMINDER_JOB_RETRY', 'ReminderJob'),
  validateRequest(retryJobSchema),
  ReminderController.retryJob
);

export default router;
