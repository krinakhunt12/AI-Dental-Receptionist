/**
 * Layer 1 of medical safety: a deterministic pre-check that runs BEFORE the LLM.
 * The LLM system prompt is layer 2; never rely on the prompt alone.
 */
const EMERGENCY = [
  /bleeding.{0,40}(won'?t|not|can'?t|cannot|doesn'?t) stop/i,
  /(severe|heavy|uncontrol\w*|excessive) bleeding/i,
  /(can'?t|cannot|difficult\w*|trouble|hard) (to )?(breathe|breathing|swallow\w*)/i,
  /(face|eye|neck|throat|jaw|cheek).{0,30}swell\w*|swell\w*.{0,30}(face|eye|neck|throat|jaw|cheek)/i,
  /(knocked|knocked-)\s*out (a )?tooth|tooth.{0,20}(knocked|fell) out/i,
  /(jaw|face|head).{0,30}(broken|fractur\w*|trauma|injur\w*)|(accident|trauma)/i,
  /(unconscious|fainted|passed out|chest pain)/i,
];

export const isEmergency = (text: string) => EMERGENCY.some((r) => r.test(text));

export const EMERGENCY_REPLY =
  "I'm sorry you're going through this. What you describe may need urgent care, and I can't assess it. " +
  'Please go to the nearest emergency room or call your local emergency number now (112 in India). ' +
  "I'm also alerting our receptionist so the clinic can follow up with you.";
