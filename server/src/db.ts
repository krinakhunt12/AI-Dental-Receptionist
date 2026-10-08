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

export type UserRole = 'admin' | 'receptionist' | 'dentist' | 'patient';

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/simple hashed for demo
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthSession = {
  token: string;
  userId: string;
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

// Default seed users
const DEFAULT_USERS: User[] = [
  {
    id: 'usr_receptionist_1',
    name: 'Krina Khunt',
    email: 'receptionist@smilecare.com',
    passwordHash: 'reception123',
    role: 'receptionist',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_admin_1',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@smilecare.com',
    passwordHash: 'admin123',
    role: 'admin',
    phone: '+91 98111 22233',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_dentist_1',
    name: 'Dr. Mark Rivera',
    email: 'dentist@smilecare.com',
    passwordHash: 'dentist123',
    role: 'dentist',
    phone: '+91 98222 33344',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_patient_1',
    name: 'Ananya Sharma',
    email: 'patient@smilecare.com',
    passwordHash: 'patient123',
    role: 'patient',
    phone: '+91 98333 44455',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
];

export const services = () => read<Service[]>('services.json');
export const dentists = () => read<Dentist[]>('dentists.json');
export const appointments = () => read<Appointment[]>('appointments.json');
export const saveAppointments = (a: Appointment[]) => write('appointments.json', a);

export const patients = () => read<Patient[]>('patients.json');
export const savePatients = (p: Patient[]) => write('patients.json', p);

export const conversations = () => read<ConversationLog[]>('conversations.json');
export const saveConversations = (c: ConversationLog[]) => write('conversations.json', c);

export const users = (): User[] => {
  const list = read<User[]>('users.json');
  if (!list || list.length === 0) {
    write('users.json', DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  return list;
};
export const saveUsers = (u: User[]) => write('users.json', u);

export const sessions = (): AuthSession[] => read<AuthSession[]>('sessions.json');
export const saveSessions = (s: AuthSession[]) => write('sessions.json', s);

