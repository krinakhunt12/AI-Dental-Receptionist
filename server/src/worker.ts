import {
  ConsentStatus,
  CarePhase,
  NotificationChannel,
  ReminderJobStatus,
} from '@prisma/client';
import { prisma } from './prisma.js';
import { getMessageProvider } from './services/messaging/messageProvider.js';

let isRunning = true;
const POLL_INTERVAL_MS = 30 * 1000; // 30 seconds

/**
 * On worker startup:
 * Reset any jobs stuck in PROCESSING for more than 5 minutes back to PENDING.
 */
async function resetStalledJobs(): Promise<void> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await prisma.reminderJob.updateMany({
      where: {
        status: ReminderJobStatus.PROCESSING,
        updatedAt: { lte: fiveMinutesAgo },
      },
      data: {
        status: ReminderJobStatus.PENDING,
      },
    });

    if (result.count > 0) {
      console.log(`[Worker] Reset ${result.count} stalled PROCESSING job(s) back to PENDING.`);
    }
  } catch (error) {
    console.error('[Worker] Error resetting stalled jobs on startup:', error);
  }
}

/**
 * Safely claims up to `limit` pending jobs using SELECT ... FOR UPDATE SKIP LOCKED
 * so concurrent workers never process the same job.
 */
async function claimPendingJobs(limit = 10): Promise<string[]> {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<{ id: string }[]>`
      SELECT id FROM "ReminderJob"
      WHERE status = 'PENDING'::"ReminderJobStatus" AND "sendAt" <= NOW()
      ORDER BY "sendAt" ASC
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED;
    `;

    if (!rows || rows.length === 0) {
      return [];
    }

    const ids = rows.map((r) => r.id);

    await tx.reminderJob.updateMany({
      where: { id: { in: ids } },
      data: {
        status: ReminderJobStatus.PROCESSING,
        updatedAt: new Date(),
      },
    });

    return ids;
  });
}

/**
 * Processes a single claimed reminder job.
 * Checks consent at send time, formats template, dispatches via provider,
 * and handles retries with exponential backoff (max 3 attempts).
 */
async function processJob(jobId: string): Promise<void> {
  const job = await prisma.reminderJob.findUnique({
    where: { id: jobId },
    include: {
      clinic: true,
      patient: true,
      instruction: true,
    },
  });

  if (!job) return;

  // SAFETY RULE: Consent is checked at send time too, not only at scheduling time
  const consent = await prisma.notificationConsent.findUnique({
    where: {
      clinicId_patientId_channel: {
        clinicId: job.clinicId,
        patientId: job.patientId,
        channel: job.channel,
      },
    },
  });

  if (!consent || consent.status !== ConsentStatus.OPTED_IN) {
    console.log(
      `[Worker] Skipping job ${job.id}: patient ${job.patientId} has no OPTED_IN consent for ${job.channel} at send time.`
    );
    await prisma.reminderJob.update({
      where: { id: job.id },
      data: {
        status: ReminderJobStatus.SKIPPED,
        skipReason: `Patient has no OPTED_IN consent for ${job.channel} at send time`,
        updatedAt: new Date(),
      },
    });
    return;
  }

  // Determine named template
  let templateKey = 'GENERAL_CARE_REMINDER';
  if (job.instruction.phase === CarePhase.PRE_OP) {
    templateKey = 'PRE_OP_REMINDER';
  } else if (job.instruction.phase === CarePhase.POST_OP) {
    templateKey = 'POST_OP_REMINDER';
  }

  const provider = getMessageProvider();

  try {
    const result = await provider.send({
      to: job.patient.phone,
      templateKey,
      variables: {
        patientName: `${job.patient.firstName} ${job.patient.lastName}`.trim(),
        clinicName: job.clinic.name,
        instructionTitle: job.instruction.title,
        instructionBody: job.instruction.body,
      },
      channel: job.channel,
    });

    if (result.success) {
      await prisma.reminderJob.update({
        where: { id: job.id },
        data: {
          status: ReminderJobStatus.SENT,
          sentAt: new Date(),
          providerMessageId: result.messageId,
          lastError: null,
          updatedAt: new Date(),
        },
      });
      console.log(`[Worker] Successfully sent job ${job.id} via ${job.channel}`);
    } else {
      throw new Error(result.error || 'Provider dispatch failed');
    }
  } catch (err: any) {
    const currentAttempt = job.attempts + 1;
    const errorMessage = err?.message || String(err);

    console.error(
      `[Worker] Error sending job ${job.id} (Attempt ${currentAttempt}/3): ${errorMessage}`
    );

    if (currentAttempt >= 3) {
      // Mark as FAILED after 3 attempts
      await prisma.reminderJob.update({
        where: { id: job.id },
        data: {
          status: ReminderJobStatus.FAILED,
          attempts: currentAttempt,
          lastError: errorMessage,
          updatedAt: new Date(),
        },
      });
      console.error(`[Worker] Job ${job.id} marked FAILED after ${currentAttempt} attempts.`);
    } else {
      // Exponential backoff: retry in 1m (attempt 1), 2m (attempt 2), 4m (attempt 3)
      const backoffMinutes = Math.pow(2, currentAttempt - 1);
      const nextSendAt = new Date(Date.now() + backoffMinutes * 60 * 1000);

      await prisma.reminderJob.update({
        where: { id: job.id },
        data: {
          status: ReminderJobStatus.PENDING,
          attempts: currentAttempt,
          sendAt: nextSendAt,
          lastError: errorMessage,
          updatedAt: new Date(),
        },
      });
      console.log(
        `[Worker] Job ${job.id} scheduled for retry at ${nextSendAt.toISOString()} (attempt ${currentAttempt})`
      );
    }
  }
}

/**
 * Worker poll tick. Claims and processes eligible jobs.
 */
export async function pollReminderJobs(): Promise<number> {
  try {
    const claimedJobIds = await claimPendingJobs(10);
    if (claimedJobIds.length === 0) return 0;

    console.log(`[Worker] Claimed ${claimedJobIds.length} pending reminder job(s). Processing...`);

    for (const jobId of claimedJobIds) {
      await processJob(jobId);
    }

    return claimedJobIds.length;
  } catch (error) {
    console.error('[Worker] Error during polling cycle:', error);
    return 0;
  }
}

/**
 * Main worker loop.
 */
async function startWorker() {
  console.log('🚀 SmileCare AI Reminder Worker starting up...');
  console.log(`[Worker] Provider mode: ${process.env.PROVIDER || 'mock'}`);

  // 1. Reset jobs stuck in PROCESSING > 5 minutes
  await resetStalledJobs();

  // 2. Initial run
  await pollReminderJobs();

  // 3. Polling timer every 30 seconds
  const intervalId = setInterval(async () => {
    if (!isRunning) return;
    await pollReminderJobs();
  }, POLL_INTERVAL_MS);

  // Graceful shutdown
  const handleShutdown = async (signal: string) => {
    console.log(`\n[Worker] Received ${signal}. Shutting down worker gracefully...`);
    isRunning = false;
    clearInterval(intervalId);
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

// Auto-run if executed directly as entrypoint
if (process.argv[1]?.endsWith('worker.ts') || process.argv[1]?.endsWith('worker.js')) {
  startWorker().catch((err) => {
    console.error('[Worker] Fatal error starting worker:', err);
    process.exit(1);
  });
}
