export type ServiceCategory =
  | 'Preventive'
  | 'Cosmetic'
  | 'Restorative'
  | 'Orthodontics'
  | 'Surgery';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  summary: string;
  priceInr: number;
  durationMin: number;
  priceNote?: string;
  /** Key of the Lucide icon used to represent the service. */
  icon: string;
  whatToExpect: string[];
  preparation: string[];
}

export interface Dentist {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  qualifications: string[];
  languages: string[];
  /** 0 = Sunday … 6 = Saturday */
  workingDays: number[];
  startTime: string;
  endTime: string;
  bio: string;
  highlights: string[];
  accent: string;
  initials: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  label: string;
  available: boolean;
}

export interface SlotDay {
  date: string;
  label: string;
  weekday: string;
  dayNumber: string;
  month: string;
  isToday: boolean;
  isPast: boolean;
  slots: TimeSlot[];
}

export interface PatientDetails {
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface BookingDraft {
  serviceId: string | null;
  dentistId: string | null;
  date: string | null;
  time: string | null;
  patient: PatientDetails;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  dentistId: string | null;
  dentistName: string;
  date: string;
  time: string;
  durationMin: number;
  priceInr: number;
  patient: PatientDetails;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  context: string;
  rating: number;
  quote: string;
  service: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  hours: Array<{ day: string; open: string; note?: string }>;
  parking: string;
  socials: Array<{ label: string; href: string; icon: string }>;
}
