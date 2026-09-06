import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { EMBEDDING_DIM } from "./lib/constants";

export { EMBEDDING_DIM };

export default defineSchema({
  // Convex Auth manages users + auth sessions/accounts.
  ...authTables,

  // ── Tenancy ────────────────────────────────────────────────────────────────
  firms: defineTable({
    name: v.string(),
    ownerUserId: v.id("users"),
    plan: v.union(v.literal("basic"), v.literal("professional"), v.literal("enterprise")),
  }).index("by_owner", ["ownerUserId"]),

  memberships: defineTable({
    userId: v.id("users"),
    firmId: v.id("firms"),
    role: v.union(v.literal("firm_admin"), v.literal("lawyer"), v.literal("citizen")),
  })
    .index("by_user", ["userId"])
    .index("by_firm", ["firmId"])
    .index("by_user_firm", ["userId", "firmId"]),

  // ── CRM (L7) ────────────────────────────────────────────────────────────────
  clients: defineTable({
    firmId: v.id("firms"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_firm", ["firmId"]),

  matters: defineTable({
    firmId: v.id("firms"),
    clientId: v.id("clients"),
    title: v.string(),
    category: v.string(),
    subcategory: v.string(),
    summaryText: v.string(),
    status: v.union(
      v.literal("intake"),
      v.literal("research"),
      v.literal("drafting"),
      v.literal("active"),
      v.literal("closed"),
    ),
    createdBy: v.id("users"),
  })
    .index("by_firm", ["firmId"])
    .index("by_firm_status", ["firmId", "status"])
    .index("by_client", ["clientId"]),

  documents: defineTable({
    firmId: v.id("firms"),
    matterId: v.id("matters"),
    type: v.string(),
    storageId: v.optional(v.id("_storage")),
    ocrText: v.optional(v.string()),
    piiRedacted: v.boolean(),
    uploadedBy: v.id("users"),
  }).index("by_matter", ["matterId"]),

  // ── Shared judgment corpus (public records; NOT firm-scoped) ─────────────────
  corpusDocuments: defineTable({
    source: v.string(), // sc_seed | openjustice | indiankanoon
    sourceDocId: v.string(),
    court: v.optional(v.string()),
    caseName: v.string(),
    neutralCitation: v.optional(v.string()),
    citations: v.array(v.string()), // normalized canonical citation keys
    decisionDate: v.optional(v.string()),
    bench: v.optional(v.string()),
    docType: v.string(),
    sourceUrl: v.optional(v.string()),
    contentHash: v.string(),
    cleanText: v.string(),
  })
    .index("by_source_docid", ["source", "sourceDocId"])
    .index("by_content_hash", ["contentHash"])
    .index("by_case_name", ["caseName"])
    .searchIndex("search_case_name", { searchField: "caseName" }),

  // Canonical-citation -> document map for O(1) verification at corpus scale (§9.3).
  corpusCitations: defineTable({
    key: v.string(), // canonical citation key, e.g. "SCC:2004:3:297"
    documentId: v.id("corpusDocuments"),
  })
    .index("by_key", ["key"])
    .index("by_document", ["documentId"]),

  corpusChunks: defineTable({
    documentId: v.id("corpusDocuments"),
    ordinal: v.number(),
    paraLabel: v.optional(v.string()),
    text: v.string(),
    textHash: v.string(),
    caseName: v.string(),
    sourceUrl: v.optional(v.string()),
    embedding: v.array(v.float64()),
  })
    .index("by_document", ["documentId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: EMBEDDING_DIM,
      filterFields: ["caseName"],
    }),

  ingestRuns: defineTable({
    source: v.string(),
    status: v.union(v.literal("running"), v.literal("completed"), v.literal("failed")),
    cursor: v.optional(v.string()),
    stats: v.any(),
  }).index("by_source", ["source"]),

  // ── Research artifacts (firm-scoped) ─────────────────────────────────────────
  researchBriefs: defineTable({
    firmId: v.id("firms"),
    matterId: v.id("matters"),
    modelUsed: v.string(),
    sensitivity: v.union(v.literal("privileged"), v.literal("general")),
    status: v.string(),
    queryText: v.string(),
    body: v.string(),
    fabricationRate: v.number(),
    droppedCount: v.number(),
  })
    .index("by_firm", ["firmId"])
    .index("by_matter", ["matterId"]),

  citations: defineTable({
    firmId: v.id("firms"),
    briefId: v.id("researchBriefs"),
    caseName: v.string(),
    citationString: v.string(),
    sourceUrl: v.optional(v.string()),
    corpusDocumentId: v.optional(v.id("corpusDocuments")),
    verificationStatus: v.union(
      v.literal("verified"),
      v.literal("unverified"),
      v.literal("dropped"),
    ),
    relevancePassage: v.string(),
    matchMethod: v.string(),
  })
    .index("by_firm", ["firmId"])
    .index("by_brief", ["briefId"]),

  drafts: defineTable({
    firmId: v.id("firms"),
    matterId: v.id("matters"),
    briefId: v.optional(v.id("researchBriefs")),
    docType: v.string(),
    content: v.string(),
    status: v.string(),
  })
    .index("by_firm", ["firmId"])
    .index("by_matter", ["matterId"]),

  // ── Side B: marketplace (compliance-sensitive; behind flags in UI) ──────────
  lawyerProfiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    bciEnrolmentNo: v.optional(v.string()),
    practiceAreas: v.array(v.string()),
    languages: v.array(v.string()),
    city: v.optional(v.string()),
    feeRange: v.optional(v.string()),
    listed: v.boolean(),
    verified: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_city", ["city"])
    .index("by_listed_verified", ["listed", "verified"]),

  bookings: defineTable({
    citizenUserId: v.id("users"),
    lawyerUserId: v.id("users"),
    slot: v.string(),
    intakePayload: v.any(),
    status: v.union(
      v.literal("requested"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("completed"),
    ),
  })
    .index("by_lawyer", ["lawyerUserId"])
    .index("by_citizen", ["citizenUserId"]),

  auditLogs: defineTable({
    firmId: v.optional(v.id("firms")),
    actorId: v.optional(v.id("users")),
    action: v.string(),
    resource: v.string(),
    metadata: v.any(),
  }).index("by_firm", ["firmId"]),

  // ── Lexology-style legal-updates feed (news / insights / new-law alerts) ─────
  // Populated by the scheduled sync (crons.ts). Public, read-only surface.
  legalUpdates: defineTable({
    title: v.string(),
    summary: v.string(),
    url: v.optional(v.string()),
    source: v.string(), // e.g. "SC", "PIB", "eGazette", "editorial"
    kind: v.union(v.literal("judgment"), v.literal("legislation"), v.literal("news")),
    jurisdiction: v.optional(v.string()), // "IN", "IN-DL", …
    practiceAreas: v.array(v.string()),
    publishedAt: v.number(), // epoch ms — for ordering / freshness
    contentHash: v.string(), // dedup key (idempotent sync)
  })
    .index("by_published", ["publishedAt"])
    .index("by_kind", ["kind"])
    .index("by_hash", ["contentHash"])
    .searchIndex("search_updates", { searchField: "title", filterFields: ["kind", "jurisdiction"] }),

  // Enacted legislation (Acts / amendments) — grounds research on statutes, not only judgments.
  // Stored ALSO as corpusDocuments (docType "statute") for retrieval; this table is the registry.
  legislation: defineTable({
    actName: v.string(),
    jurisdiction: v.string(),
    section: v.optional(v.string()),
    status: v.string(), // "in_force" | "amended" | "repealed"
    effectiveDate: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    contentHash: v.string(),
  })
    .index("by_hash", ["contentHash"])
    .index("by_act", ["actName"]),

  // Citizen chatbot sessions → also the lead-intelligence signal (§10): each session captures
  // the detected legal domain + location + a short summary, so the firm side can see potential
  // clients by practice area. Consent to be contacted is an explicit flag.
  chatSessions: defineTable({
    userId: v.optional(v.id("users")),
    messages: v.array(v.object({ role: v.string(), content: v.string() })),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    location: v.optional(v.string()),
    summary: v.optional(v.string()),
    consentToShare: v.boolean(),
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["category"]),

  // Per-source sync cursor for the scheduled real-time pull (resumable, dedup-aware).
  syncState: defineTable({
    source: v.string(),
    lastRunAt: v.number(),
    lastCursor: v.optional(v.string()),
    itemsIngested: v.number(),
    status: v.string(),
  }).index("by_source", ["source"]),
});
