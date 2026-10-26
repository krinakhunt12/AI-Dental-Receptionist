import {
  Appointment,
  Dentist,
  Patient,
  Slot,
  Treatment,
  AppointmentFilters,
  PatientFilters,
  CareProtocol,
  CareInstruction,
  EscalationRule,
  CarePlan,
  CareProtocolFilters,
  ReminderJob,
  NotificationConsent,
  NotificationChannel,
  ConsentStatus,
} from '../types';
import { ApiError } from '../lib/apiClient';
import {
  SEED_APPOINTMENTS,
  SEED_DOCTORS,
  SEED_PATIENTS,
} from './seedData';

const DEFAULT_CLINIC_ID = 'clinic_smilecare_01';

// Seed treatments from doctors
const initialTreatments: Treatment[] = [
  { id: 'trt_1', clinicId: DEFAULT_CLINIC_ID, name: 'Smile Makeover Consultation', duration: 45, price: 150, description: 'Comprehensive aesthetic assessment' },
  { id: 'trt_2', clinicId: DEFAULT_CLINIC_ID, name: 'Dental Implant Placement', duration: 90, price: 1200, description: 'Precision surgical implant' },
  { id: 'trt_3', clinicId: DEFAULT_CLINIC_ID, name: 'Porcelain Veneers (per tooth)', duration: 60, price: 800, description: 'Custom fitted aesthetic veneers' },
  { id: 'trt_4', clinicId: DEFAULT_CLINIC_ID, name: 'Invisalign Comprehensive', duration: 45, price: 4500, description: 'Clear aligners orthodontics' },
  { id: 'trt_5', clinicId: DEFAULT_CLINIC_ID, name: 'Routine Checkup & Teeth Cleaning', duration: 45, price: 120, description: 'Preventative cleaning and scaling' },
  { id: 'trt_6', clinicId: DEFAULT_CLINIC_ID, name: 'Composite Cavity Filling', duration: 45, price: 180, description: 'Tooth-colored composite restoration' },
  { id: 'trt_7', clinicId: DEFAULT_CLINIC_ID, name: 'Root Canal Treatment', duration: 75, price: 750, description: 'Therapeutic endodontic care' },
  { id: 'trt_8', clinicId: DEFAULT_CLINIC_ID, name: 'Teeth Whitening Express', duration: 45, price: 290, description: 'In-office laser whitening' },
  { id: 'trt_9', clinicId: DEFAULT_CLINIC_ID, name: 'Tooth Extraction Emergency', duration: 45, price: 250, description: 'Urgent pain relief & extraction' },
];

// Seed dentists with clinicId and treatments
const initialDentists: Dentist[] = SEED_DOCTORS.map((d) => ({
  id: d.id,
  clinicId: DEFAULT_CLINIC_ID,
  name: d.name,
  specialty: d.specialty,
  specialization: d.specialty,
  avatarUrl: d.avatarUrl,
  email: d.email,
  phone: d.phone,
  workingDays: d.workingDays,
  days: [1, 2, 3, 4, 5],
  workingHours: d.workingHours,
  start: d.workingHours.split(' - ')[0] || '09:00',
  end: d.workingHours.split(' - ')[1] || '17:00',
  treatments: d.treatments.map((t, idx) => ({
    id: `trt_${d.id}_${idx}`,
    clinicId: DEFAULT_CLINIC_ID,
    name: t.name,
    duration: t.duration,
    price: t.price,
  })),
}));

// Seed patients with clinicId
const initialPatients: Patient[] = SEED_PATIENTS.map((p) => ({
  ...p,
  clinicId: DEFAULT_CLINIC_ID,
  totalAppointments: p.totalVisits || 1,
}));

// Seed appointments with clinicId
const initialAppointments: Appointment[] = SEED_APPOINTMENTS.map((a) => ({
  ...a,
  clinicId: DEFAULT_CLINIC_ID,
}));

// Seed care protocols with instructions
const initialCareProtocols: CareProtocol[] = [
  {
    id: 'proto_1',
    clinicId: DEFAULT_CLINIC_ID,
    treatmentId: 'trt_9', // Tooth extraction
    name: 'Tooth Extraction & Oral Surgery Care Protocol (Draft)',
    status: 'DRAFT',
    version: 1,
    approvedByUserId: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructions: [
      {
        id: 'inst_1',
        clinicId: DEFAULT_CLINIC_ID,
        protocolId: 'proto_1',
        phase: 'POST_OP',
        title: 'Post-Extraction Hydration',
        body: 'Drink plenty of fluids (water, electrolytes) after surgery. Avoid hot drinks while numb. (Draft instruction pending dentist approval.)',
        offsetMinutes: 30,
        category: 'HYDRATION',
        isCritical: false,
        sortOrder: 0,
      },
      {
        id: 'inst_2',
        clinicId: DEFAULT_CLINIC_ID,
        protocolId: 'proto_1',
        phase: 'POST_OP',
        title: 'Do NOT Use a Straw for 48 Hours',
        body: 'Do NOT use a straw for at least 48 hours following surgery. Suction can dislodge the blood clot and cause dry socket. (Draft instruction pending dentist approval.)',
        offsetMinutes: 0,
        category: 'ACTIVITY',
        isCritical: true,
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'proto_2',
    clinicId: DEFAULT_CLINIC_ID,
    treatmentId: 'trt_8', // Teeth whitening
    name: 'Teeth Whitening Care Protocol (Draft)',
    status: 'DRAFT',
    version: 1,
    approvedByUserId: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructions: [
      {
        id: 'inst_3',
        clinicId: DEFAULT_CLINIC_ID,
        protocolId: 'proto_2',
        phase: 'POST_OP',
        title: 'Water-Focused Fluid Intake',
        body: 'Drink ample water to stay hydrated and protect enamel. (Draft instruction pending dentist approval.)',
        offsetMinutes: 0,
        category: 'HYDRATION',
        isCritical: false,
        sortOrder: 0,
      },
      {
        id: 'inst_4',
        clinicId: DEFAULT_CLINIC_ID,
        protocolId: 'proto_2',
        phase: 'POST_OP',
        title: '48-Hour White Diet',
        body: 'Avoid coffee, tea, red wine, and dark colas ("white diet") for 48 hours. (Draft instruction pending dentist approval.)',
        offsetMinutes: 0,
        category: 'DIET',
        isCritical: false,
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'proto_3',
    clinicId: DEFAULT_CLINIC_ID,
    treatmentId: 'trt_7', // Root canal
    name: 'Root Canal Care Protocol (Approved)',
    status: 'APPROVED',
    version: 1,
    approvedByUserId: 'usr_dentist_1',
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructions: [
      {
        id: 'inst_5',
        clinicId: DEFAULT_CLINIC_ID,
        protocolId: 'proto_3',
        phase: 'POST_OP',
        title: 'Gentle Chewing & Hydration',
        body: 'Chew on the opposite side of your mouth until your permanent crown is placed. Drink plenty of water.',
        offsetMinutes: 60,
        category: 'HYDRATION',
        isCritical: false,
        sortOrder: 0,
      },
    ],
  },
];

const initialEscalationRules: EscalationRule[] = [
  {
    id: 'rule_1',
    clinicId: DEFAULT_CLINIC_ID,
    protocolId: null,
    symptomKey: 'HEAVY_BLEEDING',
    description: 'Heavy bleeding that continues after gentle pressure',
    action: 'EMERGENCY',
    message: 'Persistent bleeding requires urgent evaluation. Contact clinic emergency line or visit nearest ER.',
    daysAfterMin: null,
  },
  {
    id: 'rule_2',
    clinicId: DEFAULT_CLINIC_ID,
    protocolId: null,
    symptomKey: 'SEVERE_PAIN_AFTER_DAY_3',
    description: 'Severe throbbing pain worsening after day 3',
    action: 'CALL_CLINIC',
    message: 'Pain worsening after day 3 may indicate dry socket. Call the clinic immediately.',
    daysAfterMin: 3,
  },
  {
    id: 'rule_3',
    clinicId: DEFAULT_CLINIC_ID,
    protocolId: null,
    symptomKey: 'SWELLING_WITH_FEVER',
    description: 'Facial swelling accompanied by fever',
    action: 'EMERGENCY',
    message: 'Swelling with fever indicates spreading infection. Seek immediate medical attention.',
    daysAfterMin: null,
  },
];

// In-memory data stores
let appointmentsStore: Appointment[] = [...initialAppointments];
let dentistsStore: Dentist[] = [...initialDentists];
let treatmentsStore: Treatment[] = [...initialTreatments];
let patientsStore: Patient[] = [...initialPatients];
let careProtocolsStore: CareProtocol[] = JSON.parse(JSON.stringify(initialCareProtocols));
let escalationRulesStore: EscalationRule[] = JSON.parse(JSON.stringify(initialEscalationRules));

const STANDARD_TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
];

export const mockDb = {
  reset() {
    appointmentsStore = [...initialAppointments];
    dentistsStore = [...initialDentists];
    treatmentsStore = [...initialTreatments];
    patientsStore = [...initialPatients];
    careProtocolsStore = JSON.parse(JSON.stringify(initialCareProtocols));
    escalationRulesStore = JSON.parse(JSON.stringify(initialEscalationRules));
  },

  async getDentists(clinicId: string): Promise<Dentist[]> {
    return dentistsStore.filter((d) => !d.clinicId || d.clinicId === clinicId);
  },

  async getTreatments(clinicId: string): Promise<Treatment[]> {
    return treatmentsStore.filter((t) => !t.clinicId || t.clinicId === clinicId);
  },

  async getPatients(clinicId: string, filters?: PatientFilters): Promise<Patient[]> {
    let list = patientsStore.filter((p) => !p.clinicId || p.clinicId === clinicId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getSlots(clinicId: string, dentistId: string, date: string): Promise<Slot[]> {
    const bookedApts = appointmentsStore.filter(
      (a) =>
        (!a.clinicId || a.clinicId === clinicId) &&
        a.doctorId === dentistId &&
        a.date === date &&
        a.status !== 'Cancelled'
    );
    const bookedTimes = new Set(bookedApts.map((a) => a.time));

    return STANDARD_TIMES.map((time, idx) => {
      const isAvailable = !bookedTimes.has(time);
      return {
        id: `slot_${dentistId}_${date}_${idx}`,
        clinicId,
        dentistId,
        date,
        time,
        startTime: time,
        isAvailable,
      };
    });
  },

  async getAppointments(clinicId: string, filters?: AppointmentFilters): Promise<Appointment[]> {
    let list = appointmentsStore.filter((a) => !a.clinicId || a.clinicId === clinicId);

    if (filters?.doctorId && filters.doctorId !== 'ALL') {
      list = list.filter((a) => a.doctorId === filters.doctorId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((a) => a.status.toLowerCase() === filters.status!.toLowerCase());
    }
    if (filters?.date) {
      list = list.filter((a) => a.date === filters.date);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.patientPhone.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.treatment.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getAppointment(clinicId: string, id: string): Promise<Appointment> {
    const apt = appointmentsStore.find(
      (a) => a.id === id && (!a.clinicId || a.clinicId === clinicId)
    );
    if (!apt) {
      throw new ApiError(404, `Appointment with id ${id} not found`);
    }
    return apt;
  },

  async createAppointment(
    clinicId: string,
    data: {
      patientId?: string;
      patientName: string;
      patientPhone: string;
      doctorId: string;
      doctorName?: string;
      treatment: string;
      treatmentId?: string;
      date: string;
      time: string;
      durationMins?: number;
      notes?: string;
      source?: Appointment['source'];
    }
  ): Promise<Appointment> {
    // Check for conflict (slot already taken)
    const conflict = appointmentsStore.find(
      (a) =>
        (!a.clinicId || a.clinicId === clinicId) &&
        a.doctorId === data.doctorId &&
        a.date === data.date &&
        a.time === data.time &&
        a.status !== 'Cancelled'
    );

    if (conflict) {
      throw new ApiError(
        409,
        `This slot (${data.date} at ${data.time}) is already booked. Please choose another time.`
      );
    }

    const doctor = dentistsStore.find((d) => d.id === data.doctorId);
    const newAppointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clinicId,
      patientId: data.patientId || `pat_${Date.now()}`,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      doctorId: data.doctorId,
      doctorName: data.doctorName || doctor?.name || 'Assigned Doctor',
      treatment: data.treatment,
      treatmentId: data.treatmentId,
      date: data.date,
      time: data.time,
      durationMins: data.durationMins || 45,
      status: 'Confirmed',
      source: data.source || 'Website Widget',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    appointmentsStore.unshift(newAppointment);

    // If patient doesn't exist, create patient record
    const existingPatient = patientsStore.find(
      (p) => p.phone === data.patientPhone || p.id === data.patientId
    );
    if (!existingPatient) {
      patientsStore.unshift({
        id: newAppointment.patientId,
        clinicId,
        name: data.patientName,
        phone: data.patientPhone,
        email: `${data.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        source: data.source || 'Website Widget',
        lastVisit: data.date,
        nextAppointment: `${data.date} ${data.time}`,
        tags: ['New Patient'],
        medicalHistory: ['No Known Allergies'],
        totalVisits: 1,
      });
    }

    return newAppointment;
  },

  async updateAppointment(
    clinicId: string,
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    const index = appointmentsStore.findIndex(
      (a) => a.id === id && (!a.clinicId || a.clinicId === clinicId)
    );
    if (index === -1) {
      throw new ApiError(404, `Appointment with id ${id} not found`);
    }

    const updated = {
      ...appointmentsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    appointmentsStore[index] = updated;
    return updated;
  },

  async cancelAppointment(clinicId: string, id: string): Promise<Appointment> {
    return this.updateAppointment(clinicId, id, { status: 'Cancelled' });
  },

  // --- Care Protocol Mock Methods ---

  async getCareProtocols(clinicId: string, filters?: CareProtocolFilters): Promise<CareProtocol[]> {
    let list = careProtocolsStore.filter((p) => !p.clinicId || p.clinicId === clinicId);
    if (filters?.treatmentId) {
      list = list.filter((p) => p.treatmentId === filters.treatmentId);
    }
    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    return list;
  },

  async getCareProtocol(clinicId: string, id: string): Promise<CareProtocol> {
    const proto = careProtocolsStore.find(
      (p) => p.id === id && (!p.clinicId || p.clinicId === clinicId)
    );
    if (!proto) {
      throw new ApiError(404, `Care protocol with id ${id} not found`);
    }
    return proto;
  },

  async createCareProtocol(
    clinicId: string,
    data: { treatmentId: string; name: string }
  ): Promise<CareProtocol> {
    const existingForTreatment = careProtocolsStore.filter(
      (p) => p.clinicId === clinicId && p.treatmentId === data.treatmentId
    );
    const maxVer = existingForTreatment.reduce((m, p) => Math.max(m, p.version), 0);
    const newProto: CareProtocol = {
      id: `proto_${Date.now()}`,
      clinicId,
      treatmentId: data.treatmentId,
      name: data.name,
      status: 'DRAFT',
      version: maxVer + 1,
      approvedByUserId: null,
      approvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructions: [],
      escalationRules: [],
    };
    careProtocolsStore.unshift(newProto);
    return newProto;
  },

  async updateCareProtocol(
    clinicId: string,
    id: string,
    data: { name?: string }
  ): Promise<CareProtocol> {
    const existing = careProtocolsStore.find(
      (p) => p.id === id && (!p.clinicId || p.clinicId === clinicId)
    );
    if (!existing) {
      throw new ApiError(404, `Care protocol with id ${id} not found`);
    }

    // If APPROVED, create new DRAFT version (version + 1)
    if (existing.status === 'APPROVED') {
      const existingDraft = careProtocolsStore.find(
        (p) => p.clinicId === clinicId && p.treatmentId === existing.treatmentId && p.status === 'DRAFT'
      );
      if (existingDraft) {
        if (data.name) existingDraft.name = data.name;
        return existingDraft;
      }
      const existingForTreatment = careProtocolsStore.filter(
        (p) => p.clinicId === clinicId && p.treatmentId === existing.treatmentId
      );
      const maxVer = existingForTreatment.reduce((m, p) => Math.max(m, p.version), 0);
      const newDraft: CareProtocol = {
        id: `proto_${Date.now()}`,
        clinicId,
        treatmentId: existing.treatmentId,
        name: data.name || existing.name,
        status: 'DRAFT',
        version: maxVer + 1,
        approvedByUserId: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        instructions: (existing.instructions || []).map((i) => ({
          ...i,
          id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          protocolId: `proto_${Date.now()}`,
        })),
        escalationRules: (existing.escalationRules || []).map((r) => ({
          ...r,
          id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          protocolId: `proto_${Date.now()}`,
        })),
      };
      careProtocolsStore.unshift(newDraft);
      return newDraft;
    }

    if (data.name) {
      existing.name = data.name;
    }
    existing.updatedAt = new Date().toISOString();
    return existing;
  },

  async approveCareProtocol(clinicId: string, id: string, userId = 'usr_doctor_1'): Promise<CareProtocol> {
    const existing = careProtocolsStore.find(
      (p) => p.id === id && (!p.clinicId || p.clinicId === clinicId)
    );
    if (!existing) {
      throw new ApiError(404, `Care protocol with id ${id} not found`);
    }

    // Archive previous approved protocols for same treatment
    careProtocolsStore.forEach((p) => {
      if (p.clinicId === clinicId && p.treatmentId === existing.treatmentId && p.status === 'APPROVED') {
        p.status = 'ARCHIVED';
      }
    });

    existing.status = 'APPROVED';
    existing.approvedByUserId = userId;
    existing.approvedAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();
    return existing;
  },

  async addCareInstruction(
    clinicId: string,
    protocolId: string,
    data: Omit<CareInstruction, 'id' | 'clinicId' | 'protocolId'>
  ): Promise<CareInstruction> {
    const proto = careProtocolsStore.find(
      (p) => p.id === protocolId && (!p.clinicId || p.clinicId === clinicId)
    );
    if (!proto) {
      throw new ApiError(404, `Care protocol with id ${protocolId} not found`);
    }

    let targetProto = proto;
    if (proto.status === 'APPROVED') {
      targetProto = await this.updateCareProtocol(clinicId, protocolId, {});
    }

    const newInstruction: CareInstruction = {
      id: `inst_${Date.now()}`,
      clinicId,
      protocolId: targetProto.id,
      phase: data.phase,
      title: data.title,
      body: data.body,
      offsetMinutes: data.offsetMinutes,
      category: data.category,
      isCritical: Boolean(data.isCritical),
      sortOrder: data.sortOrder ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!targetProto.instructions) targetProto.instructions = [];
    targetProto.instructions.push(newInstruction);
    return newInstruction;
  },

  async getCarePlan(clinicId: string, appointmentId: string): Promise<CarePlan> {
    const apt = appointmentsStore.find(
      (a) => a.id === appointmentId && (!a.clinicId || a.clinicId === clinicId)
    );
    if (!apt) {
      throw new ApiError(404, `Appointment with id ${appointmentId} not found`);
    }

    // Match treatment
    const treatment = treatmentsStore.find(
      (t) =>
        t.id === apt.treatmentId ||
        t.name.toLowerCase() === (apt.treatment || '').toLowerCase()
    );

    const clinicRules = escalationRulesStore.filter(
      (r) => (!r.clinicId || r.clinicId === clinicId) && !r.protocolId
    );

    if (!treatment) {
      return {
        appointmentId,
        treatmentId: null,
        treatmentName: apt.treatment || 'Treatment',
        protocolId: null,
        protocolName: null,
        version: null,
        approvedAt: null,
        instructions: [],
        escalationRules: clinicRules,
      };
    }

    // Find APPROVED protocol only
    const approvedProtocol = careProtocolsStore
      .filter(
        (p) =>
          (!p.clinicId || p.clinicId === clinicId) &&
          p.treatmentId === treatment.id &&
          p.status === 'APPROVED'
      )
      .sort((a, b) => b.version - a.version)[0];

    if (!approvedProtocol) {
      return {
        appointmentId,
        treatmentId: treatment.id,
        treatmentName: treatment.name,
        protocolId: null,
        protocolName: null,
        version: null,
        approvedAt: null,
        instructions: [],
        escalationRules: clinicRules,
      };
    }

    // Parse appointment start/end datetime
    const [year, month, day] = apt.date.split('-').map(Number);
    const [hours, mins] = apt.time.split(':').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day, hours, mins, 0));
    const endDate = new Date(startDate.getTime() + (apt.durationMins || 45) * 60 * 1000);

    const resolvedInstructions = (approvedProtocol.instructions || []).map((inst) => {
      const targetTimeMs =
        inst.offsetMinutes < 0
          ? startDate.getTime() + inst.offsetMinutes * 60 * 1000
          : endDate.getTime() + inst.offsetMinutes * 60 * 1000;
      return {
        ...inst,
        sendAt: new Date(targetTimeMs).toISOString(),
      };
    });

    const protocolRules = approvedProtocol.escalationRules || [];
    const allRules = [...protocolRules, ...clinicRules];

    return {
      appointmentId,
      treatmentId: treatment.id,
      treatmentName: treatment.name,
      protocolId: approvedProtocol.id,
      protocolName: approvedProtocol.name,
      version: approvedProtocol.version,
      approvedAt: approvedProtocol.approvedAt || null,
      instructions: resolvedInstructions,
      escalationRules: allRules,
    };
  },

  async getAppointmentReminders(clinicId: string, appointmentId: string): Promise<ReminderJob[]> {
    let jobs = reminderJobsStore.filter(
      (j) => j.appointmentId === appointmentId && (!j.clinicId || j.clinicId === clinicId)
    );

    // If none exist yet for this appointment, generate realistic mock reminders from care-plan
    if (jobs.length === 0) {
      try {
        const carePlan = await this.getCarePlan(clinicId, appointmentId);
        const apt = appointmentsStore.find((a) => a.id === appointmentId);
        const patientId = apt?.patientId || 'pat_1';

        const sampleStatuses: Array<{
          status: 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED';
          lastError?: string;
          skipReason?: string;
        }> = [
          { status: 'SENT' },
          { status: 'PENDING' },
          { status: 'FAILED', lastError: 'Provider timeout: network failure after 3 attempts' },
          { status: 'SKIPPED', skipReason: 'Patient has no OPTED_IN consent for SMS' },
        ];

        let statusIdx = 0;
        for (const inst of carePlan.instructions) {
          const cfg = sampleStatuses[statusIdx % sampleStatuses.length];
          statusIdx++;

          const job: ReminderJob = {
            id: `job_${appointmentId}_${inst.id}_wa`,
            clinicId,
            appointmentId,
            instructionId: inst.id,
            patientId,
            channel: 'WHATSAPP',
            sendAt: inst.sendAt || new Date().toISOString(),
            status: cfg.status,
            attempts: cfg.status === 'FAILED' ? 3 : cfg.status === 'SENT' ? 1 : 0,
            lastError: cfg.lastError || null,
            skipReason: cfg.skipReason || null,
            providerMessageId: cfg.status === 'SENT' ? `wa_msg_${Date.now()}` : null,
            sentAt: cfg.status === 'SENT' ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            instruction: {
              id: inst.id,
              title: inst.title,
              category: inst.category,
              phase: inst.phase,
              isCritical: inst.isCritical,
              offsetMinutes: inst.offsetMinutes,
            },
          };
          reminderJobsStore.push(job);
        }
        jobs = reminderJobsStore.filter((j) => j.appointmentId === appointmentId);
      } catch {
        // Return empty if care plan resolution fails
      }
    }

    return jobs;
  },

  async retryReminderJob(clinicId: string, jobId: string): Promise<ReminderJob> {
    const job = reminderJobsStore.find((j) => j.id === jobId && (!j.clinicId || j.clinicId === clinicId));
    if (!job) {
      throw new ApiError(404, `Reminder job ${jobId} not found`);
    }

    job.status = 'PENDING';
    job.attempts = 0;
    job.lastError = null;
    job.sendAt = new Date().toISOString();
    job.updatedAt = new Date().toISOString();

    return job;
  },

  async updateNotificationConsent(
    clinicId: string,
    patientId: string,
    channel: NotificationChannel,
    status: ConsentStatus,
    source = 'STAFF'
  ): Promise<NotificationConsent> {
    let consent = notificationConsentsStore.find(
      (c) => c.patientId === patientId && c.channel === channel && (!c.clinicId || c.clinicId === clinicId)
    );

    if (consent) {
      consent.status = status;
      consent.source = source;
      consent.updatedAt = new Date().toISOString();
    } else {
      consent = {
        id: `consent_${Date.now()}`,
        clinicId,
        patientId,
        channel,
        status,
        source,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      notificationConsentsStore.push(consent);
    }

    if (status === 'OPTED_OUT') {
      for (const job of reminderJobsStore) {
        if (job.patientId === patientId && job.channel === channel && job.status === 'PENDING') {
          job.status = 'CANCELLED';
          job.skipReason = `Patient opted out of ${channel}`;
          job.updatedAt = new Date().toISOString();
        }
      }
    }

    return consent;
  },
};

const reminderJobsStore: ReminderJob[] = [];
const notificationConsentsStore: NotificationConsent[] = [];

