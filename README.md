# NyayaSetu (LexSynq)

Indian Legal Intelligence + Practice Management + Lawyer–Citizen Marketplace.
**One monorepo. Convex backend (DB + vector search + auth + file storage + cron — no Docker) +
Next.js frontend on Vercel.**

> Promise to the lawyer: *from a client's raw problem to a research-backed draft without opening a
> law book* — and every citation is verified against the corpus before it's shown.

## Stack

| Layer | Tech | Notes |
|---|---|---|
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind | Deploys to Vercel |
| Backend | **Convex** (`convex/`) | Reactive DB, **native vector search**, auth, file storage, scheduler — all TypeScript, no Docker |
| Auth | Convex Auth (email + password) | Client-side; no third-party provider |
| LLM | **Groq** (primary, no training) → Gemini (paid/free per §6) → grounded offline echo | Sensitivity-aware routing |
| Embeddings | Gemini `text-embedding-004` (768-dim) → deterministic dev embedder | Vector index in Convex |

## The one flow (works end-to-end)

```
INTAKE  →  RESEARCH  →  DRAFT
```

Intake picks a category/sub-category and shows a **path-specific document checklist**; research
retrieves from the grounded judgment corpus (Convex vector search), **verifies every citation**,
and assembles a brief with a measured `fabricationRate`; drafting generates a first-draft legal
document grounded only in the verified authorities.

## Layout

```
convex/                 Convex backend (the differentiator)
  schema.ts             tables + vector index + citation index + search index
  auth.ts, http.ts      Convex Auth (email/password)
  lib/                  PORTED, unit-tested logic:
    clean.ts            denoise (OCR artifacts, headers/footers, page numbers, boilerplate)
    citation.ts         parse/normalize SCC/AIR/SCR/SCC-OnLine/INSC parallel citations
    chunk.ts            paragraph-aware overlapping chunks + dedup
    embeddings.ts       Gemini | deterministic dev embedder
    llm.ts              sensitivity-aware routing (privileged ⇏ training endpoint)
    pii.ts              PII redaction before free-tier calls (DPDP §9.2)
    text.ts, taxonomy.ts, constants.ts, demoData.ts
  model/                access.ts (tenant guards), corpus.ts (store + resolvers)
  ingest.ts             clean→quality-gate→dedup→chunk→embed→store (idempotent)
  ingestBulk.ts         FREE, scalable, resumable bulk ingestion (see below)
  verify.ts             deterministic citation verifier (drops unresolved; fabricationRate)
  research.ts           vector search → verify → grounded brief
  drafting.ts           grounded first-draft generation
  crm.ts, firms.ts, intake.ts, citizen.ts, marketplace.ts, seed.ts
  *.test.ts             38 tests (pure logic + in-process Convex integration)
app/                    Next.js frontend (landing, auth, dashboard, matter, citizen, marketplace)
components/             Nav, AuthForm
```

## Run it

### 1. Backend (Convex) — you run this locally (this sandbox can't reach api.convex.dev)

```bash
npm install
npx convex dev            # links your deployment, pushes schema+functions, generates types
npx @convex-dev/auth      # one-time: generates the auth JWT keys on your deployment

# LLM/embedding keys (optional — app runs without them):
npx convex env set GROQ_API_KEY   <your-groq-key>
npx convex env set GEMINI_API_KEY <your-gemini-key>   # only if it's an AIza… key
```

### 2. Frontend

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_CONVEX_URL to your deployment URL
npm run dev                  # http://localhost:3000
```

Sign up → name your firm → **Load demo judgment corpus** (button) → create a client + matter via
the guided intake → **Run grounded research** → **Generate draft**.

### 3. Deploy (the reliable path — avoids the common Vercel build failure)

`next build` does **not** typecheck the Convex functions (they're a separate runtime with their
own tsconfig + `convex deploy` typecheck). This is deliberate: it's why the Vercel build is stable
regardless of whether `convex/_generated` holds the committed stub or your regenerated types.

1. **Deploy the backend first (locally, once per release):**
   ```bash
   npx convex deploy        # pushes schema + functions, typechecks them properly
   ```
2. **Frontend on Vercel:**
   - Build command: **`next build`** (the default — do NOT use `convex deploy --cmd` unless you
     also set `CONVEX_DEPLOY_KEY` in Vercel; a missing key is the usual cause of a failing build).
   - Environment variable: `NEXT_PUBLIC_CONVEX_URL = https://<your-deployment>.convex.cloud`.

   *(Optional one-step:* set Vercel build command to `npx convex deploy --cmd 'next build'` **and**
   add `CONVEX_DEPLOY_KEY` (Convex dashboard → Settings → Deploy Keys) to Vercel env — then Vercel
   deploys the backend and frontend together.)

### Tests

```bash
npm test          # 38 tests, in-process (no cloud needed)
npm run typecheck # tsc --noEmit
npm run build     # next build
```

## Bringing all the cases in — the free, scalable path (§5 rethink)

**Indian Kanoon's API is paid per-call, so it is NOT the bulk path.** The corpus is populated from
**free public-record bulk dumps** (eCourts / OpenJustice High Court + Supreme Court judgments) and
permissively-licensed Hugging Face Indian-judgment datasets, exported to sharded NDJSON. The
`ingestBulk` action ingests one bounded batch per invocation and **self-schedules the next**, so it
is resumable, idempotent, and stays within Convex limits at any scale:

```ts
// from an authenticated client / the Convex dashboard:
await ingestBulk({
  source: "openjustice-hc",
  shardUrls: ["https://…/hc-2024-shard-0.ndjson", "https://…/hc-2024-shard-1.ndjson", …],
  batchSize: 100,
});
```

Indian Kanoon's paid API remains an **optional on-demand top-up** for freshness, not the bulk path.
Note: ingesting the entire national corpus (tens of millions of judgments) is a background job
measured in storage cost and time — the pipeline is built to scale to it, batch by batch.

## Live legal updates & real-time sync (Lexology-style)

`/updates` is a filterable feed of **new judgments, enacted legislation, and legal news** by
practice area and jurisdiction. It's populated by a **Convex cron** (`convex/crons.ts`, every 6h —
tighten for closer to real-time) that runs `updates.syncFromFeeds`, pulling from sources you
configure via env (no code change to add a country's feeds):

```bash
npx convex env set UPDATE_JSON_FEEDS "https://…/sc-latest.json,https://…/gazette.json"
npx convex env set UPDATE_RSS_FEEDS  "https://…/court-rss.xml,https://…/pib-rss.xml"
```

Each item is deduped and idempotent. With no feeds configured the cron is a graceful no-op; a
`seedDemoUpdates` mutation loads sample items so the feed is never empty. **Enacted legislation**
(Acts/amendments) is ingested as `docType: "statute"` through the same pipeline, so research grounds
on statutes as well as judgments. This is what makes it a product that tracks the law as it
changes, not a static demo.

## Compliance enforced in code

- **Citation verification (§9.3):** authorities are grounded by retrieval; any inline citation is
  resolved against the corpus before display; unresolved ones are **dropped**; `fabricationRate` is
  surfaced in the UI and gated in tests.
- **Sensitivity routing (§6):** privileged requests cannot reach a training-enabled endpoint
  (enforced + unit-tested). Groq (no training on API data) is the primary provider.
- **PII redaction (§9.2):** citizen questions are redacted before the free-tier call.
- **Tenant isolation (§9.4):** every firm-scoped function goes through an access guard; verified by
  an in-process test that another firm cannot read a matter.
- **BCI Rule 36 (§9.1):** directory is search/filter only (no ranking), citizen-initiated booking,
  flat listing fee (no commission) — see `convex/marketplace.ts`.

See `THIRD_PARTY.md` for licenses (MIT/Apache/BSD only; no AGPL; ILDC dataset excluded).
