import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

const router = Router();

// Inbound webhook for messages and opt-outs
router.post('/messages/inbound', WebhookController.handleInboundMessage);

export default router;
