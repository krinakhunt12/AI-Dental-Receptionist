import { Router } from 'express';
import {
  PatientController,
  createPatientSchema,
  updatePatientSchema,
} from '../controllers/patient.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { logAudit } from '../middlewares/audit.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', logAudit('PATIENT_LIST', 'Patient'), PatientController.list);
router.get('/:id', logAudit('PATIENT_VIEW', 'Patient'), PatientController.getById);
router.post('/', logAudit('PATIENT_CREATE', 'Patient'), validateRequest(createPatientSchema), PatientController.create);
router.patch('/:id', logAudit('PATIENT_UPDATE', 'Patient'), validateRequest(updatePatientSchema), PatientController.update);
router.delete('/:id', logAudit('PATIENT_DELETE', 'Patient'), PatientController.softDelete);

export default router;
