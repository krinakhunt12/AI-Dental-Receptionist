import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', KnowledgeController.listDocuments);
router.get('/search', KnowledgeController.search);
router.post('/', authenticate, KnowledgeController.addDocument);
router.delete('/:id', authenticate, KnowledgeController.deleteDocument);

export default router;
