import { Router } from 'express';
import authRoutes from './auth.routes.js';
import clinicRoutes from './clinic.routes.js';
import userRoutes from './user.routes.js';
import patientRoutes from './patient.routes.js';
import doctorRoutes from './doctor.routes.js';
import appointmentRoutes from './appointment.routes.js';
import aiRoutes from './ai.routes.js';
import subscriptionRoutes from './subscription.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clinics', clinicRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/ai', aiRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;
