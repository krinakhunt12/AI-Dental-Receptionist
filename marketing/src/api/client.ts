import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { dentists, getDentist } from '../data/dentists';
import { getService, services } from '../data/services';
import type { Appointment, BookingDraft, Dentist, SlotDay, Service, TimeSlot } from './types';

/**
 * Mock-first data layer.
 *
 * Every call goes through a single module so the marketing site can be wired
 * to the real API later without touching page code: set `VITE_API_BASE_URL`
 * and each function below switches to a network request.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCK = !API_BASE;

const NETWORK_DELAY = 420;

function delay(ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.round(Math.random() * 260)));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`);
  }
  return (await response.json()) as T;
}

/* -------------------------------------------------------------------------- */
/* Services                                                                     */
/* -------------------------------------------------------------------------- */

export async function fetchServices(): Promise<Service[]> {
  if (!USE_MOCK) return request<Service[]>('/api/services');
  await delay(300);
  return services;
}

export async function fetchService(id: string): Promise<Service | undefined> {
  if (!USE_MOCK) return request<Service>(`/api/services/${id}`);
  await delay(200);
  return getService(id);
}

/* -------------------------------------------------------------------------- */
/* Dentists                                                                     */
/* -------------------------------------------------------------------------- */

export async function fetchDentists(): Promise<Dentist[]> {
  if (!USE_MOCK) return request<Dentist[]>('/api/doctors');
  await delay(300);
  return dentists;
}

/* -------------------------------------------------------------------------- */
/* Availability                                                                 */
/* -------------------------------------------------------------------------- */

const CLINIC_OPEN = 9;
const CLINIC_CLOSE = 20;

/** Deterministic pseudo-random so the same slot always looks the same. */
function hash(str: string) {
  let value = 0;
  for (let i = 0; i < str.length; i += 1) {
    value = (value << 5) - value + str.charCodeAt(i);
    value |= 0;
  }
  return Math.abs(value);
}

function buildSlots(date: Date, service: Service | undefined, dentist: Dentist | undefined): TimeSlot[] {
  const duration = service?.durationMin ?? 30;
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let hour = CLINIC_OPEN; hour < CLINIC_CLOSE; hour += 1) {
    for (const minute of [0, 30]) {
      const startMinutes = hour * 60 + minute;
      if (startMinutes + duration > CLINIC_CLOSE * 60) continue;

      const dateKey = format(date, 'yyyy-MM-dd');
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const slotDate = new Date(date);
      slotDate.setHours(hour, minute, 0, 0);

      let available = true;

      // Dentist must be working that weekday and the slot must fall in hours.
      if (dentist) {
        const worksToday = dentist.workingDays.includes(date.getDay());
        const withinHours = startMinutes >= toMinutes(dentist.startTime) && startMinutes + duration <= toMinutes(dentist.endTime);
        available = worksToday && withinHours;
      }

      // Deterministic "already booked" pattern, weighted by the hour.
      if (available) {
        const seed = hash(`${dateKey}-${time}-${service?.id ?? 'general'}`);
        const lunch = hour === 13;
        const eveningPeak = hour >= 17 && hour <= 19;
        const busyRatio = lunch ? 0.95 : eveningPeak ? 0.55 : 0.35;
        available = seed % 100 > busyRatio * 100;
      }

      if (isBefore(slotDate, now)) available = false;

      slots.push({
        id: `${dateKey}-${time}`,
        time,
        label: formatTimeLabel(time),
        available,
      });
    }
  }

  return slots;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatTimeLabel(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${String(m).padStart(2, '0')} ${suffix}`;
}

export async function fetchSlotWindow(
  serviceId: string | null,
  dentistId: string | null,
  days = 14,
): Promise<SlotDay[]> {
  if (!USE_MOCK) {
    return request<SlotDay[]>('/api/appointments/slots', {
      method: 'POST',
      body: JSON.stringify({ serviceId, dentistId, days }),
    });
  }

  await delay(340);
  const service = getService(serviceId);
  const dentist = getDentist(dentistId);
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(today, index);
    const slots = buildSlots(date, service, dentist);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE'),
      weekday: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      month: format(date, 'MMM'),
      isToday: index === 0,
      isPast: false,
      slots,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Appointments                                                                 */
/* -------------------------------------------------------------------------- */

export async function createAppointment(draft: BookingDraft): Promise<Appointment> {
  if (!USE_MOCK) {
    return request<Appointment>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(draft),
    });
  }

  await delay(900);
  const service = getService(draft.serviceId);
  const dentist = getDentist(draft.dentistId);

  return {
    id: `SC-${Math.floor(100000 + Math.random() * 899999)}`,
    serviceId: draft.serviceId ?? '',
    serviceName: service?.name ?? 'General Checkup',
    dentistId: dentist?.id ?? null,
    dentistName: dentist?.name ?? 'Next available dentist',
    date: draft.date ?? '',
    time: draft.time ?? '',
    durationMin: service?.durationMin ?? 30,
    priceInr: service?.priceInr ?? 500,
    patient: draft.patient,
    createdAt: new Date().toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/* Content                                                                      */
/* -------------------------------------------------------------------------- */

export async function fetchTestimonials() {
  const { testimonials } = await import('../data/content');
  await delay(260);
  return testimonials;
}

export async function fetchFaqs() {
  const { faqs } = await import('../data/content');
  await delay(220);
  return faqs;
}
