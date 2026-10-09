import { Router } from 'express';
import {
  AiController,
  createConversationSchema,
  addMessageSchema,
  logCallSchema,
} from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.js';

const router = Router();

router.use(authenticate);

// Conversations
router.get('/conversations', AiController.listConversations);
router.post('/conversations', validateRequest(createConversationSchema), AiController.createConversation);
router.get('/conversations/:id', AiController.getConversation);
router.post('/conversations/:id/messages', validateRequest(addMessageSchema), AiController.addMessage);

// Call logs
router.get('/call-logs', AiController.listCallLogs);
router.post('/call-logs', validateRequest(logCallSchema), AiController.logCall);

export default router;
