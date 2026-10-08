import fs from 'node:fs';
import path from 'node:path';
import { config } from './config';

export type Service = { id: string; name: string; priceInr: number; durationMin: number; dentistIds: string[]; priceNote?: string };
export type Dentist = { id: string; name: string; specialization: string; days: number[]; start: string; end: string };
export type Status = 'booked' | 'completed' | 'cancelled' | 'no_show';

export type Appointment = {
  id: string;
  serviceId: string;
  dentistId: string;
  date: string;
  start: string;
  end: string;
  patientName: string;
  patientPhone: string;
  status: Status;
  createdAt: string;
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob?: string;
  preferredDentist?: string;
  totalAppointments: number;
  createdAt: string;
};

export type ConversationLog = {
  id: string;
  patientName: string;
  patientPhone: string;
  intent: string;
  summary: string;
  status: string;
  date: string;
  time: string;
  dentistName: string;
  createdAt: string;
};

const read = <T>(f: string): T => {
  const p = path.join(config.dataDir, f);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};

const write = <T>(f: string, data: T) => {
  fs.writeFileSync(path.join(config.dataDir, f), JSON.stringify(data, null, 2));
};

export const services = () => read<Service[]>('services.json');
export const dentists = () => read<Dentist[]>('dentists.json');
export const appointments = () => read<Appointment[]>('appointments.json');
export const saveAppointments = (a: Appointment[]) => write('appointments.json', a);

export const patients = () => read<Patient[]>('patients.json');
export const savePatients = (p: Patient[]) => write('patients.json', p);

export const conversations = () => read<ConversationLog[]>('conversations.json');
export const saveConversations = (c: ConversationLog[]) => write('conversations.json', c);
