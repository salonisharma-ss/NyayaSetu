// Sensitivity-aware LLM routing (§6).
// Hard invariant: a PRIVILEGED request can never reach a training-enabled (free-tier) endpoint.
//
// Providers, in preference order:
//   Groq   (GROQ_API_KEY)          - OpenAI-compatible; inference-only (does not train on API
//                                    data), so usable for BOTH privileged and general.
//   Gemini paid (GEMINI_PAID_API_KEY | GEMINI_API_KEY+GEMINI_ALLOW_PRIVILEGED) - no training.
//   Gemini free (GEMINI_FREE_API_KEY | GEMINI_API_KEY) - TRAINS; general/citizen only.
//   echo   (offline, grounded)     - never leaves the process; safe for any sensitivity.
export type Sensitivity = "privileged" | "general";

export interface LlmResult {
  text: string;
  model: string;
  provider: string;
  trainedOn: boolean;
}

const GEMINI_MODEL = () => process.env.GEMINI_MODEL || "gemini-flash-latest";
const GROQ_MODEL = () => process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const status = (e as { status?: number })?.status ?? 0;
      if (status && status !== 429 && status < 500) throw e; // non-retryable
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 500 + Math.random() * 300));
    }
  }
  throw lastErr;
}

async function callGroq(apiKey: string, system: string, prompt: string): Promise<string> {
  return withRetry(async () => {
    const messages = [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content: prompt },
    ];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: GROQ_MODEL(), messages, temperature: 0.2 }),
    });
    if (!res.ok) {
      const err = new Error(`groq ${res.status}: ${await res.text()}`) as Error & { status: number };
      err.status = res.status;
      throw err;
    }
    const data = (await res.json()) as any;
    return data?.choices?.[0]?.message?.content ?? "";
  });
}

async function callGemini(apiKey: string, system: string, prompt: string): Promise<string> {
  return withRetry(async () => {
    const model = GEMINI_MODEL();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload: Record<string, unknown> = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };
    if (system) payload.systemInstruction = { parts: [{ text: system }] };
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = new Error(`gemini ${res.status}: ${await res.text()}`) as Error & { status: number };
      err.status = res.status;
      throw err;
    }
    const data = (await res.json()) as any;
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  });
}

// Offline fallback that stays grounded: surfaces the CONTEXT block only, never invents facts.
function groundedEcho(prompt: string): string {
  const marker = "CONTEXT:\n";
  const idx = prompt.indexOf(marker);
  if (idx >= 0) {
    return (
      "[offline-grounded output — set GROQ_API_KEY or a Gemini key for full generation]\n\n" +
      prompt.slice(idx + marker.length).trim().slice(0, 4000)
    );
  }
  return "[offline-grounded response — no LLM key configured]";
}

interface Provider {
  name: string;
  trainedOn: boolean;
  model: string;
  run: (system: string, prompt: string) => Promise<string>;
}

function privilegedChain(): Provider[] {
  const chain: Provider[] = [];
  if (process.env.GROQ_API_KEY) {
    const key = process.env.GROQ_API_KEY;
    chain.push({ name: "groq", trainedOn: false, model: GROQ_MODEL(), run: (s, p) => callGroq(key, s, p) });
  }
  const paid =
    process.env.GEMINI_PAID_API_KEY ||
    (process.env.GEMINI_ALLOW_PRIVILEGED === "true" ? process.env.GEMINI_API_KEY : undefined);
  if (paid) {
    chain.push({ name: "gemini-paid", trainedOn: false, model: GEMINI_MODEL(), run: (s, p) => callGemini(paid, s, p) });
  }
  chain.push({ name: "echo", trainedOn: false, model: "echo", run: async (_s, p) => groundedEcho(p) });
  return chain;
}

function generalChain(): Provider[] {
  const chain: Provider[] = [];
  if (process.env.GROQ_API_KEY) {
    const key = process.env.GROQ_API_KEY;
    chain.push({ name: "groq", trainedOn: false, model: GROQ_MODEL(), run: (s, p) => callGroq(key, s, p) });
  }
  const gkey = process.env.GEMINI_FREE_API_KEY || process.env.GEMINI_API_KEY;
  if (gkey) {
    const trainedOn = !process.env.GEMINI_PAID_API_KEY;
    chain.push({ name: "gemini-free", trainedOn, model: GEMINI_MODEL(), run: (s, p) => callGemini(gkey, s, p) });
  }
  chain.push({ name: "echo", trainedOn: false, model: "echo", run: async (_s, p) => groundedEcho(p) });
  return chain;
}

export async function complete(
  sensitivity: Sensitivity,
  system: string,
  prompt: string,
): Promise<LlmResult> {
  const chain = sensitivity === "privileged" ? privilegedChain() : generalChain();
  // Invariant: privileged chain must contain no training-enabled provider.
  if (sensitivity === "privileged" && chain.some((p) => p.trainedOn)) {
    throw new Error("privileged chain contains a training-enabled provider");
  }
  let lastErr: unknown;
  for (const p of chain) {
    try {
      const text = await p.run(system, prompt);
      return { text, model: p.model, provider: p.name, trainedOn: p.trainedOn };
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`all LLM providers failed: ${lastErr}`);
}
