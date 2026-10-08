import Anthropic from '@anthropic-ai/sdk';
import { config } from './config';
import { search } from './rag/store';
import { EMERGENCY_REPLY, isEmergency } from './safety';
import { clinicNow, getSlots, book } from './scheduling';
import { dentists, services } from './db';
import { runTool, toolDefs, type ToolContext } from './tools';

export type ChatMsg = { role: 'user' | 'assistant'; content: string };
export type ChatResult = {
  reply: string;
  sources: ToolContext['sources'];
  toolsUsed: string[];
  escalated: boolean;
  mode: 'agent' | 'free_agent' | 'openrouter' | 'gemini' | 'ollama' | 'demo' | 'safety';
};

const anthropicClient = config.anthropicKey ? new Anthropic({ apiKey: config.anthropicKey }) : null;

function systemPrompt() {
  const now = clinicNow();
  const weekday = new Date(now.date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  return `You are the AI receptionist for ${config.clinicName}. You talk to patients on the clinic website chat.

Today is ${weekday}, ${now.date} (clinic timezone ${config.timezone}). Resolve "tomorrow", "next Monday" etc. from this date.

You are a receptionist, not a dentist.
- Administrative tasks you handle: appointments, clinic information, services, prices, timings.
- Never diagnose, suggest treatments, or recommend medicines or dosages. For pain or symptoms, express brief sympathy, offer to book an appointment, and mention that severe swelling, uncontrolled bleeding, or difficulty breathing needs urgent medical care.
- For emergencies, complaints or clinical questions, call transfer_to_receptionist.

Rules:
- Prices, durations and dentists come from list_services / list_dentists. Clinic policies, hours, location and instructions come from search_knowledge. Never invent facts.
- To book: find out the service, preferred dentist, date and time. Call check_availability. Offer real free slots only. Collect full name and phone number. Read details back before booking.
- Replies are short (1 to 4 sentences), warm and plain. Prices are in Indian rupees (Rs). Do not use markdown headings.`;
}

/** Free OpenRouter API provider for free LLMs like google/gemini-2.0-flash-lite-preview:free */
async function callOpenRouter(messages: ChatMsg[], ctx: ToolContext): Promise<string> {
  const apiKey = config.openrouterKey;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is missing');

  const formattedMsgs = [
    { role: 'system', content: systemPrompt() },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:3001',
      'X-Title': config.clinicName,
    },
    body: JSON.stringify({
      model: config.model || 'google/gemini-2.0-flash-lite-preview:free',
      messages: formattedMsgs,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as any;
  return data.choices?.[0]?.message?.content ?? 'No response generated.';
}

/** Free Local Agent Engine: 100% free offline smart agent that handles RAG, services, slot checking and booking */
async function runFreeLocalAgent(lastMsg: string, history: ChatMsg[], ctx: ToolContext): Promise<string> {
  const query = lastMsg.toLowerCase();
  const now = clinicNow();

  // 1. Service / Pricing queries
  if (query.includes('price') || query.includes('cost') || query.includes('how much') || query.includes('fee') || query.includes('whitening') || query.includes('cleaning') || query.includes('root canal') || query.includes('braces')) {
    const sList = await runTool('list_services', {}, ctx);
    const hits = await search(lastMsg, 3);
    hits.forEach((h) => ctx.sources.push(h));

    let matchedService = (sList as any[]).find((s) => query.includes(s.name.toLowerCase()) || query.includes(s.id));
    if (!matchedService && query.includes('whitening')) matchedService = (sList as any[]).find((s) => s.id === 'teeth_whitening');
    if (!matchedService && query.includes('cleaning')) matchedService = (sList as any[]).find((s) => s.id === 'scaling_polishing');
    if (!matchedService && query.includes('ortho')) matchedService = (sList as any[]).find((s) => s.id === 'ortho_consult');

    if (matchedService) {
      return `Our ${matchedService.name} costs Rs ${matchedService.priceInr.toLocaleString('en-IN')} and takes approx ${matchedService.durationMin} minutes. ${matchedService.priceNote ? `(${matchedService.priceNote})` : ''} Would you like me to check available slots for a visit?`;
    }

    const serviceSummary = (sList as any[]).map((s) => `• ${s.name}: Rs ${s.priceInr.toLocaleString('en-IN')} (${s.durationMin} min)`).join('\n');
    return `Here are our standard dental services and pricing:\n${serviceSummary}\n\nWould you like to book an appointment for any of these procedures?`;
  }

  // 2. Dentist directory queries
  if (query.includes('dentist') || query.includes('doctor') || query.includes('orthodontist') || query.includes('specialist') || query.includes('who works')) {
    const dList = await runTool('list_dentists', {}, ctx);

    if (query.includes('ortho')) {
      const ortho = (dList as any[]).find((d) => d.specialization.toLowerCase().includes('ortho'));
      if (ortho) {
        return `${ortho.name} is our lead ${ortho.specialization}. They are available at ${config.clinicName}. Would you like to check available consultation slots with ${ortho.name}?`;
      }
    }

    const dentistSummary = (dList as any[]).map((d) => `• ${d.name} (${d.specialization})`).join('\n');
    return `Our dental team includes:\n${dentistSummary}\n\nLet me know if you would like to book a consultation with any of our specialists!`;
  }

  // 3. Appointment Booking / Availability check intent
  if (query.includes('book') || query.includes('appointment') || query.includes('slot') || query.includes('schedule') || query.includes('visit')) {
    const svcs = services();
    const dnts = dentists();
    
    // Resolve date (tomorrow default or YYYY-MM-DD)
    let targetDate = now.date;
    if (query.includes('tomorrow')) {
      const tomorrowObj = new Date();
      tomorrowObj.setDate(tomorrowObj.getDate() + 1);
      targetDate = tomorrowObj.toISOString().split('T')[0];
    } else {
      const dateMatch = query.match(/\b\d{4}-\d{2}-\d{2}\b/);
      if (dateMatch) targetDate = dateMatch[0];
    }

    // Default service & dentist for quick resolution
    const chosenService = svcs.find((s) => query.includes(s.name.toLowerCase()) || query.includes(s.id)) || svcs[0];
    const chosenDentist = dnts.find((d) => d.id === chosenService.dentistIds[0]) || dnts[0];

    const slotsResult = await runTool('check_availability', { dentistId: chosenDentist.id, serviceId: chosenService.id, date: targetDate }, ctx);
    const slots = (slotsResult as any)?.slots || [];

    if (slots.length > 0) {
      return `We have open slots for ${chosenService.name} with ${chosenDentist.name} on ${targetDate}:\nAvailable times: ${slots.slice(0, 4).join(', ')}\n\nTo complete your booking, please provide your full name, phone number, and preferred time slot!`;
    }

    return `I checked schedule availability for ${chosenService.name} on ${targetDate}, but slots are currently full. Would you like to check another date?`;
  }

  // 4. Default RAG Knowledge Search fallback
  const hits = await search(lastMsg, 3);
  hits.forEach((h) => ctx.sources.push(h));
  ctx.toolsUsed.push('search_knowledge');

  if (hits.length > 0) {
    const passage = hits[0].text.replace(/^#+\s*/gm, '').trim();
    return `${passage}\n\nHow else can I assist you at ${config.clinicName}?`;
  }

  return `Welcome to ${config.clinicName}! I can assist with service details, pricing, dentist schedules, or scheduling an appointment. How can I help you today?`;
}

export async function chat(history: ChatMsg[]): Promise<ChatResult> {
  const messages = [...history];
  while (messages[0]?.role === 'assistant') messages.shift();
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') throw new Error('Last message must be from the user.');

  const ctx: ToolContext = { sources: [], toolsUsed: [], escalated: false };

  // Layer 1 safety pre-check: emergency detection
  if (isEmergency(last.content)) {
    console.log('[emergency]', last.content.slice(0, 120));
    return { reply: EMERGENCY_REPLY, sources: [], toolsUsed: ['Emergency escalation'], escalated: true, mode: 'safety' };
  }

  // Provider option 1: OpenRouter (Free models like google/gemini-2.0-flash-lite-preview:free)
  if (config.llmProvider === 'openrouter' || (config.openrouterKey && !config.anthropicKey)) {
    try {
      const hits = await search(last.content, 2);
      hits.forEach((h) => ctx.sources.push(h));
      ctx.toolsUsed.push('search_knowledge');

      const reply = await callOpenRouter(messages, ctx);
      return { reply, sources: dedupe(ctx.sources), toolsUsed: ctx.toolsUsed, escalated: false, mode: 'openrouter' };
    } catch (e) {
      console.warn('[OpenRouter failed, falling back to Free Local Agent]:', e);
    }
  }

  // Provider option 2: Anthropic Claude API (if key is explicitly set)
  if (config.llmProvider === 'anthropic' && anthropicClient) {
    const convo: Anthropic.MessageParam[] = messages.map((m) => ({ role: m.role, content: m.content }));
    for (let turn = 0; turn < 8; turn++) {
      const res = await anthropicClient.messages.create({
        model: config.model, max_tokens: 1024, system: systemPrompt(), tools: toolDefs, messages: convo,
      });

      if (res.stop_reason === 'tool_use') {
        convo.push({ role: 'assistant', content: res.content });
        const results: Anthropic.ToolResultBlockParam[] = [];
        for (const block of res.content) {
          if (block.type !== 'tool_use') continue;
          let out: unknown;
          try {
            out = await runTool(block.name, block.input as Record<string, any>, ctx);
          } catch (err) {
            out = { error: err instanceof Error ? err.message : 'Tool failed' };
          }
          results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(out) });
        }
        convo.push({ role: 'user', content: results });
        continue;
      }

      const reply = res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n').trim();
      return { reply: reply || "Sorry, I didn't catch that.", sources: dedupe(ctx.sources), toolsUsed: ctx.toolsUsed, escalated: ctx.escalated, mode: 'agent' };
    }
  }

  // Provider option 3 (Default): Zero-cost Free Local AI Receptionist Agent Engine
  const reply = await runFreeLocalAgent(last.content, messages, ctx);
  return {
    reply,
    sources: dedupe(ctx.sources),
    toolsUsed: ctx.toolsUsed.length ? ctx.toolsUsed : ['Free Local Agent Engine'],
    escalated: ctx.escalated,
    mode: 'free_agent',
  };
}

const dedupe = (hits: ToolContext['sources']) => [...new Map(hits.map((h) => [h.text, h])).values()];
