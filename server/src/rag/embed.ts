import { config } from '../config';

// Loaded lazily so bm25 mode never touches the model runtime.
let extractor: Promise<any> | null = null;

async function getExtractor() {
  if (!extractor) {
    extractor = import('@huggingface/transformers').then(({ pipeline }) =>
      pipeline('feature-extraction', config.embeddingModel),
    );
  }
  return extractor;
}

/** Returns L2-normalised embeddings, so cosine similarity == dot product. */
export async function embed(texts: string[]): Promise<number[][]> {
  const ex = await getExtractor();
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 16) {
    const t = await ex(texts.slice(i, i + 16), { pooling: 'mean', normalize: true });
    out.push(...(t.tolist() as number[][]));
  }
  return out;
}
