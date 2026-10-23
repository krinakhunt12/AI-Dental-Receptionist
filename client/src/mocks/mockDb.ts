import {
  Appointment,
  Dentist,
  Patient,
  Slot,
  Treatment,
  AppointmentFilters,
  PatientFilters,
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

// In-memory data stores
let appointmentsStore: Appointment[] = [...initialAppointments];
let dentistsStore: Dentist[] = [...initialDentists];
let treatmentsStore: Treatment[] = [...initialTreatments];
let patientsStore: Patient[] = [...initialPatients];

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
};
