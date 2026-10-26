import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ConsentStatus, NotificationChannel, ReminderJobStatus } from '@prisma/client';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import { maskPhone } from '../services/messaging/messageProvider.js';

export class WebhookController {
  /**
   * POST /webhooks/messages/inbound
   * Handles incoming WhatsApp/SMS messages, opt-out STOP keywords, and delivery receipts.
   */
  static async handleInboundMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // In live mode, verify webhook signatures
      if (process.env.PROVIDER === 'live') {
        const webhookSecret = process.env.WEBHOOK_SECRET;
        const incomingSignature =
          req.headers['x-signature'] ||
          req.headers['x-webhook-signature'] ||
          req.headers['x-hub-signature-256'];

        if (webhookSecret && incomingSignature) {
          const bodyString = JSON.stringify(req.body);
          const computedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(bodyString)
            .digest('hex');

          const expected = String(incomingSignature).replace(/^sha256=/, '');
          if (computedSignature !== expected) {
            console.warn('[Webhook] Invalid webhook signature detected');
            throw ApiError.unauthorized('Invalid webhook signature');
          }
        }
      }

      // Extract phone, body, and channel from various provider payloads (Meta Cloud API, Twilio, Gupshup, generic)
      const rawBody = req.body || {};
      const messageText =
        rawBody.message ||
        rawBody.text ||
        rawBody.Body ||
        rawBody.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
        '';

      const rawFrom =
        rawBody.from ||
        rawBody.sender ||
        rawBody.phone ||
        rawBody.From ||
        rawBody.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
        '';

      const channelString = String(rawBody.channel || '').toUpperCase();
      const channel: NotificationChannel =
        channelString === 'SMS' ? NotificationChannel.SMS : NotificationChannel.WHATSAPP;

      const cleanText = String(messageText).trim().toLowerCase();
      const maskedPhone = maskPhone(String(rawFrom));

      console.log(`[Webhook] Inbound ${channel} message from ${maskedPhone}: "${cleanText}"`);

      // Check for opt-out keywords: STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT, OPTOUT
      const optOutRegex = /^(stop|stopall|unsubscribe|cancel|end|quit|optout|opt-out)$/i;
      const isOptOut = optOutRegex.test(cleanText);

      if (isOptOut) {
        // Find matching patient(s) by phone
        // Clean digits
        const phoneDigits = String(rawFrom).replace(/\D/g, '');
        const last10Digits = phoneDigits.slice(-10);

        const patients = await prisma.patient.findMany({
          where: {
            phone: {
              contains: last10Digits,
            },
          },
        });

        console.log(`[Webhook] Found ${patients.length} patient(s) matching phone for opt-out.`);

        for (const patient of patients) {
          // 1. Set NotificationConsent to OPTED_OUT
          await prisma.notificationConsent.upsert({
            where: {
              clinicId_patientId_channel: {
                clinicId: patient.clinicId,
                patientId: patient.id,
                channel,
              },
            },
            update: {
              status: ConsentStatus.OPTED_OUT,
              source: 'INBOUND_STOP_WEBHOOK',
              updatedAt: new Date(),
            },
            create: {
              clinicId: patient.clinicId,
              patientId: patient.id,
              channel,
              status: ConsentStatus.OPTED_OUT,
              source: 'INBOUND_STOP_WEBHOOK',
            },
          });

          // If STOPALL, also opt out of SMS
          if (cleanText === 'stopall') {
            await prisma.notificationConsent.upsert({
              where: {
                clinicId_patientId_channel: {
                  clinicId: patient.clinicId,
                  patientId: patient.id,
                  channel: NotificationChannel.SMS,
                },
              },
              update: {
                status: ConsentStatus.OPTED_OUT,
                source: 'INBOUND_STOPALL_WEBHOOK',
                updatedAt: new Date(),
              },
              create: {
                clinicId: patient.clinicId,
                patientId: patient.id,
                channel: NotificationChannel.SMS,
                status: ConsentStatus.OPTED_OUT,
                source: 'INBOUND_STOPALL_WEBHOOK',
              },
            });
          }

          // 2. Cancel all PENDING reminder jobs for that patient
          const cancelledResult = await prisma.reminderJob.updateMany({
            where: {
              clinicId: patient.clinicId,
              patientId: patient.id,
              channel: cleanText === 'stopall' ? undefined : channel,
              status: ReminderJobStatus.PENDING,
            },
            data: {
              status: ReminderJobStatus.CANCELLED,
              skipReason: 'Patient opted out via inbound STOP message',
              updatedAt: new Date(),
            },
          });

          console.log(
            `[Webhook] Cancelled ${cancelledResult.count} pending reminder job(s) for patient ${patient.id}.`
          );
        }

        return res.status(200).json({
          success: true,
          action: 'OPTED_OUT',
          message: 'Consent set to OPTED_OUT and pending reminder jobs cancelled.',
          matchedPatients: patients.length,
        });
      }

      // Non-opt-out inbound message received
      return res.status(200).json({
        success: true,
        action: 'RECEIVED',
        message: 'Inbound message processed.',
      });
    } catch (error) {
      next(error);
    }
  }
}
