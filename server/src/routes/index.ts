import { Router } from 'express';
import authRoutes from './auth.routes.js';
import clinicRoutes from './clinic.routes.js';
import userRoutes from './user.routes.js';
import patientRoutes from './patient.routes.js';
import doctorRoutes from './doctor.routes.js';
import appointmentRoutes from './appointment.routes.js';
import aiRoutes from './ai.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import careProtocolRoutes from './careProtocol.routes.js';
import reminderRoutes from './reminder.routes.js';
import webhookRoutes from './webhook.routes.js';
import triageRoutes from './triage.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import notificationRoutes from './notification.routes.js';
import treatmentRoutes from './treatment.routes.js';
import knowledgeRoutes from './knowledge.routes.js';
import { AppointmentController } from '../controllers/appointment.controller.js';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { chat } from '../agent.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clinics', clinicRoutes);
router.use('/clinic', clinicRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/dentists', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/slots', authenticate, tenantScope, AppointmentController.getAvailableSlots);
router.use('/treatments', treatmentRoutes);
router.use('/services', treatmentRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/care-protocols', careProtocolRoutes);
router.use('/reminder-jobs', reminderRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/triage', triageRoutes);
router.use('/knowledge', knowledgeRoutes);

// Public / Clinic AI chat agent endpoint
router.post('/chat', async (req, res, next) => {
  try {
    const { messages } = req.body;
    const result = await chat(messages || []);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Clinic stats endpoint
router.get('/stats', authenticate, tenantScope, DashboardController.getStats);

export default router;

