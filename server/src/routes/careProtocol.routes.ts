import { Router } from 'express';
import {
  CareProtocolController,
  listCareProtocolsSchema,
  getCareProtocolSchema,
  createCareProtocolSchema,
  updateCareProtocolSchema,
  approveCareProtocolSchema,
  createCareInstructionSchema,
  updateCareInstructionSchema,
  createEscalationRuleSchema,
  updateEscalationRuleSchema,
} from '../controllers/careProtocol.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { logAudit } from '../middlewares/audit.middleware.js';

const router = Router();

router.use(authenticate);

// --- Protocol Endpoints ---
router.get('/', validateRequest(listCareProtocolsSchema), CareProtocolController.list);

router.get('/:id', validateRequest(getCareProtocolSchema), CareProtocolController.getById);

router.post(
  '/',
  logAudit('CARE_PROTOCOL_CREATE', 'CareProtocol'),
  validateRequest(createCareProtocolSchema),
  CareProtocolController.create
);

router.patch(
  '/:id',
  logAudit('CARE_PROTOCOL_UPDATE', 'CareProtocol'),
  validateRequest(updateCareProtocolSchema),
  CareProtocolController.update
);

router.post(
  '/:id/approve',
  logAudit('CARE_PROTOCOL_APPROVE', 'CareProtocol'),
  validateRequest(approveCareProtocolSchema),
  CareProtocolController.approve
);

// --- Instruction Endpoints ---
router.post(
  '/:id/instructions',
  logAudit('CARE_INSTRUCTION_CREATE', 'CareInstruction'),
  validateRequest(createCareInstructionSchema),
  CareProtocolController.addInstruction
);

router.patch(
  '/instructions/:instructionId',
  logAudit('CARE_INSTRUCTION_UPDATE', 'CareInstruction'),
  validateRequest(updateCareInstructionSchema),
  CareProtocolController.updateInstruction
);

router.delete(
  '/instructions/:instructionId',
  logAudit('CARE_INSTRUCTION_DELETE', 'CareInstruction'),
  CareProtocolController.deleteInstruction
);

router.patch(
  '/:id/instructions/:instructionId',
  logAudit('CARE_INSTRUCTION_UPDATE', 'CareInstruction'),
  validateRequest(updateCareInstructionSchema),
  CareProtocolController.updateInstruction
);

router.delete(
  '/:id/instructions/:instructionId',
  logAudit('CARE_INSTRUCTION_DELETE', 'CareInstruction'),
  CareProtocolController.deleteInstruction
);

// --- Escalation Rule Endpoints ---
router.post(
  '/rules',
  logAudit('ESCALATION_RULE_CREATE', 'EscalationRule'),
  validateRequest(createEscalationRuleSchema),
  CareProtocolController.createEscalationRule
);

router.post(
  '/:id/rules',
  logAudit('ESCALATION_RULE_CREATE', 'EscalationRule'),
  validateRequest(createEscalationRuleSchema),
  CareProtocolController.createEscalationRule
);

router.patch(
  '/rules/:ruleId',
  logAudit('ESCALATION_RULE_UPDATE', 'EscalationRule'),
  validateRequest(updateEscalationRuleSchema),
  CareProtocolController.updateEscalationRule
);

router.delete(
  '/rules/:ruleId',
  logAudit('ESCALATION_RULE_DELETE', 'EscalationRule'),
  CareProtocolController.deleteEscalationRule
);

export default router;
