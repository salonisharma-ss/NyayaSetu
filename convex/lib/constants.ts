// Shared constants with no Convex-server dependency, so the pure logic libs stay unit-testable
// in isolation. Embedding dimension: Gemini text-embedding-004 = 768; the deterministic dev
// embedder also emits 768-dim vectors so the vector index is valid without any API key.
export const EMBEDDING_DIM = 768;
