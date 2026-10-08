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
  totalDocuments: number;
  totalPassages: number;
};

export type Health = { ok: boolean; clinic: string; llm: string; retrieval: string };

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? res.statusText);
  return data as T;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const api = {
  health: () => fetch('/api/health').then((r) => parse<Health>(r)),
  stats: () => fetch('/api/stats').then((r) => parse<Stats>(r)),
  chat: (messages: Msg[]) => fetch('/api/chat', json('POST', { messages })).then((r) => parse<ChatResponse>(r)),
  
  docs: () => fetch('/api/knowledge').then((r) => parse<Doc[]>(r)),
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return fetch('/api/knowledge', { method: 'POST', body: fd }).then((r) => parse<Doc>(r));
  },
  deleteDoc: (id: string) => fetch(`/api/knowledge/${id}`, { method: 'DELETE' }).then((r) => parse<{ ok: true }>(r)),
  search: (q: string) => fetch(`/api/knowledge/search?q=${encodeURIComponent(q)}`).then((r) => parse<Source[]>(r)),
  
  appointments: () => fetch('/api/appointments').then((r) => parse<Appt[]>(r)),
  createAppointment: (data: { serviceId: string; dentistId: string; date: string; time: string; patientName: string; patientPhone: string }) =>
    fetch('/api/appointments', json('POST', data)).then((r) => parse<Appt>(r)),
  setStatus: (id: string, status: Status) =>
    fetch(`/api/appointments/${id}`, json('PATCH', { status })).then((r) => parse<Appt>(r)),
  deleteAppointment: (id: string) =>
    fetch(`/api/appointments/${id}`, { method: 'DELETE' }).then((r) => parse<{ ok: true }>(r)),
  
  services: () => fetch('/api/services').then((r) => parse<Service[]>(r)),
  dentists: () => fetch('/api/dentists').then((r) => parse<Dentist[]>(r)),
};
