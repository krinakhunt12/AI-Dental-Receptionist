import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';

const router = Router();

router.use(authenticate);
router.use(tenantScope);

router.get('/staff', NotificationController.listStaffNotifications);
router.patch('/staff/:id/acknowledge', NotificationController.acknowledgeNotification);

export default router;
