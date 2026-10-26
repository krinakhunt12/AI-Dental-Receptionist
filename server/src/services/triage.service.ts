import { EscalationAction } from '@prisma/client';
import { prisma } from '../prisma.js';
import { CareProtocolService } from './careProtocol.service.js';
import { ApiError } from '../utils/apiError.js';

export interface TriageInput {
  clinicId?: string;
  patientId?: string;
  appointmentId?: string;
  message: string;
}

export interface TriageOutput {
  reply: string;
  urgency: 'NONE' | 'CONTACT_CLINIC' | 'EMERGENCY';
  escalated: boolean;
  symptomKeys: string[];
  appointmentId: string | null;
  patientId: string | null;
}

/**
 * Mask sensitive PII from message for triage storage compliance.
 */
export function redactTriageMessage(text: string): string {
  if (!text) return '';
  return text
    // Redact email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email redacted]')
    // Redact phone numbers and sequences of 7+ digits
    .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[phone redacted]')
    .replace(/\b\d{7,15}\b/g, '[number redacted]');
}

export class TriageService {
  /**
   * Evaluates patient message against safety rules, runs classifier,
   * generates grounded response strictly from approved instructions, and verifies output.
   */
  static async handleMessage(input: TriageInput): Promise<TriageOutput> {
    const rawMessage = (input.message || '').trim();
    if (!rawMessage) {
      throw ApiError.badRequest('Message text is required');
    }

    // --- RETRIEVAL FIRST ---
    // 1. Resolve Appointment and Patient
    let appointment: any = null;
    let patientId = input.patientId || null;
    let clinicId = input.clinicId || null;

    if (input.appointmentId) {
      appointment = await prisma.appointment.findFirst({
        where: { id: input.appointmentId, deletedAt: null },
        include: {
          clinic: true,
          patient: true,
        },
      });
      if (appointment) {
        clinicId = appointment.clinicId;
        patientId = appointment.patientId;
      }
    } else if (patientId) {
      // Find patient's most recent completed or upcoming appointment
      appointment = await prisma.appointment.findFirst({
        where: {
          patientId,
          deletedAt: null,
          status: { in: ['COMPLETED', 'CONFIRMED', 'SCHEDULED', 'IN_PROGRESS'] },
        },
        orderBy: { startTime: 'desc' },
        include: {
          clinic: true,
          patient: true,
        },
      });
      if (appointment) {
        clinicId = appointment.clinicId;
      }
    }

    // Resolve Clinic
    let clinic: any = null;
    if (clinicId) {
      clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
    } else if (appointment?.clinic) {
      clinic = appointment.clinic;
      clinicId = clinic.id;
    }

    const clinicPhone = clinic?.phone || '+1-555-0199';
    const emergencyPhone = clinic?.emergencyPhone || clinicPhone;

    // If no approved appointment or protocol exists, reply with generic fallback
    if (!appointment || !clinicId) {
      return {
        reply: `We cannot find a recent dental visit on file. For medical advice or aftercare questions, please contact our clinic directly at ${clinicPhone}.\n\nNote: This is general guidance and the clinic can be contacted for concerns.`,
        urgency: 'NONE',
        escalated: false,
        symptomKeys: [],
        appointmentId: null,
        patientId,
      };
    }

    // Load care plan strictly for this appointment (APPROVED protocols only)
    const carePlan = await CareProtocolService.getCarePlanForAppointment(clinicId, appointment.id);

    if (!carePlan || !carePlan.protocolId || carePlan.instructions.length === 0) {
      return {
        reply: `There is no approved aftercare protocol currently on record for this procedure. Please contact our clinic directly at ${clinicPhone} for personalized instructions.\n\nNote: This is general guidance and the clinic can be contacted for concerns.`,
        urgency: 'NONE',
        escalated: false,
        symptomKeys: [],
        appointmentId: appointment.id,
        patientId,
      };
    }

    const escalationRules = carePlan.escalationRules || [];

    // --- STEP 1: SAFETY CLASSIFIER (BEFORE ANY ANSWER IS GENERATED) ---
    // A) Deterministic Keyword / Symptom Matching
    const matchedSymptomKeys: string[] = [];
    let deterministicUrgency: 'NONE' | 'CONTACT_CLINIC' | 'EMERGENCY' = 'NONE';
    let matchedRule: any = null;

    const lowerMessage = rawMessage.toLowerCase();

    // High-risk emergency keywords
    const emergencyKeywords = [
      'heavy bleeding',
      'bleeding profusely',
      'uncontrolled bleeding',
      'choking',
      'difficulty breathing',
      'cannot breathe',
      'chest pain',
      'allergic reaction',
      'throat swelling',
      'loss of consciousness',
      'fainted',
      'high fever',
      'severe swelling spreading',
    ];

    for (const kw of emergencyKeywords) {
      if (lowerMessage.includes(kw)) {
        deterministicUrgency = 'EMERGENCY';
        matchedSymptomKeys.push('emergency_symptom');
      }
    }

    const stopWords = new Set([
      'after', 'before', 'during', 'procedure', 'treatment', 'dental', 'patient', 'clinic',
      'about', 'above', 'again', 'against', 'there', 'their', 'where', 'which', 'while',
      'these', 'those', 'through', 'under', 'until', 'would', 'could', 'should', 'other',
      'first', 'second', 'third', 'times', 'hours', 'minutes', 'days', 'weeks', 'months',
      'stops', 'does', 'that', 'this', 'from', 'with', 'your', 'more', 'area', 'felt',
      'feel', 'have', 'been', 'being', 'having', 'done', 'doing', 'drink', 'water', 'food',
      'can', 'please', 'help', 'take', 'much', 'many', 'good', 'well', 'persists', 'worsens',
    ]);

    for (const rule of escalationRules) {
      const sKey = (rule.symptomKey || '').toLowerCase().replace(/_/g, ' ');
      const sDesc = (rule.description || '').toLowerCase();

      // Meaningful tokens in symptomKey
      const keyTokens = sKey
        .split(/\s+/)
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 3 && !stopWords.has(t));

      // Direct phrase match or all key tokens present in message
      const isKeyMatch =
        lowerMessage.includes(sKey) ||
        (keyTokens.length > 0 && keyTokens.every((kw: string) => lowerMessage.includes(kw)));

      // Meaningful clinical terms from description (e.g. 'hemorrhage', 'throbbing', 'fever')
      const clinicalTokens = sDesc
        .split(/[\s,.-]+/)
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 4 && !stopWords.has(t));

      // Match if specific clinical keywords appear
      const isDescMatch = clinicalTokens.length > 0 && clinicalTokens.some((token: string) => {
        // Only trigger on distinctly clinical symptom keywords
        const clinicalKeywords = ['hemorrhage', 'pus', 'numbness', 'throbbing', 'infection', 'fever', 'chills', 'vomiting'];
        return clinicalKeywords.includes(token) && lowerMessage.includes(token);
      });

      if (isKeyMatch || isDescMatch) {
        matchedSymptomKeys.push(rule.symptomKey);
        if (!matchedRule) matchedRule = rule;

        if (rule.action === EscalationAction.EMERGENCY) {
          deterministicUrgency = 'EMERGENCY';
          matchedRule = rule;
        } else if (
          rule.action === EscalationAction.CALL_CLINIC &&
          deterministicUrgency !== 'EMERGENCY'
        ) {
          deterministicUrgency = 'CONTACT_CLINIC';
          matchedRule = rule;
        }
      }
    }

    // B) LLM Classification
    const llmClassifierResult = await this.classifyWithLLM(rawMessage, escalationRules);

    // Merge classifier results: if EITHER says urgent, treat as urgent
    let finalUrgency: 'NONE' | 'CONTACT_CLINIC' | 'EMERGENCY' = 'NONE';
    if (deterministicUrgency === 'EMERGENCY' || llmClassifierResult.urgency === 'EMERGENCY') {
      finalUrgency = 'EMERGENCY';
    } else if (
      deterministicUrgency === 'CONTACT_CLINIC' ||
      llmClassifierResult.urgency === 'CONTACT_CLINIC'
    ) {
      finalUrgency = 'CONTACT_CLINIC';
    }

    const allSymptomKeys = Array.from(
      new Set([...matchedSymptomKeys, ...llmClassifierResult.symptomKeys])
    );

    // If urgent: SKIP normal answering and return escalation message
    if (finalUrgency !== 'NONE') {
      const isEmergency = finalUrgency === 'EMERGENCY';

      // Create staff notification record
      try {
        await prisma.staffNotification.create({
          data: {
            clinicId,
            patientId,
            appointmentId: appointment.id,
            title: isEmergency ? '🚨 URGENT: Patient Emergency Triage' : '⚠️ Patient Triage Escalation',
            message: `Patient reported: "${rawMessage.slice(0, 100)}...". Triggered symptoms: ${allSymptomKeys.join(', ')}. Action: ${finalUrgency}.`,
            severity: isEmergency ? 'EMERGENCY' : 'HIGH',
          },
        });
      } catch (err) {
        console.error('[TriageService] Error creating staff notification:', err);
      }

      const escalationMessage = matchedRule
        ? matchedRule.message
        : isEmergency
          ? 'Your reported symptoms require immediate emergency clinical attention.'
          : 'Your symptoms should be evaluated by our dental team as soon as possible.';

      let urgentReply = '';
      if (isEmergency) {
        urgentReply = `${escalationMessage}\n\n🚨 EMERGENCY ACTION: Please call our emergency line immediately at ${emergencyPhone} or visit the nearest emergency room.`;
      } else {
        urgentReply = `${escalationMessage}\n\n📞 CONTACT CLINIC: Please call our clinic at ${clinicPhone}. Would you like us to submit a callback request to our front desk?`;
      }

      urgentReply += `\n\nNote: This is general guidance and the clinic can be contacted for concerns.`;

      // Log triage exchange
      await this.logTriageExchange({
        clinicId,
        appointmentId: appointment.id,
        patientId,
        symptomKeys: allSymptomKeys,
        urgency: finalUrgency,
        escalated: true,
        rawMessage,
        replyText: urgentReply,
        storeRaw: clinic.storeRawTriageMessages,
      });

      return {
        reply: urgentReply,
        urgency: finalUrgency,
        escalated: true,
        symptomKeys: allSymptomKeys,
        appointmentId: appointment.id,
        patientId,
      };
    }

    // --- STEP 2: ANSWER GENERATION STRICTLY FROM APPROVED INSTRUCTIONS ---
    const generatedAnswer = await this.generateGroundedAnswer(
      rawMessage,
      carePlan.instructions,
      clinicPhone
    );

    // --- STEP 3: OUTPUT CHECK (SAFETY FILTER) ---
    // Reject and replace with safe fallback if dosage-like patterns or medication names appear
    const safeAnswer = this.enforceOutputSafety(generatedAnswer, clinicPhone);

    const finalAnswer = `${safeAnswer}\n\nNote: This is general guidance and the clinic can be contacted for concerns.`;

    // Log triage exchange
    await this.logTriageExchange({
      clinicId,
      appointmentId: appointment.id,
      patientId,
      symptomKeys: allSymptomKeys,
      urgency: 'NONE',
      escalated: false,
      rawMessage,
      replyText: finalAnswer,
      storeRaw: clinic.storeRawTriageMessages,
    });

    return {
      reply: finalAnswer,
      urgency: 'NONE',
      escalated: false,
      symptomKeys: allSymptomKeys,
      appointmentId: appointment.id,
      patientId,
    };
  }

  /**
   * Safety classifier LLM call returning strict JSON:
   * { symptomKeys: string[], urgency: "NONE" | "CONTACT_CLINIC" | "EMERGENCY" }
   */
  private static async classifyWithLLM(
    message: string,
    rules: any[]
  ): Promise<{ symptomKeys: string[]; urgency: 'NONE' | 'CONTACT_CLINIC' | 'EMERGENCY' }> {
    const rulesList = rules
      .map((r) => `- [${r.action}] ${r.symptomKey}: ${r.description}`)
      .join('\n');

    const prompt = `You are an automated medical triage classifier for a dental clinic.
Patient message: "${message}"

Clinic Escalation Rules:
${rulesList || 'None defined.'}

Task:
Determine whether the patient's message indicates any symptoms mentioned in the escalation rules, or any dental/medical emergency.
You must return ONLY a valid JSON object with the following exact keys:
{
  "symptomKeys": string[],
  "urgency": "NONE" | "CONTACT_CLINIC" | "EMERGENCY"
}
Do not include markdown fences, explanations, or any other text outside the JSON object.`;

    try {
      // In production or development with API key, call LLM; otherwise use grounded heuristic
      const response = await this.callLLM(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const urgency = ['NONE', 'CONTACT_CLINIC', 'EMERGENCY'].includes(parsed.urgency)
          ? parsed.urgency
          : 'NONE';
        const symptomKeys = Array.isArray(parsed.symptomKeys) ? parsed.symptomKeys : [];
        return { symptomKeys, urgency };
      }
    } catch {
      // Graceful fallback to deterministic
    }

    return { symptomKeys: [], urgency: 'NONE' };
  }

  /**
   * Generates grounded answer based strictly and exclusively on approved instructions.
   */
  private static async generateGroundedAnswer(
    message: string,
    instructions: any[],
    clinicPhone: string
  ): Promise<string> {
    const instructionTexts = instructions
      .map((i) => `• [${i.phase}] ${i.title}: ${i.body}`)
      .join('\n\n');

    const prompt = `You are the SmileCare AI Aftercare Receptionist.
You are assisting a dental patient with their post-treatment recovery.

STRICT CLINICAL RULES:
1. Answer ONLY using the approved clinic instructions provided below.
2. If the user's question is NOT answered in the approved instructions, state: "I don't have specific guidance on that in your aftercare instructions. Please reach out to our clinic at ${clinicPhone} so our team can help you."
3. NEVER prescribe, mention, or recommend specific medication names, doses, or milligram counts.
4. NEVER provide a diagnosis.
5. NEVER contradict an approved instruction.

APPROVED CLINIC INSTRUCTIONS:
${instructionTexts}

PATIENT QUESTION:
"${message}"

Provide a warm, reassuring, and completely faithful answer based strictly on the approved instructions.`;

    try {
      const answer = await this.callLLM(prompt);
      if (answer && answer.trim().length > 10) {
        return answer.trim();
      }
    } catch {
      // Fallback
    }

    // Deterministic fallback matching instruction keywords
    const lower = message.toLowerCase();
    const matched = instructions.find((i) =>
      i.title.toLowerCase().split(' ').some((w: string) => w.length > 3 && lower.includes(w))
    );

    if (matched) {
      return `According to your aftercare plan for "${matched.title}": ${matched.body}`;
    }

    return `I don't have specific guidance on that in your current aftercare plan. Please contact our clinic at ${clinicPhone} so our dental team can assist you directly.`;
  }

  /**
   * Step 3 Output safety check:
   * Rejects and replaces with safe fallback any answer that contains dosage-like patterns or unauthorized medications.
   */
  private static enforceOutputSafety(answer: string, clinicPhone: string): string {
    // 1. Check for dosage patterns (e.g. 500mg, 10 ml, 2 tablets, dose of 400)
    const dosagePattern = /\b\d+(\.\d+)?\s*(mg|ml|mcg|tablets?|capsules?|pills?|teaspoons?|drops?)\b/i;
    const doseWordPattern = /\b(take|dosage|dose)\s+\d+\b/i;

    // 2. Check for common prescription and analgesics names
    const medicationPattern =
      /\b(amoxicillin|penicillin|ibuprofen|paracetamol|acetaminophen|hydrocodone|codeine|oxycodone|tramadol|advil|tylenol|aspirin|clindamycin|azithromycin)\b/i;

    if (
      dosagePattern.test(answer) ||
      doseWordPattern.test(answer) ||
      medicationPattern.test(answer)
    ) {
      console.warn(
        `[TriageService] Output safety violation detected in generated answer. Replacing with safe fallback.`
      );
      return `I cannot provide specific medication names or dosage instructions. Please contact our dental team directly at ${clinicPhone} for personalized medical guidance.`;
    }

    return answer;
  }

  /**
   * Helper to execute LLM prompts or gracefully simulate when API keys are not supplied.
   */
  private static async callLLM(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const res = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        });
        const textContent = res.content.find((c) => c.type === 'text');
        if (textContent && 'text' in textContent) {
          return textContent.text;
        }
      } catch (err) {
        console.warn('[TriageService] Anthropic call failed, falling back:', err);
      }
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        // Direct fetch to Gemini REST endpoint if available
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });
        if (res.ok) {
          const json: any = await res.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (err) {
        console.warn('[TriageService] Gemini call failed, falling back:', err);
      }
    }

    // Offline / Mock deterministic mode
    return '';
  }

  /**
   * Persists triage exchange into TriageLog table. Redacts patient message by default.
   */
  private static async logTriageExchange(data: {
    clinicId: string;
    appointmentId?: string | null;
    patientId?: string | null;
    symptomKeys: string[];
    urgency: string;
    escalated: boolean;
    rawMessage: string;
    replyText: string;
    storeRaw: boolean;
  }) {
    try {
      const storedMessage = data.storeRaw
        ? data.rawMessage
        : redactTriageMessage(data.rawMessage);

      await prisma.triageLog.create({
        data: {
          clinicId: data.clinicId,
          appointmentId: data.appointmentId || null,
          patientId: data.patientId || null,
          symptomKeys: data.symptomKeys,
          urgency: data.urgency,
          escalated: data.escalated,
          messageText: storedMessage,
          responseText: data.replyText,
        },
      });
    } catch (err) {
      console.error('[TriageService] Failed to persist TriageLog record:', err);
    }
  }
}
