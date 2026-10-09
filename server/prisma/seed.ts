import { PrismaClient, Role, AppointmentSource, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Password for all seed users: Password123!
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 0. Seed Plans
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

  // 1. Seed SUPER_ADMIN
  let superAdmin = await prisma.user.findFirst({
    where: { email: 'superadmin@smilecare.com', clinicId: null },
  });
  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        clinicId: null,
        email: 'superadmin@smilecare.com',
        passwordHash,
        firstName: 'System',
        lastName: 'SuperAdmin',
        role: Role.SUPER_ADMIN,
      },
    });
  } else {
    superAdmin = await prisma.user.update({
      where: { id: superAdmin.id },
      data: { passwordHash },
    });
  }
  console.log('✅ Super Admin seeded:', superAdmin.email);

  // Helper function to seed user for a clinic
  const seedClinicUser = async (clinicId: string, email: string, firstName: string, lastName: string, role: Role) => {
    let user = await prisma.user.findFirst({
      where: { clinicId, email },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          clinicId,
          email,
          passwordHash,
          firstName,
          lastName,
          role,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, role },
      });
    }
    return user;
  };

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

  // Users for Clinic 1
  const user1Admin = await seedClinicUser(clinic1.id, 'admin@smilecaredowntown.com', 'Sarah', 'Jenkins', Role.CLINIC_ADMIN);
  const user1Doctor = await seedClinicUser(clinic1.id, 'doctor@smilecaredowntown.com', 'Michael', 'Vance', Role.DOCTOR);
  const user1Staff = await seedClinicUser(clinic1.id, 'staff@smilecaredowntown.com', 'Emily', 'Davis', Role.STAFF);

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

  // Doctor profile for Clinic 1
  const existingDoc1 = await prisma.doctor.findFirst({ where: { clinicId: clinic1.id, name: 'Dr. Michael Vance' } });
  if (!existingDoc1) {
    await prisma.doctor.create({
      data: {
        clinicId: clinic1.id,
        userId: user1Doctor.id,
        name: 'Dr. Michael Vance',
        specialty: 'Orthodontics & General Dentistry',
        email: 'doctor@smilecaredowntown.com',
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
  }

  console.log('✅ Clinic 1 seeded:', clinic1.name, '(Admin, Doctor, Staff)');

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

  // Users for Clinic 2
  const user2Admin = await seedClinicUser(clinic2.id, 'admin@apexdental.com', 'Robert', 'Smith', Role.CLINIC_ADMIN);
  const user2Doctor = await seedClinicUser(clinic2.id, 'doctor@apexdental.com', 'Emily', 'Watson', Role.DOCTOR);
  const user2Staff = await seedClinicUser(clinic2.id, 'staff@apexdental.com', 'James', 'Wilson', Role.STAFF);

  // Subscription for Clinic 2
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

  // Doctor profile for Clinic 2
  const existingDoc2 = await prisma.doctor.findFirst({ where: { clinicId: clinic2.id, name: 'Dr. Emily Watson' } });
  if (!existingDoc2) {
    await prisma.doctor.create({
      data: {
        clinicId: clinic2.id,
        userId: user2Doctor.id,
        name: 'Dr. Emily Watson',
        specialty: 'Pediatric & Cosmetic Dentistry',
        email: 'doctor@apexdental.com',
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
  }

  console.log('✅ Clinic 2 seeded:', clinic2.name, '(Admin, Doctor, Staff)');
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
