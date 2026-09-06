// Deterministic, synchronous hashing for dedup + idempotency (no crypto needed for dedup keys).
// FNV-1a 64-bit over UTF-8, returned as hex.
export function fnv1a(input: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const bytes = new TextEncoder().encode(input);
  for (const b of bytes) {
    hash ^= BigInt(b);
    hash = (hash * prime) & 0xffffffffffffffffn;
  }
  return hash.toString(16).padStart(16, "0");
}

export function normalizedHash(text: string): string {
  return fnv1a(text.replace(/\s+/g, " ").trim().toLowerCase());
}
