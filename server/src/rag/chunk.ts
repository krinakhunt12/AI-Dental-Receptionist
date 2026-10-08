/**
 * Heading-aware chunker. Packs paragraphs up to maxLen characters and prefixes every
 * chunk with its nearest markdown heading, so "Rs 3,000, 60 minutes" keeps its context.
 */
export function chunkText(text: string, maxLen = 800): string[] {
  const paras = text.replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let heading = '';
  let cur = '';

  const flush = () => {
    if (cur.trim()) out.push(cur.trim());
    cur = '';
  };

  for (let p of paras) {
    const m = p.match(/^(#{1,6}\s[^\n]*)\n?([\s\S]*)$/);
    if (m) {
      flush();
      heading = m[1];
      p = m[2].trim();
      if (!p) continue;
    }
    const prefix = heading ? heading + '\n' : '';
    for (const piece of splitLong(p, Math.max(200, maxLen - prefix.length))) {
      if (cur && cur.length + piece.length + 2 > maxLen) flush();
      cur = cur ? cur + '\n\n' + piece : prefix + piece;
    }
  }
  flush();
  return out;
}

function splitLong(p: string, limit: number): string[] {
  if (p.length <= limit) return [p];
  const parts: string[] = [];
  let cur = '';
  for (const s of p.split(/(?<=[.!?])\s+/)) {
    if (s.length > limit) {
      if (cur) parts.push(cur);
      cur = '';
      for (let i = 0; i < s.length; i += limit) parts.push(s.slice(i, i + limit));
    } else if (cur && cur.length + s.length + 1 > limit) {
      parts.push(cur);
      cur = s;
    } else {
      cur = cur ? cur + ' ' + s : s;
    }
  }
  if (cur) parts.push(cur);
  return parts;
}
