import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';

const router = Router();

router.use(authenticate);
router.use(tenantScope);

router.get('/summary', DashboardController.getSummary);
router.get('/appointments-trend', DashboardController.getAppointmentsTrend);
router.get('/treatments-breakdown', DashboardController.getTreatmentsBreakdown);
router.get('/dentist-utilization', DashboardController.getDentistUtilization);
router.get('/ai-receptionist', DashboardController.getAiReceptionist);

export default router;
