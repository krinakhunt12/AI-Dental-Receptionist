import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify from 'fastify';
import { extractText, getDocumentProxy } from 'unpdf';
import { chat, type ChatMsg } from './agent';
import { config } from './config';
import {
  appointments,
  saveAppointments,
  services,
  dentists,
  patients,
  savePatients,
  conversations,
  saveConversations,
  users,
  saveUsers,
  sessions,
  saveSessions,
  type Status,
  type Patient,
  type ConversationLog,
  type User,
  type UserRole,
} from './db';
import { book, getSlots } from './scheduling';
import { addDocument, initStore, listDocuments, removeDocument, search } from './rag/store';
import { randomUUID } from 'node:crypto';

const app = Fastify({ logger: { level: 'info' } });
await app.register(cors, { origin: true });
await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

/** Health Check Endpoint */
app.get('/api/health', async () => ({
  ok: true,
  clinic: config.clinicName,
  llm: config.anthropicKey ? config.model : 'demo (no ANTHROPIC_API_KEY)',
  retrieval: config.embeddingProvider,
}));

// ---- Authentication Endpoints ----
app.post('/api/auth/login', async (req, reply) => {
  const { email, password } = (req.body as { email?: string; password?: string }) || {};
  if (!email || !password) return reply.code(400).send({ error: 'Email and password are required.' });

  const allUsers = users();
  const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== password) {
    return reply.code(401).send({ error: 'Invalid email or password.' });
  }

  const token = `tok_${randomUUID()}`;
  const allSessions = sessions();
  const newSession = { token, userId: user.id, createdAt: new Date().toISOString() };
  saveSessions([newSession, ...allSessions]);

  const { passwordHash: _, ...userClean } = user;
  return { token, user: userClean };
});

app.post('/api/auth/register', async (req, reply) => {
  const { name, email, password, role, phone } = (req.body as { name?: string; email?: string; password?: string; role?: UserRole; phone?: string }) || {};
  if (!name || !email || !password) {
    return reply.code(400).send({ error: 'Name, email, and password are required.' });
  }

  const allUsers = users();
  if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return reply.code(409).send({ error: 'An account with this email already exists.' });
  }

  const newUser: User = {
    id: `usr_${randomUUID().slice(0, 8)}`,
    name,
    email,
    passwordHash: password,
    role: role || 'patient',
    phone: phone || '',
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...allUsers, newUser]);

  const token = `tok_${randomUUID()}`;
  const allSessions = sessions();
  const newSession = { token, userId: newUser.id, createdAt: new Date().toISOString() };
  saveSessions([newSession, ...allSessions]);

  const { passwordHash: _, ...userClean } = newUser;
  return reply.code(201).send({ token, user: userClean });
});

app.get('/api/auth/me', async (req, reply) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.query as { token?: string })?.token;

  if (!token) return reply.code(401).send({ error: 'Missing auth token.' });

  const session = sessions().find((s) => s.token === token);
  if (!session) return reply.code(401).send({ error: 'Invalid or expired session token.' });

  const user = users().find((u) => u.id === session.userId);
  if (!user) return reply.code(404).send({ error: 'User not found.' });

  const { passwordHash: _, ...userClean } = user;
  return { user: userClean };
});

app.post('/api/auth/logout', async (req, reply) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.body as { token?: string })?.token;
  if (token) {
    const remaining = sessions().filter((s) => s.token !== token);
    saveSessions(remaining);
  }
  return { ok: true };
});

/** System & Analytics Statistics Summary Endpoint */
app.get('/api/stats', async () => {
  const appts = appointments();
  const docs = listDocuments();
  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0);

  return {
    totalAppointments: appts.length,
    bookedAppointments: appts.filter((a) => a.status === 'booked').length,
    completedAppointments: appts.filter((a) => a.status === 'completed').length,
    cancelledAppointments: appts.filter((a) => a.status === 'cancelled').length,
    noShowAppointments: appts.filter((a) => a.status === 'no_show').length,
    totalServices: services().length,
    totalDentists: dentists().length,
    totalPatients: patients().length,
    totalConversations: conversations().length,
    totalDocuments: docs.length,
    totalPassages: totalChunks,
  };
});

// ---- Chat Agent Endpoint ----
app.post('/api/chat', async (req, reply) => {
  const msgs = (req.body as { messages?: ChatMsg[] })?.messages;
  const valid =
    Array.isArray(msgs) && msgs.length > 0 && msgs.length <= 40 &&
    msgs.every((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.length > 0 && m.content.length <= 2000);
  if (!valid) return reply.code(400).send({ error: 'Send { messages: [{ role, content }] } (max 40 messages, 2000 chars each).' });
  try {
    return await chat(msgs);
  } catch (e) {
    req.log.error(e);
    return reply.code(500).send({ error: e instanceof Error ? e.message : 'Chat failed' });
  }
});

// ---- Knowledge base (RAG) Endpoints ----
app.get('/api/knowledge', async () => listDocuments());

app.post('/api/knowledge', async (req, reply) => {
  const file = await req.file();
  if (!file) return reply.code(400).send({ error: 'No file uploaded.' });
  const buf = await file.toBuffer();
  const ext = file.filename.split('.').pop()?.toLowerCase();
  try {
    let text: string;
    if (ext === 'pdf') {
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      text = (await extractText(pdf, { mergePages: true })).text;
    } else if (ext === 'md' || ext === 'txt') {
      text = buf.toString('utf8');
    } else {
      return reply.code(400).send({ error: 'Upload a .pdf, .md or .txt file.' });
    }
    return await addDocument(file.filename, text);
  } catch (e) {
    return reply.code(422).send({ error: e instanceof Error ? e.message : 'Could not process file.' });
  }
});

app.delete('/api/knowledge/:id', async (req, reply) =>
  removeDocument((req.params as { id: string }).id) ? { ok: true } : reply.code(404).send({ error: 'Not found' }));

app.get('/api/knowledge/search', async (req) => search(String((req.query as { q?: string }).q ?? ''), 4));

// ---- Availability Check Endpoint ----
app.get('/api/availability', async (req, reply) => {
  const { dentistId, serviceId, date } = req.query as { dentistId?: string; serviceId?: string; date?: string };
  if (!dentistId || !serviceId || !date) {
    return reply.code(400).send({ error: 'Missing parameters. Provide ?dentistId=...&serviceId=...&date=YYYY-MM-DD' });
  }
  return getSlots(dentistId, serviceId, date);
});

// ---- Appointments API Endpoints ----
app.get('/api/appointments', async () => {
  const sv = services(), dn = dentists();
  return appointments()
    .map((a) => ({ ...a, serviceName: sv.find((s) => s.id === a.serviceId)?.name, dentistName: dn.find((d) => d.id === a.dentistId)?.name }))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
});

app.post('/api/appointments', async (req, reply) => {
  const body = req.body as {
    serviceId?: string;
    dentistId?: string;
    date?: string;
    time?: string;
    patientName?: string;
    patientPhone?: string;
  };

  if (!body.serviceId || !body.dentistId || !body.date || !body.time || !body.patientName || !body.patientPhone) {
    return reply.code(400).send({ error: 'Missing required fields: serviceId, dentistId, date, time, patientName, patientPhone.' });
  }

  const result = book({
    serviceId: body.serviceId,
    dentistId: body.dentistId,
    date: body.date,
    time: body.time,
    patientName: body.patientName,
    patientPhone: body.patientPhone,
  });

  if (!result.ok) {
    return reply.code(400).send({ error: result.error });
  }

  // Auto-sync patient directory
  const currentPatients = patients();
  const existingPatient = currentPatients.find((p) => p.phone === body.patientPhone);
  if (!existingPatient) {
    const newPat: Patient = {
      id: randomUUID(),
      name: body.patientName,
      phone: body.patientPhone,
      email: `${body.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      preferredDentist: body.dentistId,
      totalAppointments: 1,
      createdAt: new Date().toISOString(),
    };
    savePatients([...currentPatients, newPat]);
  } else {
    existingPatient.totalAppointments += 1;
    savePatients(currentPatients);
  }

  return reply.code(201).send(result.appointment);
});

app.patch('/api/appointments/:id', async (req, reply) => {
  const status = (req.body as { status?: Status })?.status;
  if (!status || !['booked', 'completed', 'cancelled', 'no_show'].includes(status)) return reply.code(400).send({ error: 'Invalid status.' });
  const all = appointments();
  const a = all.find((x) => x.id === (req.params as { id: string }).id);
  if (!a) return reply.code(404).send({ error: 'Not found' });
  a.status = status;
  saveAppointments(all);
  return a;
});

app.delete('/api/appointments/:id', async (req, reply) => {
  const id = (req.params as { id: string }).id;
  const all = appointments();
  const index = all.findIndex((x) => x.id === id);
  if (index === -1) return reply.code(404).send({ error: 'Appointment not found' });
  const [removed] = all.splice(index, 1);
  saveAppointments(all);
  return { ok: true, removed };
});

// ---- Patients Directory API Endpoints ----
app.get('/api/patients', async () => patients());

app.post('/api/patients', async (req, reply) => {
  const body = req.body as { name?: string; phone?: string; email?: string; preferredDentist?: string };
  if (!body.name || !body.phone) return reply.code(400).send({ error: 'Patient name and phone are required.' });

  const all = patients();
  const newPatient: Patient = {
    id: randomUUID(),
    name: body.name,
    phone: body.phone,
    email: body.email || '',
    preferredDentist: body.preferredDentist,
    totalAppointments: 0,
    createdAt: new Date().toISOString(),
  };
  savePatients([...all, newPatient]);
  return reply.code(201).send(newPatient);
});

// ---- Conversations & Summaries API Endpoints ----
app.get('/api/conversations', async () => conversations());

app.post('/api/conversations', async (req, reply) => {
  const body = req.body as Partial<ConversationLog>;
  if (!body.patientName || !body.summary) return reply.code(400).send({ error: 'patientName and summary are required.' });

  const all = conversations();
  const newLog: ConversationLog = {
    id: randomUUID(),
    patientName: body.patientName || 'Guest',
    patientPhone: body.patientPhone || 'N/A',
    intent: body.intent || 'General Inquiry',
    summary: body.summary,
    status: body.status || 'Completed',
    date: body.date || new Date().toISOString().split('T')[0],
    time: body.time || '12:00',
    dentistName: body.dentistName || 'General Staff',
    createdAt: new Date().toISOString(),
  };
  saveConversations([newLog, ...all]);
  return reply.code(201).send(newLog);
});

// ---- Catalog & Reference Data Endpoints ----
app.get('/api/services', async () => services());

app.get('/api/services/:id', async (req, reply) => {
  const id = (req.params as { id: string }).id;
  const service = services().find((s) => s.id === id);
  if (!service) return reply.code(404).send({ error: 'Service not found' });
  return service;
});

app.get('/api/dentists', async () => dentists());

app.get('/api/dentists/:id', async (req, reply) => {
  const id = (req.params as { id: string }).id;
  const dentist = dentists().find((d) => d.id === id);
  if (!dentist) return reply.code(404).send({ error: 'Dentist not found' });
  return dentist;
});

await initStore();
await app.listen({ port: config.port, host: '0.0.0.0' });
