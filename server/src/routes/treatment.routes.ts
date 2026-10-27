import { Router } from 'express';
import { TreatmentController } from '../controllers/treatment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { tenantScope } from '../middlewares/tenant.middleware.js';

const router = Router();

router.use(authenticate);
router.use(tenantScope);

router.get('/', TreatmentController.list);
router.post('/', TreatmentController.create);
router.patch('/:id', TreatmentController.update);

export default router;
