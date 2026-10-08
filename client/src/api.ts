export type UserRole = 'admin' | 'receptionist' | 'dentist' | 'patient';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Msg = { role: 'user' | 'assistant'; content: string };
export type Source = { source: string; text: string; score: number };
export type ChatResponse = {
  reply: string;
  sources: Source[];
  toolsUsed: string[];
  escalated: boolean;
  mode: 'agent' | 'free_agent' | 'openrouter' | 'gemini' | 'ollama' | 'demo' | 'safety';
};

export type Doc = { id: string; name: string; chars: number; chunks: number; addedAt: string };
export type Status = 'booked' | 'completed' | 'cancelled' | 'no_show';

export type Appt = {
  id: string;
  date: string;
  start: string;
  end: string;
  patientName: string;
  patientPhone: string;
  status: Status;
  serviceId?: string;
  dentistId?: string;
  serviceName?: string;
  dentistName?: string;
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

export type Service = {
  id: string;
  name: string;
  priceInr: number;
  durationMin: number;
  dentistIds: string[];
  priceNote?: string;
};

export type Dentist = {
  id: string;
  name: string;
  specialization: string;
  days: number[];
  start: string;
  end: string;
};

export type Stats = {
  totalAppointments: number;
  bookedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalServices: number;
  totalDentists: number;
  totalPatients: number;
  totalConversations: number;
  totalDocuments: number;
  totalPassages: number;
};

export type Health = { ok: boolean; clinic: string; llm: string; retrieval: string };

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? res.statusText);
  return data as T;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('smilecare_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  },
  body: JSON.stringify(body),
});

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetch('/api/auth/login', json('POST', { email, password })).then((r) => parse<AuthResponse>(r)),
  register: (data: { name: string; email: string; password: string; role?: UserRole; phone?: string }) =>
    fetch('/api/auth/register', json('POST', data)).then((r) => parse<AuthResponse>(r)),
  me: () =>
    fetch('/api/auth/me', { headers: { ...getAuthHeaders() } }).then((r) => parse<{ user: User }>(r)),
  logout: () =>
    fetch('/api/auth/logout', json('POST', {})).then((r) => parse<{ ok: boolean }>(r)),

  health: () => fetch('/api/health').then((r) => parse<Health>(r)),
  stats: () => fetch('/api/stats', { headers: getAuthHeaders() }).then((r) => parse<Stats>(r)),
  chat: (messages: Msg[]) => fetch('/api/chat', json('POST', { messages })).then((r) => parse<ChatResponse>(r)),

  docs: () => fetch('/api/knowledge', { headers: getAuthHeaders() }).then((r) => parse<Doc[]>(r)),
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return fetch('/api/knowledge', { method: 'POST', headers: getAuthHeaders(), body: fd }).then((r) => parse<Doc>(r));
  },
  deleteDoc: (id: string) => fetch(`/api/knowledge/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then((r) => parse<{ ok: true }>(r)),
  search: (q: string) => fetch(`/api/knowledge/search?q=${encodeURIComponent(q)}`, { headers: getAuthHeaders() }).then((r) => parse<Source[]>(r)),

  appointments: () => fetch('/api/appointments', { headers: getAuthHeaders() }).then((r) => parse<Appt[]>(r)),
  createAppointment: (data: { serviceId: string; dentistId: string; date: string; time: string; patientName: string; patientPhone: string }) =>
    fetch('/api/appointments', json('POST', data)).then((r) => parse<Appt>(r)),
  setStatus: (id: string, status: Status) =>
    fetch(`/api/appointments/${id}`, json('PATCH', { status })).then((r) => parse<Appt>(r)),
  deleteAppointment: (id: string) =>
    fetch(`/api/appointments/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then((r) => parse<{ ok: true }>(r)),

  patients: () => fetch('/api/patients', { headers: getAuthHeaders() }).then((r) => parse<Patient[]>(r)),
  conversations: () => fetch('/api/conversations', { headers: getAuthHeaders() }).then((r) => parse<ConversationLog[]>(r)),

  services: () => fetch('/api/services', { headers: getAuthHeaders() }).then((r) => parse<Service[]>(r)),
  dentists: () => fetch('/api/dentists', { headers: getAuthHeaders() }).then((r) => parse<Dentist[]>(r)),
};

export * from './api/queryKeys';

