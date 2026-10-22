import { addDays, format } from 'date-fns';
import { getService, services } from '../data/services';
import { dentists } from '../data/dentists';
import type { Appointment, Dentist } from './types';

export interface ChatSlot {
  id: string;
  date: string;
  dateLabel: string;
  time: string;
  timeLabel: string;
}

export type ChatPayload =
  | { type: 'slots'; slots: ChatSlot[]; heading: string }
  | { type: 'appointment'; appointment: Appointment }
  | { type: 'dentist'; dentist: Dentist }
  | { type: 'emergency' }
  | { type: 'handoff'; status: 'connecting' | 'connected' };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  payload?: ChatPayload;
}

export interface ChatReply {
  text: string;
  payload?: ChatPayload;
  suggestions?: string[];
}

export const quickReplies = [
  'Book appointment',
  'Opening hours',
  'Service prices',
  'Talk to receptionist',
];

const EMERGENCY_PATTERNS = [
  /severe bleed/i,
  /uncontrolled bleed/i,
  /heavy bleed/i,
  /won'?t stop bleed/i,
  /bleeding (a lot|badly)/i,
  /facial swell/i,
  /face is swell/i,
  /swelling/i,
  /difficulty breathing/i,
  /can'?t breathe/i,
  /cannot breathe/i,
  /trouble breathing/i,
  /knocked out/i,
  /severe injury/i,
  /serious injury/i,
  /severe trauma/i,
  /broken jaw/i,
];

export function detectEmergency(text: string) {
  return EMERGENCY_PATTERNS.some((pattern) => pattern.test(text));
}

function mentionsService(text: string) {
  const normalised = text.toLowerCase();
  return services.find((service) => {
    const words = service.name.toLowerCase().split(' ');
    const keyword = words[words.length - 1];
    return normalised.includes(keyword) || normalised.includes(service.name.toLowerCase());
  });
}

function buildSuggestedSlots(): ChatSlot[] {
  const tomorrow = addDays(new Date(), 1);
  const candidates = ['10:00', '11:30', '16:00', '17:00', '18:30'];
  return candidates.map((time) => {
    const [h, m] = time.split(':').map(Number);
    return {
      id: `${format(tomorrow, 'yyyy-MM-dd')}-${time}`,
      date: format(tomorrow, 'yyyy-MM-dd'),
      dateLabel: format(tomorrow, 'EEE, d MMM'),
      time,
      timeLabel: `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`,
    };
  });
}

const GREETING =
  "Hi! I'm the SmileCare assistant. I can book appointments, share prices and opening hours, and answer questions about our treatments — any hour of the day. What can I help you with?";

const EMERGENCY_REPLY =
  "This sounds like it needs urgent attention, and I'm not able to help with treatment decisions. Please call emergency services or go to the nearest emergency room right away if you have severe bleeding, major facial swelling, difficulty breathing or a serious injury. If it's urgent but not life-threatening, call our clinic and press 1 for the on-call dentist.";

/**
 * Mock conversation engine.
 *
 * Replace the body of this function with a call to the AI backend
 * (`POST /api/ai/chat`) — the returned `ChatReply` shape is the contract.
 */
export async function sendMessage(text: string): Promise<ChatReply> {
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 700));

  const normalised = text.trim().toLowerCase();

  if (!normalised) {
    return { text: GREETING, suggestions: quickReplies };
  }

  if (detectEmergency(text)) {
    return {
      text: EMERGENCY_REPLY,
      payload: { type: 'emergency' },
    };
  }

  if (/(receptionist|human|person|talk to someone|call me|speak to)/i.test(normalised)) {
    return {
      text: 'Of course — connecting you to our front desk now. Someone usually picks up in under a minute during clinic hours.',
      payload: { type: 'handoff', status: 'connecting' },
    };
  }

  if (/(hello|hi|hey|namaste|good (morning|afternoon|evening))/i.test(normalised) && normalised.length < 24) {
    return { text: GREETING, suggestions: quickReplies };
  }

  if (/(book|appointment|schedule|slot|come in|visit)/i.test(normalised)) {
    const service = mentionsService(text);
    const name = service?.name ?? 'a cleaning';
    return {
      text: `Happy to help with ${name.toLowerCase()}. Here are a few slots we still have open tomorrow — pick one and I'll hold it for you while we note your details.`,
      payload: {
        type: 'slots',
        heading: 'Available tomorrow',
        slots: buildSuggestedSlots(),
      },
      suggestions: ['Something later', 'Talk to receptionist'],
    };
  }

  if (/(price|cost|charge|fee|how much|charges|rate|pricing)/i.test(normalised)) {
    const service = mentionsService(text);
    if (service) {
      return {
        text: `${service.name} starts at ₹${service.priceInr.toLocaleString('en-IN')} and takes about ${service.durationMin} minutes. ${service.priceNote ?? 'Final price is confirmed after an examination.'}`,
        suggestions: ['Book appointment', 'Opening hours'],
      };
    }
    const top = services.slice(0, 4).map((item) => `${item.name} — ₹${item.priceInr.toLocaleString('en-IN')}`).join(' · ');
    return {
      text: `Here are our most-requested prices: ${top}. Ask me about any treatment by name and I'll give you the exact figure.`,
      suggestions: ['Book appointment', 'Talk to receptionist'],
    };
  }

  if (/(hour|open|opening|close|closing|today|tomorrow|weekend|time)/i.test(normalised)) {
    return {
      text: 'We are open Monday to Friday from 9:00 AM to 8:00 PM and Saturday from 9:00 AM to 6:00 PM. Sunday and public holidays are by appointment, usually for emergencies. Evening slots between 5 and 7 PM fill fastest, so it is worth booking a day or two ahead.',
      suggestions: ['Book appointment', 'Service prices'],
    };
  }

  if (/(dentist|doctor|who will|which dentist|specialist)/i.test(normalised)) {
    const dentist = dentists[0];
    return {
      text: `We have three dentists at the clinic. ${dentist.name} handles general and restorative dentistry, and is the right choice for most cleanings, fillings and root canals.`,
      payload: { type: 'dentist', dentist },
      suggestions: ['Book appointment', 'Opening hours'],
    };
  }

  if (/(pain|ache|hurt|medicine|medication|tablet|antibiotic|paracetamol)/i.test(normalised)) {
    return {
      text: "I'm sorry you're hurting. I can't diagnose or suggest medicines — that needs a dentist. I can book you in for the soonest slot, and if you have severe bleeding, facial swelling or difficulty breathing please treat it as an emergency and call us on +91 98765 43210.",
      suggestions: ['Book appointment', 'Talk to receptionist'],
    };
  }

  if (/(cleaning|whitening|braces|implant|root canal|filling|extraction|checkup)/i.test(normalised)) {
    const service = mentionsService(text) ?? getService('cleaning');
    return {
      text: `${service?.name ?? 'That treatment'} is ₹${(service?.priceInr ?? 800).toLocaleString('en-IN')} and takes about ${service?.durationMin ?? 30} minutes. Shall I find you a slot?`,
      suggestions: ['Book appointment', 'Opening hours'],
    };
  }

  if (/(thanks|thank you|great|perfect|awesome|bye|goodbye)/i.test(normalised)) {
    return {
      text: "You're very welcome. If anything else comes up — a reschedule, a price question, or a worry before your visit — I am here around the clock.",
      suggestions: quickReplies,
    };
  }

  return {
    text: "I can help with booking appointments, prices, opening hours, parking and our dentists. If it is a medical question, I'll pass you to the front desk so a dentist can help directly.",
    suggestions: quickReplies,
  };
}
