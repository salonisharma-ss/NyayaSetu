# Third-party components & licenses

License rule (commercial SaaS): **MIT / Apache-2.0 / BSD only** for code we keep closed.
No AGPL/GPL. No non-commercial datasets in the product.

## Runtime dependencies

| Component | License | Use |
|---|---|---|
| Convex (`convex`) | Apache-2.0 / FSL (client libs Apache-2.0) ✅ | Backend: DB, vector search, auth, storage, scheduler |
| `@convex-dev/auth`, `@auth/core` | Apache-2.0 / ISC ✅ | Email/password auth |
| Next.js, React | MIT ✅ | Frontend |
| Tailwind CSS | MIT ✅ | Styling |
| Groq API | Commercial API (no training on API data) ✅ | Primary LLM (OpenAI-compatible) |
| Google Gemini API | Commercial API ✅ | Embeddings; optional LLM (paid tier = no training) |

All RAG/legal logic (denoise, citation parsing/verification, chunking, PII, routing) is **our own
code** in `convex/lib` and `convex/model`, unit-tested.

## Datasets — the "bring all cases in" path

| Source | License | Verdict |
|---|---|---|
| eCourts / OpenJustice HC + SC judgment dumps | Public court records | ✅ Foundation bulk corpus (free). Ingest via `ingestBulk` (NDJSON shards). |
| Hugging Face Indian-judgment datasets | ⚠️ per-dataset — **check each** | ✅ when permissive; ingest via `ingestBulk`. |
| Indian Kanoon API | Paid per-call, commercially usable ✅ | **Optional on-demand top-up only** — NOT the bulk path (it's paid). |
| **ILDC corpus** | ❌ non-commercial / research | **EXCLUDED from the product.** No adapter ships. |

## Excluded on license grounds

| Component | License | Reason |
|---|---|---|
| Twenty CRM | AGPL-3.0 ❌ | Viral network-copyleft. (We use Convex + our own CRM instead of forking a CRM.) |
| ILDC corpus | non-commercial ❌ | Illegal to ship in a commercial product. |

## Note on the earlier architecture

An initial Python/FastAPI + Postgres/pgvector implementation was built and validated, then
**replaced** by this Convex + Next.js monorepo for a Docker-free, one-command deploy (Convex +
Vercel). The RAG/verifier logic was ported to TypeScript and re-tested.
