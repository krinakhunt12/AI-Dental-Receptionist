-- CreateEnum
CREATE TYPE "CareProtocolStatus" AS ENUM ('DRAFT', 'APPROVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CarePhase" AS ENUM ('PRE_OP', 'POST_OP');

-- CreateEnum
CREATE TYPE "CareCategory" AS ENUM ('HYDRATION', 'DIET', 'MEDICATION', 'ACTIVITY', 'HYGIENE', 'FASTING', 'OTHER');

-- CreateEnum
CREATE TYPE "EscalationAction" AS ENUM ('CALL_CLINIC', 'EMERGENCY', 'NOTIFY_STAFF');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CLINIC_OWNER';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "treatmentId" TEXT;

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMins" INTEGER NOT NULL DEFAULT 30,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareProtocol" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "treatmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CareProtocolStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareInstruction" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "phase" "CarePhase" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "offsetMinutes" INTEGER NOT NULL,
    "category" "CareCategory" NOT NULL,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalationRule" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "protocolId" TEXT,
    "symptomKey" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "action" "EscalationAction" NOT NULL,
    "message" TEXT NOT NULL,
    "daysAfterMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscalationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Treatment_clinicId_idx" ON "Treatment"("clinicId");

-- CreateIndex
CREATE INDEX "CareProtocol_clinicId_idx" ON "CareProtocol"("clinicId");

-- CreateIndex
CREATE INDEX "CareProtocol_treatmentId_idx" ON "CareProtocol"("treatmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CareProtocol_clinicId_treatmentId_version_key" ON "CareProtocol"("clinicId", "treatmentId", "version");

-- CreateIndex
CREATE INDEX "CareInstruction_clinicId_idx" ON "CareInstruction"("clinicId");

-- CreateIndex
CREATE INDEX "CareInstruction_clinicId_protocolId_idx" ON "CareInstruction"("clinicId", "protocolId");

-- CreateIndex
CREATE INDEX "EscalationRule_clinicId_idx" ON "EscalationRule"("clinicId");

-- CreateIndex
CREATE INDEX "EscalationRule_protocolId_idx" ON "EscalationRule"("protocolId");

-- CreateIndex
CREATE INDEX "Appointment_treatmentId_idx" ON "Appointment"("treatmentId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareProtocol" ADD CONSTRAINT "CareProtocol_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareProtocol" ADD CONSTRAINT "CareProtocol_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareProtocol" ADD CONSTRAINT "CareProtocol_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareInstruction" ADD CONSTRAINT "CareInstruction_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareInstruction" ADD CONSTRAINT "CareInstruction_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "CareProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationRule" ADD CONSTRAINT "EscalationRule_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationRule" ADD CONSTRAINT "EscalationRule_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "CareProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
