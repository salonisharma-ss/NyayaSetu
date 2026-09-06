// Paragraph-aware, overlapping chunking with intra-doc dedup.
import { normalizedHash } from "./hash";

export interface RawChunk {
  ordinal: number;
  text: string;
  textHash: string;
  paraLabel?: string;
}

const PARA_SPLIT = /\n\s*\n/;

function approxTokens(text: string): number {
  return Math.max(1, Math.floor(text.length / 4));
}

export function chunkText(
  text: string,
  opts: { targetTokens?: number; overlapTokens?: number; labels?: string[]; seen?: Set<string> } = {},
): RawChunk[] {
  const targetTokens = opts.targetTokens ?? 350;
  const overlapTokens = opts.overlapTokens ?? 60;
  const seen = opts.seen ?? new Set<string>();

  let paras = text.split(PARA_SPLIT).map((p) => p.trim()).filter(Boolean);
  if (paras.length === 0) paras = text.trim() ? [text.trim()] : [];

  const chunks: RawChunk[] = [];
  let buf: string[] = [];
  let bufLabel: string | undefined;
  let ordinal = 0;

  const flush = () => {
    if (buf.length === 0) return;
    const body = buf.join("\n").trim();
    const h = normalizedHash(body);
    if (body && !seen.has(h)) {
      seen.add(h);
      chunks.push({ ordinal, text: body, textHash: h, paraLabel: bufLabel });
      ordinal += 1;
    }
    buf = [];
    bufLabel = undefined;
  };

  for (let i = 0; i < paras.length; i++) {
    const para = paras[i];
    const label = opts.labels && i < opts.labels.length ? opts.labels[i] : undefined;
    if (buf.length && approxTokens(buf.join("\n")) + approxTokens(para) > targetTokens) {
      flush();
      if (chunks.length && overlapTokens > 0) {
        const tail = chunks[chunks.length - 1].text.split(/\s+/);
        const keep = tail.slice(-overlapTokens);
        if (keep.length) buf = [keep.join(" ")];
      }
    }
    buf.push(para);
    bufLabel = bufLabel ?? label;
  }
  flush();
  return chunks;
}
