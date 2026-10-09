import { Router } from 'express';
import {
  SubscriptionController,
  updatePlanSchema,
} from '../controllers/subscription.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { Role } from '@prisma/client';

const router = Router();

// Public route to view plans
router.get('/plans', SubscriptionController.listPlans);

// Authenticated routes
router.use(authenticate);
router.get('/', SubscriptionController.getSubscription);
router.post(
  '/plan',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  validateRequest(updatePlanSchema),
  SubscriptionController.updatePlan
);
router.post(
  '/cancel',
  authorizeRoles(Role.CLINIC_ADMIN, Role.SUPER_ADMIN),
  SubscriptionController.cancel
);
router.get('/invoices', SubscriptionController.listInvoices);

export default router;
