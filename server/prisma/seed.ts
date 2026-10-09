import { PrismaClient, Role, AppointmentSource, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Plans
  const freePlan = await prisma.plan.upsert({
    where: { code: 'FREE_TRIAL' },
    update: {},
    create: {
      name: 'Free Trial',
      code: 'FREE_TRIAL',
      priceMonthly: 0,
      priceYearly: 0,
      maxDoctors: 2,
      maxAppointmentsPerMonth: 50,
      maxAiCallsPerMonth: 100,
      features: { aiReceptionist: true, voiceAi: false },
    },
  });

  const basicPlan = await prisma.plan.upsert({
    where: { code: 'BASIC' },
    update: {},
    create: {
      name: 'Basic',
      code: 'BASIC',
      priceMonthly: 49,
      priceYearly: 490,
      maxDoctors: 5,
      maxAppointmentsPerMonth: 300,
      maxAiCallsPerMonth: 1000,
      features: { aiReceptionist: true, voiceAi: true },
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { code: 'PRO' },
    update: {},
    create: {
      name: 'Pro',
      code: 'PRO',
      priceMonthly: 99,
      priceYearly: 990,
      maxDoctors: 15,
      maxAppointmentsPerMonth: 2000,
      maxAiCallsPerMonth: 5000,
      features: { aiReceptionist: true, voiceAi: true, analytics: true },
    },
  });

  console.log('✅ Plans seeded:', [freePlan.code, basicPlan.code, proPlan.code]);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Sample Clinic 1: SmileCare Downtown
  const clinic1 = await prisma.clinic.upsert({
    where: { slug: 'smilecare-downtown' },
    update: {},
    create: {
      name: 'SmileCare Downtown Dental',
      slug: 'smilecare-downtown',
      email: 'downtown@smilecare.ai',
      phone: '+1-555-0199',
      address: '123 Main Street, Suite 400, New York, NY',
      timezone: 'America/New_York',
    },
  });

  // Admin user for Clinic 1
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@smilecaredowntown.com' },
    update: {},
    create: {
      clinicId: clinic1.id,
      email: 'admin@smilecaredowntown.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: Role.CLINIC_ADMIN,
    },
  });

  // Subscription for Clinic 1
  await prisma.subscription.upsert({
    where: { clinicId: clinic1.id },
    update: {},
    create: {
      clinicId: clinic1.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      billingPeriod: 'MONTHLY',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Doctor 1 for Clinic 1
  const doctor1 = await prisma.doctor.create({
    data: {
      clinicId: clinic1.id,
      name: 'Dr. Michael Vance',
      specialty: 'Orthodontics & General Dentistry',
      email: 'dr.vance@smilecaredowntown.com',
      phone: '+1-555-0101',
      workingHours: {
        create: [1, 2, 3, 4, 5].map((day) => ({
          clinicId: clinic1.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
        })),
      },
    },
  });

  // Patient 1 for Clinic 1
  const patient1 = await prisma.patient.create({
    data: {
      clinicId: clinic1.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '+1-555-0202',
    },
  });

  // Service 1
  const service1 = await prisma.service.create({
    data: {
      clinicId: clinic1.id,
      name: 'Routine Teeth Cleaning & Exam',
      durationMins: 45,
      price: 120.00,
    },
  });

  // Appointment for Clinic 1
  await prisma.appointment.create({
    data: {
      clinicId: clinic1.id,
      doctorId: doctor1.id,
      patientId: patient1.id,
      serviceId: service1.id,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + (24 * 60 + 45) * 60 * 1000),
      status: AppointmentStatus.SCHEDULED,
      source: AppointmentSource.AI,
      notes: 'Booked via 24/7 AI Receptionist Chatbot',
    },
  });

  console.log('✅ Clinic 1 seeded:', clinic1.name);

  // 3. Sample Clinic 2: Apex Dental Care
  const clinic2 = await prisma.clinic.upsert({
    where: { slug: 'apex-dental-care' },
    update: {},
    create: {
      name: 'Apex Dental Care',
      slug: 'apex-dental-care',
      email: 'contact@apexdental.com',
      phone: '+1-555-0399',
      address: '456 Grand Ave, Los Angeles, CA',
      timezone: 'America/Los_Angeles',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@apexdental.com' },
    update: {},
    create: {
      clinicId: clinic2.id,
      email: 'admin@apexdental.com',
      passwordHash,
      firstName: 'Robert',
      lastName: 'Smith',
      role: Role.CLINIC_ADMIN,
    },
  });

  await prisma.subscription.upsert({
    where: { clinicId: clinic2.id },
    update: {},
    create: {
      clinicId: clinic2.id,
      planId: basicPlan.id,
      status: 'ACTIVE',
      billingPeriod: 'MONTHLY',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      clinicId: clinic2.id,
      name: 'Dr. Emily Watson',
      specialty: 'Pediatric & Cosmetic Dentistry',
      email: 'dr.watson@apexdental.com',
      phone: '+1-555-0301',
      workingHours: {
        create: [1, 2, 3, 4, 5].map((day) => ({
          clinicId: clinic2.id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '18:00',
        })),
      },
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      clinicId: clinic2.id,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      phone: '+1-555-0303',
    },
  });

  await prisma.appointment.create({
    data: {
      clinicId: clinic2.id,
      doctorId: doctor2.id,
      patientId: patient2.id,
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + (48 * 60 + 30) * 60 * 1000),
      status: AppointmentStatus.SCHEDULED,
      source: AppointmentSource.PHONE,
      notes: 'Voice AI phone call booking',
    },
  });

  console.log('✅ Clinic 2 seeded:', clinic2.name);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
