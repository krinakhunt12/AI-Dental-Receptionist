import type Anthropic from '@anthropic-ai/sdk';
import { dentists, services } from './db';
import { search, type Hit } from './rag/store';
import { book, getSlots } from './scheduling';

/** Collected per request so the UI can show what the agent did and which documents it used. */
export type ToolContext = { sources: Hit[]; toolsUsed: string[]; escalated: boolean };

export const toolDefs: Anthropic.Tool[] = [
  {
    name: 'search_knowledge',
    description:
      'Search the clinic knowledge base (policies, FAQ, hours, location, parking, insurance, pre/post-treatment instructions). Use for any clinic question not answered by list_services or list_dentists.',
    input_schema: { type: 'object', properties: { query: { type: 'string', description: 'Self-contained search query' } }, required: ['query'] },
  },
  {
    name: 'list_services',
    description: 'List bookable services with exact prices (INR), durations and which dentists perform them. Use for price and duration questions.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'list_dentists',
    description: 'List dentists with specialization and weekly working hours (days: 0=Sunday ... 6=Saturday).',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'check_availability',
    description: 'Get free appointment start times for a dentist, service and date.',
    input_schema: {
      type: 'object',
      properties: {
        dentist_id: { type: 'string' },
        service_id: { type: 'string' },
        date: { type: 'string', description: 'YYYY-MM-DD' },
      },
      required: ['dentist_id', 'service_id', 'date'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book an appointment. Only call after the patient has confirmed service, dentist, date, time, full name and phone number.',
    input_schema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
        dentist_id: { type: 'string' },
        date: { type: 'string', description: 'YYYY-MM-DD' },
        time: { type: 'string', description: 'HH:mm, 24-hour' },
        patient_name: { type: 'string' },
        patient_phone: { type: 'string' },
      },
      required: ['service_id', 'dentist_id', 'date', 'time', 'patient_name', 'patient_phone'],
    },
  },
  {
    name: 'transfer_to_receptionist',
    description: 'Hand the conversation to a human. Use for emergencies, complaints, clinical questions, or anything you cannot resolve.',
    input_schema: { type: 'object', properties: { reason: { type: 'string' } }, required: ['reason'] },
  },
];

const LABELS: Record<string, string> = {
  search_knowledge: 'Searched knowledge base',
  list_services: 'Checked services & prices',
  list_dentists: 'Checked dentists',
  check_availability: 'Checked availability',
  book_appointment: 'Booked appointment',
  transfer_to_receptionist: 'Transferred to receptionist',
};

export async function runTool(name: string, input: Record<string, any>, ctx: ToolContext): Promise<unknown> {
  const label = LABELS[name] ?? name;
  if (!ctx.toolsUsed.includes(label)) ctx.toolsUsed.push(label);

  switch (name) {
    case 'search_knowledge': {
      const hits = await search(String(input.query ?? ''), 4);
      ctx.sources.push(...hits);
      return hits.length ? hits.map((h) => ({ source: h.source, text: h.text })) : { result: 'No relevant information found.' };
    }
    case 'list_services':
      return services();
    case 'list_dentists':
      return dentists();
    case 'check_availability':
      return getSlots(String(input.dentist_id), String(input.service_id), String(input.date));
    case 'book_appointment': {
      const r = book({
        serviceId: String(input.service_id), dentistId: String(input.dentist_id), date: String(input.date),
        time: String(input.time), patientName: String(input.patient_name), patientPhone: String(input.patient_phone),
      });
      return r.ok ? { booked: true, appointment: r.appointment } : { booked: false, error: r.error };
    }
    case 'transfer_to_receptionist':
      ctx.escalated = true;
      console.log('[handoff]', input.reason);
      return { transferred: true, note: 'A receptionist has been notified and will contact the patient.' };
    default:
      return { error: `Unknown tool ${name}` };
  }
}
