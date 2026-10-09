import { Router } from 'express';
import {
  AuthController,
  registerClinicSchema,
  loginSchema,
  refreshSchema,
} from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerClinicSchema), AuthController.registerClinic);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh', validateRequest(refreshSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
