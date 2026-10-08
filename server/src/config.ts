import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT ?? 3001),
  dataDir: path.join(root, 'data'),
  
  // LLM Provider Settings (Free options: 'openrouter', 'gemini', 'ollama', 'free_agent')
  llmProvider: (process.env.LLM_PROVIDER ?? 'free_agent') as 'openrouter' | 'gemini' | 'ollama' | 'anthropic' | 'free_agent',
  openrouterKey: process.env.OPENROUTER_API_KEY ?? '',
  geminiKey: process.env.GEMINI_API_KEY ?? '',
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? '',
  ollamaHost: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
  
  // Default to a free model (e.g. OpenRouter free model or Gemini 1.5/2.0 Flash)
  model: process.env.AI_MODEL ?? process.env.ANTHROPIC_MODEL ?? 'google/gemini-2.0-flash-lite-preview:free',
  
  // Vector search settings
  embeddingProvider: (process.env.EMBEDDING_PROVIDER ?? 'local') as 'local' | 'bm25',
  embeddingModel: process.env.EMBEDDING_MODEL ?? 'Xenova/all-MiniLM-L6-v2',
  
  // Clinic Details
  timezone: process.env.CLINIC_TZ ?? 'Asia/Kolkata',
  clinicName: process.env.CLINIC_NAME ?? 'SmileCare Dental Clinic',
};
