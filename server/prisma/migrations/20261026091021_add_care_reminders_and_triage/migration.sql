-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('OPTED_IN', 'OPTED_OUT');

-- CreateEnum
CREATE TYPE "ReminderJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED', 'SKIPPED');

-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "storeRawTriageMessages" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "NotificationConsent" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'OPTED_IN',
    "source" TEXT DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderJob" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "instructionId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "status" "ReminderJobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "skipReason" TEXT,
    "providerMessageId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReminderJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriageLog" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "patientId" TEXT,
    "symptomKeys" JSONB NOT NULL,
    "urgency" TEXT NOT NULL,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "messageText" TEXT,
    "responseText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffNotification" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT,
    "appointmentId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'HIGH',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationConsent_clinicId_idx" ON "NotificationConsent"("clinicId");

-- CreateIndex
CREATE INDEX "NotificationConsent_patientId_idx" ON "NotificationConsent"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationConsent_clinicId_patientId_channel_key" ON "NotificationConsent"("clinicId", "patientId", "channel");

-- CreateIndex
CREATE INDEX "ReminderJob_status_sendAt_idx" ON "ReminderJob"("status", "sendAt");

-- CreateIndex
CREATE INDEX "ReminderJob_clinicId_idx" ON "ReminderJob"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderJob_appointmentId_instructionId_channel_key" ON "ReminderJob"("appointmentId", "instructionId", "channel");

-- CreateIndex
CREATE INDEX "TriageLog_clinicId_idx" ON "TriageLog"("clinicId");

-- CreateIndex
CREATE INDEX "TriageLog_appointmentId_idx" ON "TriageLog"("appointmentId");

-- CreateIndex
CREATE INDEX "StaffNotification_clinicId_idx" ON "StaffNotification"("clinicId");

-- CreateIndex
CREATE INDEX "StaffNotification_clinicId_isRead_idx" ON "StaffNotification"("clinicId", "isRead");

-- AddForeignKey
ALTER TABLE "NotificationConsent" ADD CONSTRAINT "NotificationConsent_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationConsent" ADD CONSTRAINT "NotificationConsent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJob" ADD CONSTRAINT "ReminderJob_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJob" ADD CONSTRAINT "ReminderJob_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJob" ADD CONSTRAINT "ReminderJob_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "CareInstruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJob" ADD CONSTRAINT "ReminderJob_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageLog" ADD CONSTRAINT "TriageLog_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageLog" ADD CONSTRAINT "TriageLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageLog" ADD CONSTRAINT "TriageLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffNotification" ADD CONSTRAINT "StaffNotification_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffNotification" ADD CONSTRAINT "StaffNotification_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffNotification" ADD CONSTRAINT "StaffNotification_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
