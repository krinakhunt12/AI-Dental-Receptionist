import {
  ConsentStatus,
  NotificationChannel,
  ReminderJobStatus,
} from '@prisma/client';
import { prisma } from '../prisma.js';
import { CareProtocolService } from './careProtocol.service.js';
import { adjustForQuietHours } from '../utils/quietHours.js';

export class ReminderPlannerService {
  /**
   * Builds and schedules ReminderJobs for an appointment from its APPROVED care plan.
   * Enforces idempotency via unique [appointmentId, instructionId, channel].
   * Applies quiet hours and checks consent.
   */
  static async scheduleAppointmentReminders(clinicId: string, appointmentId: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId, deletedAt: null },
      include: {
        clinic: { select: { id: true, name: true, timezone: true } },
        patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
    });

    if (!appointment) {
      console.warn(`[reminderPlanner] Appointment ${appointmentId} not found for clinic ${clinicId}`);
      return [];
    }

    const clinicTimezone = appointment.clinic?.timezone || 'Asia/Kolkata';

    // Retrieve approved care plan instructions
    const carePlan = await CareProtocolService.getCarePlanForAppointment(clinicId, appointmentId);
    if (!carePlan || !carePlan.protocolId || carePlan.instructions.length === 0) {
      console.log(
        `[reminderPlanner] No approved protocol instructions found for appointment ${appointmentId}`
      );
      return [];
    }

    const startMs = new Date(appointment.startTime).getTime();
    const endMs = new Date(appointment.endTime).getTime();
    const nowMs = Date.now();

    const channels: NotificationChannel[] = [
      NotificationChannel.WHATSAPP,
      NotificationChannel.SMS,
    ];

    // Preload patient consents for the clinic
    const consents = await prisma.notificationConsent.findMany({
      where: { clinicId, patientId: appointment.patientId },
    });
    const consentMap = new Map<NotificationChannel, ConsentStatus>();
    for (const c of consents) {
      consentMap.set(c.channel, c.status);
    }

    const createdJobs = [];

    for (const inst of carePlan.instructions) {
      // Offset calculation:
      // Negative offset: relative to appointment startTime
      // Positive/zero offset: relative to appointment endTime
      let rawTargetMs: number;
      if (inst.offsetMinutes < 0) {
        rawTargetMs = startMs + inst.offsetMinutes * 60 * 1000;
      } else {
        rawTargetMs = endMs + inst.offsetMinutes * 60 * 1000;
      }

      const rawDate = new Date(rawTargetMs);

      // Adjust for quiet hours (21:00 - 08:00 clinic local time)
      const sendAt = adjustForQuietHours({
        utcDate: rawDate,
        timezone: clinicTimezone,
        isCritical: inst.isCritical,
        category: inst.category,
      });

      for (const channel of channels) {
        const consentStatus = consentMap.get(channel);
        const hasOptedIn = consentStatus === ConsentStatus.OPTED_IN;

        let status: ReminderJobStatus = ReminderJobStatus.PENDING;
        let skipReason: string | null = null;

        if (!hasOptedIn) {
          status = ReminderJobStatus.SKIPPED;
          skipReason = `Patient has no OPTED_IN consent for ${channel}`;
        } else if (sendAt.getTime() <= nowMs) {
          status = ReminderJobStatus.SKIPPED;
          skipReason = 'Send time is in the past';
        }

        const job = await prisma.reminderJob.upsert({
          where: {
            appointmentId_instructionId_channel: {
              appointmentId: appointment.id,
              instructionId: inst.id,
              channel,
            },
          },
          update: {
            sendAt,
            status,
            skipReason,
          },
          create: {
            clinicId,
            appointmentId: appointment.id,
            instructionId: inst.id,
            patientId: appointment.patientId,
            channel,
            sendAt,
            status,
            skipReason,
          },
        });

        createdJobs.push(job);
      }
    }

    return createdJobs;
  }

  /**
   * On reschedule: Recomputes sendAt for PENDING jobs based on new appointment start/end.
   */
  static async rescheduleAppointmentReminders(clinicId: string, appointmentId: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId, deletedAt: null },
      include: {
        clinic: { select: { id: true, timezone: true } },
      },
    });

    if (!appointment) return;

    const clinicTimezone = appointment.clinic?.timezone || 'Asia/Kolkata';
    const startMs = new Date(appointment.startTime).getTime();
    const endMs = new Date(appointment.endTime).getTime();
    const nowMs = Date.now();

    const pendingJobs = await prisma.reminderJob.findMany({
      where: {
        clinicId,
        appointmentId,
        status: ReminderJobStatus.PENDING,
      },
      include: {
        instruction: true,
      },
    });

    for (const job of pendingJobs) {
      const inst = job.instruction;
      let rawTargetMs: number;
      if (inst.offsetMinutes < 0) {
        rawTargetMs = startMs + inst.offsetMinutes * 60 * 1000;
      } else {
        rawTargetMs = endMs + inst.offsetMinutes * 60 * 1000;
      }

      const sendAt = adjustForQuietHours({
        utcDate: new Date(rawTargetMs),
        timezone: clinicTimezone,
        isCritical: inst.isCritical,
        category: inst.category,
      });

      if (sendAt.getTime() <= nowMs) {
        await prisma.reminderJob.update({
          where: { id: job.id },
          data: {
            sendAt,
            status: ReminderJobStatus.SKIPPED,
            skipReason: 'Send time is in the past after reschedule',
          },
        });
      } else {
        await prisma.reminderJob.update({
          where: { id: job.id },
          data: {
            sendAt,
          },
        });
      }
    }
  }

  /**
   * On cancel: Marks PENDING jobs CANCELLED.
   */
  static async cancelAppointmentReminders(clinicId: string, appointmentId: string) {
    return prisma.reminderJob.updateMany({
      where: {
        clinicId,
        appointmentId,
        status: ReminderJobStatus.PENDING,
      },
      data: {
        status: ReminderJobStatus.CANCELLED,
        skipReason: 'Appointment cancelled',
      },
    });
  }
}
export const reminderPlanner = ReminderPlannerService;
