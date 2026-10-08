import fs from 'node:fs';
import path from 'node:path';
import { config } from './config';

export type Service = { id: string; name: string; priceInr: number; durationMin: number; dentistIds: string[]; priceNote?: string };
export type Dentist = { id: string; name: string; specialization: string; days: number[]; start: string; end: string };
export type Status = 'booked' | 'completed' | 'cancelled' | 'no_show';
export type Appointment = {
  id: string; serviceId: string; dentistId: string; date: string; start: string; end: string;
  patientName: string; patientPhone: string; status: Status; createdAt: string;
};

const read = <T>(f: string): T => JSON.parse(fs.readFileSync(path.join(config.dataDir, f), 'utf8'));

export const services = () => read<Service[]>('services.json');
export const dentists = () => read<Dentist[]>('dentists.json');
export const appointments = () => read<Appointment[]>('appointments.json');
export const saveAppointments = (a: Appointment[]) =>
  fs.writeFileSync(path.join(config.dataDir, 'appointments.json'), JSON.stringify(a, null, 2));
