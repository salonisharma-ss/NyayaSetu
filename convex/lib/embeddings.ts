// Embeddings: Gemini when GEMINI_API_KEY is set, else a deterministic hashing embedder so the
// vector index is populated and retrieval is meaningful without any API key (dev/CI).
import { EMBEDDING_DIM } from "./constants";

const TOKEN = /[a-z0-9]+/g;

// Deterministic bag-of-hashed-tokens, L2-normalized. Identical text -> identical vector.
export function fakeEmbed(text: string, dim = EMBEDDING_DIM): number[] {
  const v = new Array(dim).fill(0);
  const lower = text.toLowerCase();
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(lower)) !== null) {
    const tok = m[0];
    let h = 2166136261;
    for (let i = 0; i < tok.length; i++) {
      h ^= tok.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const idx = Math.abs(h) % dim;
    const sign = (h & 1) === 0 ? 1 : -1;
    v[idx] += sign;
  }
  let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

function l2normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

async function geminiEmbed(texts: string[], apiKey: string): Promise<number[][]> {
  // gemini-embedding-001 defaults to 3072 dims; we request outputDimensionality=EMBEDDING_DIM
  // (768) to match the pgvector-style vector index, and L2-normalize (reduced dims aren't
  // auto-normalized) so cosine similarity is correct.
  const model = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:batchEmbedContents?key=${apiKey}`;
  const body = {
    requests: texts.map((t) => ({
      model: `models/${model}`,
      content: { parts: [{ text: t }] },
      outputDimensionality: EMBEDDING_DIM,
    })),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`gemini embed failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { embeddings: { values: number[] }[] };
  return data.embeddings.map((e) => l2normalize(e.values));
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const key = process.env.GEMINI_API_KEY;
  if (key) {
    try {
      return await geminiEmbed(texts, key);
    } catch {
      // fall through to deterministic embedder so ingestion never hard-fails
    }
  }
  return texts.map((t) => fakeEmbed(t));
}

export async function embedOne(text: string): Promise<number[]> {
  return (await embedTexts([text]))[0];
}
