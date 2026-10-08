import { randomUUID } from 'node:crypto';
import { config } from './config';
import { appointments, dentists, saveAppointments, services, type Appointment } from './db';

const STEP = 30;
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Current date (YYYY-MM-DD) and minutes-since-midnight in the clinic's timezone. */
export function clinicNow() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: config.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

export function getSlots(dentistId: string, serviceId: string, date: string): { slots: string[]; reason?: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { slots: [], reason: 'Date must be YYYY-MM-DD.' };
  const dentist = dentists().find((d) => d.id === dentistId);
  const service = services().find((s) => s.id === serviceId);
  if (!dentist) return { slots: [], reason: 'Unknown dentist.' };
  if (!service) return { slots: [], reason: 'Unknown service.' };
  if (!service.dentistIds.includes(dentist.id)) return { slots: [], reason: `${dentist.name} does not perform ${service.name}.` };

  const now = clinicNow();
  if (date < now.date) return { slots: [], reason: 'That date is in the past.' };
  const weekday = new Date(date + 'T00:00:00Z').getUTCDay();
  if (!dentist.days.includes(weekday)) return { slots: [], reason: `${dentist.name} does not work on that day.` };

  const busy = appointments().filter((a) => a.dentistId === dentistId && a.date === date && a.status === 'booked');
  const slots: string[] = [];
  for (let s = toMin(dentist.start); s + service.durationMin <= toMin(dentist.end); s += STEP) {
    if (date === now.date && s <= now.minutes) continue;
    const e = s + service.durationMin;
    if (busy.some((a) => s < toMin(a.end) && e > toMin(a.start))) continue;
    slots.push(toTime(s));
  }
  return { slots, reason: slots.length ? undefined : 'Fully booked.' };
}

type BookInput = { serviceId: string; dentistId: string; date: string; time: string; patientName: string; patientPhone: string };

/** Synchronous check-then-write: Node is single-threaded, so there is no double-booking window. */
export function book(i: BookInput): { ok: true; appointment: Appointment } | { ok: false; error: string } {
  const name = i.patientName?.trim();
  const phone = i.patientPhone?.replace(/[^\d+]/g, '');
  if (!name) return { ok: false, error: 'Patient name is required.' };
  if (!phone || phone.replace(/\D/g, '').length < 7) return { ok: false, error: 'A valid phone number is required.' };

  const { slots, reason } = getSlots(i.dentistId, i.serviceId, i.date);
  if (!slots.includes(i.time)) return { ok: false, error: reason ?? `${i.time} is not available. Free slots: ${slots.join(', ')}` };

  const service = services().find((s) => s.id === i.serviceId)!;
  const appointment: Appointment = {
    id: randomUUID(), serviceId: i.serviceId, dentistId: i.dentistId, date: i.date,
    start: i.time, end: toTime(toMin(i.time) + service.durationMin),
    patientName: name, patientPhone: phone, status: 'booked', createdAt: new Date().toISOString(),
  };
  saveAppointments([...appointments(), appointment]);
  return { ok: true, appointment };
}
