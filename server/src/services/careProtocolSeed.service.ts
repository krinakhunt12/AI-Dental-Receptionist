import { PrismaClient, CareProtocolStatus, CarePhase, CareCategory, EscalationAction } from '@prisma/client';
import { prisma as defaultPrisma } from '../prisma.js';

export async function seedClinic(clinicId: string, client: any = defaultPrisma) {
  console.log(`🌱 Seeding default treatments, care protocols & escalation rules for clinic: ${clinicId}`);

  // 1. Seed or find Default Treatments for the clinic
  const defaultTreatmentsData = [
    {
      name: 'Tooth extraction / oral surgery',
      description: 'Surgical and simple tooth extractions and oral procedures',
      durationMins: 45,
      price: 250,
    },
    {
      name: 'Teeth whitening',
      description: 'In-office professional dental whitening treatment',
      durationMins: 60,
      price: 300,
    },
    {
      name: 'Periodontal therapy (deep scaling / root planing)',
      description: 'Deep therapeutic scaling beneath the gumline to treat active periodontal pockets',
      durationMins: 60,
      price: 350,
    },
    {
      name: 'IV sedation / general anesthesia',
      description: 'Monitored anesthesia and intravenous sedation for complex surgical and restorative cases',
      durationMins: 90,
      price: 500,
    },
    {
      name: 'Routine Checkup & Teeth Cleaning',
      description: 'Preventative cleaning and comprehensive dental examination',
      durationMins: 45,
      price: 120,
    },
    {
      name: 'Root Canal Treatment',
      description: 'Therapeutic endodontic root canal therapy',
      durationMins: 75,
      price: 750,
    },
  ];

  const treatmentsMap = new Map<string, any>();

  for (const tData of defaultTreatmentsData) {
    let treatment = await client.treatment.findFirst({
      where: { clinicId, name: tData.name, deletedAt: null },
    });

    if (!treatment) {
      treatment = await client.treatment.create({
        data: {
          clinicId,
          name: tData.name,
          description: tData.description,
          durationMins: tData.durationMins,
          price: tData.price,
        },
      });
    }

    treatmentsMap.set(tData.name, treatment);
  }

  // 2. Create DRAFT protocols (never auto-approved) for the clinic's default treatments
  // Unique on [clinicId, treatmentId, version]

  // A) Tooth extraction / oral surgery
  const extractionTreatment = treatmentsMap.get('Tooth extraction / oral surgery');
  if (extractionTreatment) {
    const extractionProtocol = await client.careProtocol.upsert({
      where: {
        clinicId_treatmentId_version: {
          clinicId,
          treatmentId: extractionTreatment.id,
          version: 1,
        },
      },
      update: {
        name: 'Tooth Extraction & Oral Surgery Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
      },
      create: {
        clinicId,
        treatmentId: extractionTreatment.id,
        name: 'Tooth Extraction & Oral Surgery Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
        version: 1,
        approvedByUserId: null,
        approvedAt: null,
      },
    });

    // Instructions:
    // 1. Drink plenty of fluids
    const instHydration = await client.careInstruction.findFirst({
      where: {
        clinicId,
        protocolId: extractionProtocol.id,
        category: CareCategory.HYDRATION,
        phase: CarePhase.POST_OP,
      },
    });
    if (!instHydration) {
      await client.careInstruction.create({
        data: {
          clinicId,
          protocolId: extractionProtocol.id,
          phase: CarePhase.POST_OP,
          title: 'Post-Extraction Fluid Intake',
          body: 'Drink plenty of water and clear fluids throughout the day to stay hydrated. Avoid hot liquids while numb. (Draft instruction pending dentist approval.)',
          offsetMinutes: 60, // 1 hour post-op
          category: CareCategory.HYDRATION,
          isCritical: false,
          sortOrder: 0,
        },
      });
    }

    // 2. Do NOT use a straw for at least 48 hours (dry socket risk). Mark isCritical.
    const instStraw = await client.careInstruction.findFirst({
      where: {
        clinicId,
        protocolId: extractionProtocol.id,
        title: { contains: 'Straw' },
      },
    });
    if (!instStraw) {
      await client.careInstruction.create({
        data: {
          clinicId,
          protocolId: extractionProtocol.id,
          phase: CarePhase.POST_OP,
          title: 'Do NOT Use a Straw for at Least 48 Hours',
          body: 'Do NOT drink through a straw for at least 48 hours following your extraction. The suction pressure created in the mouth can dislodge the blood clot and cause dry socket, which is extremely painful and delays healing. Sip directly from a cup instead. (Draft instruction pending dentist approval.)',
          offsetMinutes: 0, // Immediately post-op
          category: CareCategory.ACTIVITY,
          isCritical: true,
          sortOrder: 1,
        },
      });
    }
  }

  // B) Teeth whitening
  const whiteningTreatment = treatmentsMap.get('Teeth whitening');
  if (whiteningTreatment) {
    const whiteningProtocol = await client.careProtocol.upsert({
      where: {
        clinicId_treatmentId_version: {
          clinicId,
          treatmentId: whiteningTreatment.id,
          version: 1,
        },
      },
      update: {
        name: 'Teeth Whitening Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
      },
      create: {
        clinicId,
        treatmentId: whiteningTreatment.id,
        name: 'Teeth Whitening Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
        version: 1,
        approvedByUserId: null,
        approvedAt: null,
      },
    });

    // Instructions:
    // 1. Water-focused intake
    const instWater = await client.careInstruction.findFirst({
      where: {
        clinicId,
        protocolId: whiteningProtocol.id,
        category: CareCategory.HYDRATION,
      },
    });
    if (!instWater) {
      await client.careInstruction.create({
        data: {
          clinicId,
          protocolId: whiteningProtocol.id,
          phase: CarePhase.POST_OP,
          title: 'Water-Focused Fluid Intake',
          body: 'Maintain water-focused fluid intake for 48 hours after your whitening procedure. Drinking pure water keeps teeth hydrated and helps avoid tooth sensitivity. (Draft instruction pending dentist approval.)',
          offsetMinutes: 0,
          category: CareCategory.HYDRATION,
          isCritical: false,
          sortOrder: 0,
        },
      });
    }

    // 2. White diet (avoid coffee, tea, red wine, colas) for 48 hours
    const instWhiteDiet = await client.careInstruction.findFirst({
      where: {
        clinicId,
        protocolId: whiteningProtocol.id,
        category: CareCategory.DIET,
      },
    });
    if (!instWhiteDiet) {
      await client.careInstruction.create({
        data: {
          clinicId,
          protocolId: whiteningProtocol.id,
          phase: CarePhase.POST_OP,
          title: 'Follow 48-Hour White Diet',
          body: 'Avoid coffee, tea, red wine, colas, dark sauces, and staining foods for at least 48 hours. Stick to a "white diet" (such as water, milk, poultry, white fish, rice, and clear pasta) while tooth enamel pores close. (Draft instruction pending dentist approval.)',
          offsetMinutes: 0,
          category: CareCategory.DIET,
          isCritical: false,
          sortOrder: 1,
        },
      });
    }
  }

  // C) Periodontal therapy (deep scaling / root planing)
  const perioTreatment = treatmentsMap.get('Periodontal therapy (deep scaling / root planing)');
  if (perioTreatment) {
    const perioProtocol = await client.careProtocol.upsert({
      where: {
        clinicId_treatmentId_version: {
          clinicId,
          treatmentId: perioTreatment.id,
          version: 1,
        },
      },
      update: {
        name: 'Periodontal Therapy Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
      },
      create: {
        clinicId,
        treatmentId: perioTreatment.id,
        name: 'Periodontal Therapy Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
        version: 1,
        approvedByUserId: null,
        approvedAt: null,
      },
    });

    // Higher fluid intake afterward
    const instPerioFluid = await client.careInstruction.findFirst({
      where: {
        clinicId,
        protocolId: perioProtocol.id,
        category: CareCategory.HYDRATION,
      },
    });
    if (!instPerioFluid) {
      await client.careInstruction.create({
        data: {
          clinicId,
          protocolId: perioProtocol.id,
          phase: CarePhase.POST_OP,
          title: 'Higher Fluid Intake After Deep Scaling',
          body: 'Maintain a higher fluid intake afterward. Drink plenty of water throughout the day to soothe tender gums, rinse away oral debris, and support tissue healing. (Draft instruction pending dentist approval.)',
          offsetMinutes: 30,
          category: CareCategory.HYDRATION,
          isCritical: false,
          sortOrder: 0,
        },
      });
    }
  }

  // D) IV sedation / general anesthesia
  const sedationTreatment = treatmentsMap.get('IV sedation / general anesthesia');
  if (sedationTreatment) {
    const sedationProtocol = await client.careProtocol.upsert({
      where: {
        clinicId_treatmentId_version: {
          clinicId,
          treatmentId: sedationTreatment.id,
          version: 1,
        },
      },
      update: {
        name: 'IV Sedation & General Anesthesia Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
      },
      create: {
        clinicId,
        treatmentId: sedationTreatment.id,
        name: 'IV Sedation & General Anesthesia Care Protocol (Draft)',
        status: CareProtocolStatus.DRAFT,
        version: 1,
        approvedByUserId: null,
        approvedAt: null,
      },
    });

    // Fasting (NPO) instruction with placeholder timing: clinic MUST fill in and approve; no hardcoded hour values
    const instFasting = await client.careInstruction.findFirst({
      where: {
        clinicId,
        protocolId: sedationProtocol.id,
        category: CareCategory.FASTING,
      },
    });
    if (!instFasting) {
      await client.careInstruction.create({
        data: {
          clinicId,
          protocolId: sedationProtocol.id,
          phase: CarePhase.PRE_OP,
          title: 'Pre-Procedure Fasting (NPO) Requirements',
          body: 'Strict fasting (nothing by mouth) is required before sedation: [CLINIC FASTING REQUIREMENT: ENTER REQUIRED FASTING HOURS BEFORE APPOINTMENT]. Do not eat solid foods or drink liquids during the designated pre-procedure window. This instruction is a draft pending dentist approval and specific fasting hours must be configured by your clinic dentist before activation.',
          offsetMinutes: -360, // Relative placeholder offset (negative = before appointment start)
          category: CareCategory.FASTING,
          isCritical: true,
          sortOrder: 0,
        },
      });
    }
  }

  // 3. Default Escalation Rules (Clinic-wide, protocolId: null)
  // Default escalation rules: heavy bleeding, severe pain after day 3, swelling with fever.
  const defaultRules = [
    {
      symptomKey: 'HEAVY_BLEEDING',
      description: 'Persistent heavy bleeding that does not stop after biting on gauze pad',
      action: EscalationAction.EMERGENCY,
      message: 'Persistent or heavy bleeding that continues after applying firm gauze pressure for 30 minutes requires immediate attention. Contact the clinic emergency number or visit the nearest emergency room immediately.',
      daysAfterMin: null,
    },
    {
      symptomKey: 'SEVERE_PAIN_AFTER_DAY_3',
      description: 'Severe throbbing pain that worsens or persists 3 or more days after procedure',
      action: EscalationAction.CALL_CLINIC,
      message: 'Severe or increasing pain 3 or more days following an extraction or procedure may indicate dry socket or localized inflammation. Please call the clinic so your dentist can examine the area and relieve the pain.',
      daysAfterMin: 3,
    },
    {
      symptomKey: 'SWELLING_WITH_FEVER',
      description: 'Facial or jaw swelling accompanied by fever or elevated temperature',
      action: EscalationAction.EMERGENCY,
      message: 'Noticeable facial swelling accompanied by a fever or difficulty swallowing can be a sign of a spreading infection. Contact the clinic immediately or proceed to urgent care.',
      daysAfterMin: null,
    },
  ];

  for (const rule of defaultRules) {
    const existingRule = await client.escalationRule.findFirst({
      where: {
        clinicId,
        protocolId: null,
        symptomKey: rule.symptomKey,
      },
    });

    if (!existingRule) {
      await client.escalationRule.create({
        data: {
          clinicId,
          protocolId: null,
          symptomKey: rule.symptomKey,
          description: rule.description,
          action: rule.action,
          message: rule.message,
          daysAfterMin: rule.daysAfterMin,
        },
      });
    } else {
      await client.escalationRule.update({
        where: { id: existingRule.id },
        data: {
          description: rule.description,
          action: rule.action,
          message: rule.message,
          daysAfterMin: rule.daysAfterMin,
        },
      });
    }
  }

  console.log(`✅ Default treatments, protocols, and escalation rules seeded for clinic: ${clinicId}`);
}
