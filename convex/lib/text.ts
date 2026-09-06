// Small text utilities: fuzzy similarity (for case-name matching), keyword extraction,
// and a cheap passage-grounding check used by the citation verifier.

// Sørensen–Dice coefficient over character bigrams. Range [0,1]; stable and cheap.
export function similarity(a: string, b: string): number {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (x === y) return 1;
  if (x.length < 2 || y.length < 2) return 0;
  const bigrams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.slice(i, i + 2);
      m.set(bg, (m.get(bg) ?? 0) + 1);
    }
    return m;
  };
  const ma = bigrams(x);
  const mb = bigrams(y);
  let overlap = 0;
  let total = 0;
  for (const c of ma.values()) total += c;
  for (const [bg, c] of mb) {
    total += c;
    const av = ma.get(bg) ?? 0;
    overlap += Math.min(av, c);
  }
  return (2 * overlap) / total;
}

const STOP = new Set([
  "the", "a", "an", "of", "to", "in", "on", "for", "and", "or", "is", "are", "was", "were",
  "with", "his", "her", "he", "she", "it", "that", "this", "by", "as", "at",
]);

export function keywords(text: string, k = 8): string[] {
  const counts = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z]{3,}/g) ?? []) {
    if (!STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([w]) => w);
}

// True if the passage's salient words occur in the source document (cheap grounding check).
export function passageSupported(passage: string, docText: string, minRatio = 0.6): boolean {
  if (!passage) return true;
  const docLower = docText.toLowerCase();
  const words = passage.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  if (words.length === 0) return true;
  const hits = words.filter((w) => docLower.includes(w)).length;
  return hits / words.length >= minRatio;
}
