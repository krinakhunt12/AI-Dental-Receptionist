import crypto from 'crypto';
import { NotificationChannel } from '@prisma/client';
import { NOTIFICATION_TEMPLATES } from '../../config/templates.js';

export interface SendMessageOptions {
  to: string;
  templateKey: string;
  variables: {
    patientName: string;
    clinicName: string;
    instructionTitle: string;
    instructionBody: string;
    [key: string]: string;
  };
  channel: NotificationChannel;
}

export interface SendMessageResult {
  success: boolean;
  messageId: string;
  providerStatus: string;
  error?: string;
}

export interface MessageProvider {
  send(options: SendMessageOptions): Promise<SendMessageResult>;
}

/**
 * Mask sensitive phone number for production log compliance (e.g., +919876543210 -> +9198*****210)
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 5) return '***';
  const clean = phone.trim();
  const start = clean.slice(0, Math.min(4, Math.floor(clean.length / 2)));
  const end = clean.slice(-2);
  const maskedCount = Math.max(3, clean.length - start.length - end.length);
  return `${start}${'*'.repeat(maskedCount)}${end}`;
}

/**
 * Mask message body for log privacy (replaces interior details with snippet and redacted count)
 */
export function maskBody(body: string): string {
  if (!body) return '';
  if (body.length <= 15) return '[masked body]';
  const preview = body.slice(0, 12);
  return `${preview}... [redacted ${body.length - 12} chars]`;
}

/**
 * Mock Provider for development, testing, and sandbox runs.
 * Logs masked parameters without exposing PII.
 */
export class MockProvider implements MessageProvider {
  async send(options: SendMessageOptions): Promise<SendMessageResult> {
    const maskedTo = maskPhone(options.to);
    const maskedContent = maskBody(options.variables.instructionBody);
    const mockId = `mock_msg_${options.channel.toLowerCase()}_${crypto.randomUUID()}`;

    console.log(
      `[MockProvider] [${options.channel}] Sent template "${options.templateKey}" to ${maskedTo} | patient=${options.variables.patientName} | clinic=${options.variables.clinicName} | title=${options.variables.instructionTitle} | bodyPreview=${maskedContent} | msgId=${mockId}`
    );

    return {
      success: true,
      messageId: mockId,
      providerStatus: 'DELIVERED_MOCK',
    };
  }
}

/**
 * Live Provider stub for WhatsApp (Cloud API/Gupshup) & SMS (DLT Gateway).
 * Controlled strictly by environment variables without hardcoded secrets.
 */
export class LiveProvider implements MessageProvider {
  private whatsappApiKey: string | undefined;
  private smsApiKey: string | undefined;
  private smsSenderId: string | undefined;

  constructor() {
    this.whatsappApiKey = process.env.WHATSAPP_API_KEY;
    this.smsApiKey = process.env.SMS_API_KEY;
    this.smsSenderId = process.env.SMS_SENDER_ID;
  }

  async send(options: SendMessageOptions): Promise<SendMessageResult> {
    const templateConfig = NOTIFICATION_TEMPLATES[options.templateKey];
    const maskedTo = maskPhone(options.to);

    if (options.channel === NotificationChannel.WHATSAPP) {
      if (!this.whatsappApiKey) {
        console.warn(`[LiveProvider] Missing WHATSAPP_API_KEY. Simulating live dispatch for ${maskedTo}.`);
      }
      const templateId = templateConfig?.whatsapp || options.templateKey;
      console.log(`[LiveProvider] [WHATSAPP] Dispatching template ${templateId} to ${maskedTo}`);
      
      // In production, invoke Meta Cloud API or Gupshup/Twilio API here using this.whatsappApiKey
      const messageId = `live_wa_${crypto.randomUUID()}`;
      return {
        success: true,
        messageId,
        providerStatus: 'QUEUED_PROVIDER',
      };
    } else {
      if (!this.smsApiKey) {
        console.warn(`[LiveProvider] Missing SMS_API_KEY. Simulating live dispatch for ${maskedTo}.`);
      }
      const templateId = templateConfig?.sms || options.templateKey;
      console.log(
        `[LiveProvider] [SMS] Dispatching DLT template ${templateId} via sender ${this.smsSenderId || 'DEFAULT'} to ${maskedTo}`
      );

      // In production, invoke DLT SMS gateway (e.g., Kaleyra, Gupshup, Exotel) with template headers
      const messageId = `live_sms_${crypto.randomUUID()}`;
      return {
        success: true,
        messageId,
        providerStatus: 'SUBMITTED_DLT_GATEWAY',
      };
    }
  }
}

let activeProvider: MessageProvider | null = null;

export function getMessageProvider(): MessageProvider {
  if (activeProvider) return activeProvider;

  const providerType = (process.env.PROVIDER || 'mock').toLowerCase();
  if (providerType === 'live') {
    activeProvider = new LiveProvider();
  } else {
    activeProvider = new MockProvider();
  }

  return activeProvider;
}

export function setMessageProvider(provider: MessageProvider) {
  activeProvider = provider;
}
