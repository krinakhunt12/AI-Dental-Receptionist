export interface TemplateConfig {
  whatsapp: string;
  sms: string;
}

// Pre-approved WhatsApp Business templates and Indian SMS DLT (Distributed Ledger Technology) registered templates
// In India, TRAI mandates DLT registration for all commercial SMS headers and templates.
// WhatsApp requires Meta Business Manager pre-approved message templates.
export const NOTIFICATION_TEMPLATES: Record<string, TemplateConfig> = {
  PRE_OP_REMINDER: {
    // TODO: Replace with Meta WhatsApp Business approved template ID
    whatsapp: 'smilecare_preop_reminder_v1',
    // TODO: Replace with TRAI DLT approved template ID from telecom portal (e.g. Jio/Airtel/Vil DLT)
    sms: 'DLT_TE_1201159876543210',
  },
  POST_OP_REMINDER: {
    // TODO: Replace with Meta WhatsApp Business approved template ID
    whatsapp: 'smilecare_postop_reminder_v1',
    // TODO: Replace with TRAI DLT approved template ID from telecom portal
    sms: 'DLT_TE_1201159876543211',
  },
  GENERAL_CARE_REMINDER: {
    // TODO: Replace with Meta WhatsApp Business approved template ID
    whatsapp: 'smilecare_general_care_v1',
    // TODO: Replace with TRAI DLT approved template ID from telecom portal
    sms: 'DLT_TE_1201159876543212',
  },
};
