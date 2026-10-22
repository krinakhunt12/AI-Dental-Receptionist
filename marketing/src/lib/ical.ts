import type { Appointment } from '../api/types';

function parseTime(value: string) {
  const trimmed = value.trim();
  const meridiemMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (meridiemMatch) {
    let hours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    const meridiem = meridiemMatch[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  const [hours, minutes] = trimmed.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeText(value: string) {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

/** Builds a downloadable .ics file for the confirmed appointment. */
export function downloadAppointmentIcs(appointment: Appointment) {
  const { hours, minutes } = parseTime(appointment.time);
  const start = new Date(`${appointment.date}T00:00:00`);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start.getTime() + appointment.durationMin * 60_000);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmileCare Dental Clinic//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@smilecare.dental`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(`${appointment.serviceName} — SmileCare Dental Clinic`)}`,
    `DESCRIPTION:${escapeText(
      `${appointment.serviceName} with ${appointment.dentistName}. Booking reference ${appointment.id}.`,
    )}`,
    'LOCATION:SmileCare Dental Clinic, 3rd Floor, Aurelia Health Plaza, CG Road, Ahmedabad 380006',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `smilecare-${appointment.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
