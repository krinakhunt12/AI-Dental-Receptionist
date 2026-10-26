export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'No-show'
  | 'Cancelled';

export interface Treatment {
  id: string;
  clinicId?: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description?: string;
}

export interface Dentist {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  specialization?: string;
  avatarUrl: string;
  email: string;
  phone: string;
  workingDays: string[];
  days?: number[];
  workingHours: string;
  start?: string;
  end?: string;
  treatments: Treatment[];
}

export interface Slot {
  id: string;
  clinicId: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  startTime?: string;
  endTime?: string;
  isAvailable: boolean;
}

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  email: string;
  age?: number;
  gender?: 'Female' | 'Male' | 'Other';
  lastVisit?: string;
  nextAppointment?: string;
  source?: 'Website Widget' | 'WhatsApp' | 'Phone Call' | 'Walk-in' | string;
  tags?: string[];
  medicalHistory?: string[];
  totalVisits?: number;
  totalAppointments?: number;
  dob?: string;
  preferredDentist?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  treatment: string;
  treatmentId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMins: number;
  status: AppointmentStatus;
  source?: 'Website Widget' | 'WhatsApp' | 'Phone Call' | 'Walk-in' | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AppointmentFilters {
  doctorId?: string;
  status?: string;
  date?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PatientFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export type CareProtocolStatus = 'DRAFT' | 'APPROVED' | 'ARCHIVED';
export type CarePhase = 'PRE_OP' | 'POST_OP';
export type CareCategory =
  | 'HYDRATION'
  | 'DIET'
  | 'MEDICATION'
  | 'ACTIVITY'
  | 'HYGIENE'
  | 'FASTING'
  | 'OTHER';
export type EscalationAction = 'CALL_CLINIC' | 'EMERGENCY' | 'NOTIFY_STAFF';

export interface CareInstruction {
  id: string;
  clinicId: string;
  protocolId: string;
  phase: CarePhase;
  title: string;
  body: string;
  offsetMinutes: number;
  category: CareCategory;
  isCritical: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EscalationRule {
  id: string;
  clinicId: string;
  protocolId?: string | null;
  symptomKey: string;
  description: string;
  action: EscalationAction;
  message: string;
  daysAfterMin?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareProtocol {
  id: string;
  clinicId: string;
  treatmentId: string;
  treatment?: Treatment;
  name: string;
  status: CareProtocolStatus;
  approvedByUserId?: string | null;
  approvedAt?: string | null;
  version: number;
  createdAt?: string;
  updatedAt?: string;
  instructions?: CareInstruction[];
  escalationRules?: EscalationRule[];
  rules?: EscalationRule[];
}

export interface ResolvedCareInstruction extends CareInstruction {
  sendAt: string; // ISO string in UTC
}

export interface CarePlan {
  appointmentId: string;
  treatmentId: string | null;
  treatmentName: string;
  protocolId: string | null;
  protocolName: string | null;
  version: number | null;
  approvedAt?: string | null;
  instructions: ResolvedCareInstruction[];
  escalationRules?: EscalationRule[];
}

export interface CareProtocolFilters {
  treatmentId?: string;
  status?: CareProtocolStatus;
}

export type NotificationChannel = 'WHATSAPP' | 'SMS';
export type ConsentStatus = 'OPTED_IN' | 'OPTED_OUT';
export type ReminderJobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SENT'
  | 'FAILED'
  | 'CANCELLED'
  | 'SKIPPED';

export interface NotificationConsent {
  id: string;
  clinicId: string;
  patientId: string;
  channel: NotificationChannel;
  status: ConsentStatus;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderJob {
  id: string;
  clinicId: string;
  appointmentId: string;
  instructionId: string;
  patientId: string;
  channel: NotificationChannel;
  sendAt: string;
  status: ReminderJobStatus;
  attempts: number;
  lastError?: string | null;
  skipReason?: string | null;
  providerMessageId?: string | null;
  sentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  instruction?: {
    id: string;
    title: string;
    body?: string;
    category: CareCategory;
    phase: CarePhase;
    isCritical: boolean;
    offsetMinutes?: number;
  };
}

export interface TriageMessageResponse {
  reply: string;
  urgency: 'NONE' | 'CONTACT_CLINIC' | 'EMERGENCY';
  escalated: boolean;
  symptomKeys: string[];
  appointmentId: string | null;
  patientId: string | null;
}

