import { Router } from 'express';
import {
  AuthController,
  registerClinicSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Public Auth Endpoints
router.post(
  '/register-clinic',
  validateRequest(registerClinicSchema),
  AuthController.registerClinic
);

router.post(
  '/login',
  authLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

router.post(
  '/refresh',
  validateRequest(refreshSchema),
  AuthController.refresh
);

router.post('/logout', AuthController.logout);

router.post(
  '/forgot-password',
  authLimiter,
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword
);

// Protected Endpoint
router.get('/me', authenticate, AuthController.me);

export default router;
