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
