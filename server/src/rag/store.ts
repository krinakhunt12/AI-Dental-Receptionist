import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from '../config';
import { chunkText } from './chunk';
import { embed } from './embed';

type Chunk = { id: string; docId: string; source: string; text: string; embedding?: number[] };
export type Doc = { id: string; name: string; chars: number; chunks: number; addedAt: string };
export type Hit = { source: string; text: string; score: number };
type DB = { model: string; docs: Doc[]; chunks: Chunk[] };

const FILE = path.join(config.dataDir, 'vectors.json');
const useVectors = () => config.embeddingProvider === 'local';
let db: DB = { model: config.embeddingModel, docs: [], chunks: [] };

const save = () => fs.writeFileSync(FILE, JSON.stringify(db));

export async function initStore() {
  if (fs.existsSync(FILE)) db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  // Embedding model changed → old vectors are meaningless.
  if (db.model !== config.embeddingModel) {
    db.model = config.embeddingModel;
    db.chunks.forEach((c) => delete c.embedding);
  }
  if (db.docs.length === 0) await seed();
  await ensureEmbeddings();
}

async function seed() {
  const dir = path.join(config.dataDir, 'knowledge');
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir).filter((f) => /\.(md|txt)$/i.test(f))) {
    await addDocument(f, fs.readFileSync(path.join(dir, f), 'utf8'));
  }
}

async function ensureEmbeddings() {
  if (!useVectors()) return;
  const missing = db.chunks.filter((c) => !c.embedding);
  if (!missing.length) return;
  const vecs = await embed(missing.map((c) => c.text));
  missing.forEach((c, i) => (c.embedding = vecs[i]));
  save();
}

export async function addDocument(name: string, text: string): Promise<Doc> {
  const pieces = chunkText(text);
  if (!pieces.length) throw new Error('No readable text found in this file.');
  const docId = randomUUID();
  const chunks: Chunk[] = pieces.map((t) => ({ id: randomUUID(), docId, source: name, text: t }));
  if (useVectors()) {
    const vecs = await embed(chunks.map((c) => c.text));
    chunks.forEach((c, i) => (c.embedding = vecs[i]));
  }
  const doc: Doc = { id: docId, name, chars: text.length, chunks: chunks.length, addedAt: new Date().toISOString() };
  db.docs.push(doc);
  db.chunks.push(...chunks);
  save();
  return doc;
}

export function removeDocument(id: string): boolean {
  const before = db.docs.length;
  db.docs = db.docs.filter((d) => d.id !== id);
  db.chunks = db.chunks.filter((c) => c.docId !== id);
  save();
  return db.docs.length < before;
}

export const listDocuments = () => db.docs;

export async function search(query: string, k = 4): Promise<Hit[]> {
  if (!db.chunks.length) return [];
  return useVectors() ? vectorSearch(query, k) : bm25Search(query, k);
}

async function vectorSearch(query: string, k: number): Promise<Hit[]> {
  const [q] = await embed([query]);
  return db.chunks
    .filter((c) => c.embedding)
    .map((c) => ({ source: c.source, text: c.text, score: dot(q, c.embedding!) }))
    .filter((h) => h.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);

// ---- BM25 fallback (no model download) ----
const STOP = new Set('a an and are as at be by do does for from how i in is it me my of on or the to we what when where which who you your can with there'.split(' '));
const tokenize = (s: string) =>
  (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((t) => !STOP.has(t)).map((t) => (t.length > 4 ? t.replace(/(ing|ed)$/, '') : t).replace(/(?<=\w{3})s$/, ''));

function bm25Search(query: string, k: number): Hit[] {
  const docs = db.chunks.map((c) => ({ c, toks: tokenize(c.text) }));
  const avg = docs.reduce((s, d) => s + d.toks.length, 0) / docs.length || 1;
  const df = new Map<string, number>();
  docs.forEach((d) => new Set(d.toks).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
  const q = [...new Set(tokenize(query))];
  const k1 = 1.5, b = 0.75;
  return docs
    .map(({ c, toks }) => {
      let score = 0;
      for (const t of q) {
        const f = toks.filter((x) => x === t).length;
        if (!f) continue;
        const idf = Math.log(1 + (docs.length - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * toks.length) / avg)));
      }
      return { source: c.source, text: c.text, score };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
