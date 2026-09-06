// PII redaction (§9.2 DPDP) — remove identifiers before any cloud LLM call.
// Mandatory for the citizen assistant (free tier trains on prompts).
const PATTERNS: [string, RegExp][] = [
  ["[EMAIL]", /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g],
  ["[PAN]", /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g],
  ["[AADHAAR]", /\b\d{4}\s?\d{4}\s?\d{4}\b/g],
  ["[PHONE]", /(?<!\d)(?:\+?91[-\s]?|0)?[6-9]\d{4}[-\s]?\d{5}(?!\d)/g],
];

export interface RedactionResult {
  text: string;
  counts: Record<string, number>;
  redactedAny: boolean;
}

export function redactPii(text: string): RedactionResult {
  if (!text) return { text: "", counts: {}, redactedAny: false };
  const counts: Record<string, number> = {};
  let out = text;
  for (const [placeholder, pat] of PATTERNS) {
    out = out.replace(pat, () => {
      counts[placeholder] = (counts[placeholder] ?? 0) + 1;
      return placeholder;
    });
  }
  return { text: out, counts, redactedAny: Object.keys(counts).length > 0 };
}
