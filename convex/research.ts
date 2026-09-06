import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { extractAllCitations } from "./lib/citation";
import { embedOne } from "./lib/embeddings";
import { complete } from "./lib/llm";
import { requireFirmMember } from "./model/access";

const SUMMARY_SYS =
  "You are a legal research assistant. Summarize ONLY the provided source passage. Do not add " +
  "facts, holdings, or citations not present in it. If the passage does not support a point, omit it.";

// ── internal helpers ─────────────────────────────────────────────────────────
export const matterAccess = internalQuery({
  args: { matterId: v.id("matters") },
  handler: async (ctx, { matterId }) => {
    const matter = await ctx.db.get(matterId);
    if (!matter) throw new Error("Matter not found");
    await requireFirmMember(ctx, matter.firmId);
    return { firmId: matter.firmId, matter };
  },
});

/**
 * Turn vector-search hits into grounded authorities. Because each retrieved chunk carries its
 * corpus documentId, the source authority is verified BY CONSTRUCTION (it is in the corpus) — no
 * fuzzy matching needed. We dedupe by document, keep the best-scoring passage, and attach the
 * document's own stored (raw) citation for display. We also return the passages so the action can
 * verify any INLINE cross-citations to OTHER cases.
 */
export const retrievedAuthorities = internalQuery({
  args: { ids: v.array(v.id("corpusChunks")) },
  handler: async (ctx, { ids }) => {
    const byDoc = new Map<
      string,
      { documentId: string; caseName: string; sourceUrl: string | null; citation: string; passage: string }
    >();
    const passages: string[] = [];
    for (const id of ids) {
      const c = await ctx.db.get(id);
      if (!c) continue;
      passages.push(c.text);
      const key = c.documentId as unknown as string;
      if (!byDoc.has(key)) {
        const doc = await ctx.db.get(c.documentId);
        byDoc.set(key, {
          documentId: key,
          caseName: c.caseName,
          sourceUrl: c.sourceUrl ?? null,
          citation: doc?.citations?.[0] ?? "",
          passage: c.text,
        });
      }
    }
    return { authorities: [...byDoc.values()], passages };
  },
});

export const saveBrief = internalMutation({
  args: {
    firmId: v.id("firms"),
    matterId: v.id("matters"),
    modelUsed: v.string(),
    sensitivity: v.union(v.literal("privileged"), v.literal("general")),
    queryText: v.string(),
    body: v.string(),
    fabricationRate: v.number(),
    droppedCount: v.number(),
    authorities: v.array(
      v.object({
        caseName: v.string(),
        citationString: v.string(),
        sourceUrl: v.optional(v.string()),
        corpusDocumentId: v.optional(v.id("corpusDocuments")),
        relevancePassage: v.string(),
        matchMethod: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await requireFirmMember(ctx, args.firmId);
    const briefId = await ctx.db.insert("researchBriefs", {
      firmId: args.firmId,
      matterId: args.matterId,
      modelUsed: args.modelUsed,
      sensitivity: args.sensitivity,
      status: "generated",
      queryText: args.queryText,
      body: args.body,
      fabricationRate: args.fabricationRate,
      droppedCount: args.droppedCount,
    });
    for (const a of args.authorities) {
      await ctx.db.insert("citations", {
        firmId: args.firmId,
        briefId,
        caseName: a.caseName,
        citationString: a.citationString,
        sourceUrl: a.sourceUrl,
        corpusDocumentId: a.corpusDocumentId,
        verificationStatus: "verified",
        relevancePassage: a.relevancePassage,
        matchMethod: a.matchMethod,
      });
    }
    await ctx.db.patch(args.matterId, { status: "research" });
    return briefId;
  },
});

// ── public action ─────────────────────────────────────────────────────────────
export const runResearch = action({
  args: {
    matterId: v.id("matters"),
    query: v.string(),
    sensitivity: v.optional(v.union(v.literal("privileged"), v.literal("general"))),
    topK: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    briefId: Id<"researchBriefs">;
    modelUsed: string;
    fabricationRate: number;
    droppedCount: number;
    authorities: any[];
    body: string;
  }> => {
    const sensitivity = args.sensitivity ?? "privileged";
    const topK = args.topK ?? 8;
    const { firmId } = await ctx.runQuery(internal.research.matterAccess, {
      matterId: args.matterId,
    });

    // 1) retrieve from the grounded corpus (vector search — actions only)
    const qvec = await embedOne(args.query);
    const hits = await ctx.vectorSearch("corpusChunks", "by_embedding", {
      vector: qvec,
      limit: topK,
    });
    const { authorities: retrieved, passages } = await ctx.runQuery(
      internal.research.retrievedAuthorities,
      { ids: hits.map((h) => h._id as Id<"corpusChunks">) },
    );

    // 2) INLINE cross-citations found in retrieved text are candidates for additional authorities;
    //    verify them against the corpus (unresolved are dropped -> fabricationRate).
    const inlineCandidates: { caseName: string; citationString: string; relevancePassage: string }[] = [];
    for (const p of passages) {
      for (const pc of extractAllCitations(p)) {
        inlineCandidates.push({ caseName: "", citationString: pc.raw, relevancePassage: p.slice(0, 400) });
      }
    }
    const vres = await ctx.runQuery(internal.verify.verifyCitations, {
      candidates: inlineCandidates,
    });

    // 3) authorities = retrieved docs (grounded by construction) + verified inline cross-cites,
    //    deduped by document. Summarize each over its own passage only.
    const merged = new Map<
      string,
      { caseName: string; citationString: string; sourceUrl?: string; corpusDocumentId?: string; relevancePassage: string; matchMethod: string }
    >();
    for (const a of retrieved) {
      merged.set(a.documentId, {
        caseName: a.caseName,
        citationString: a.citation,
        sourceUrl: a.sourceUrl ?? undefined,
        corpusDocumentId: a.documentId,
        relevancePassage: a.passage,
        matchMethod: "retrieval",
      });
    }
    for (const v of vres.verified) {
      if (!merged.has(v.corpusDocumentId)) {
        merged.set(v.corpusDocumentId, {
          caseName: v.caseName,
          citationString: v.citationString,
          sourceUrl: v.sourceUrl ?? undefined,
          corpusDocumentId: v.corpusDocumentId,
          relevancePassage: v.relevancePassage,
          matchMethod: v.matchMethod,
        });
      }
    }

    const authorities = [];
    let modelUsed = "echo";
    for (const a of merged.values()) {
      const res = await complete(
        sensitivity,
        SUMMARY_SYS,
        `Summarize this passage from ${a.caseName} in 2-3 sentences, grounded strictly in the ` +
          `text.\n\nCONTEXT:\n${a.relevancePassage}`,
      );
      modelUsed = `${res.provider}:${res.model}`;
      authorities.push({ ...a, summary: res.text.trim() });
    }

    const body = renderBody(args.query, authorities);
    const briefId = await ctx.runMutation(internal.research.saveBrief, {
      firmId,
      matterId: args.matterId,
      modelUsed,
      sensitivity,
      queryText: args.query,
      body,
      fabricationRate: vres.fabricationRate,
      droppedCount: vres.droppedCount,
      authorities: authorities.map((a) => ({
        caseName: a.caseName,
        citationString: a.citationString,
        sourceUrl: a.sourceUrl,
        corpusDocumentId: a.corpusDocumentId as Id<"corpusDocuments"> | undefined,
        relevancePassage: a.relevancePassage,
        matchMethod: a.matchMethod,
      })),
    });

    return {
      briefId,
      modelUsed,
      fabricationRate: vres.fabricationRate,
      droppedCount: vres.droppedCount,
      authorities,
      body,
    };
  },
});

function renderBody(
  query: string,
  authorities: { caseName: string; citationString: string; sourceUrl?: string; summary: string; relevancePassage: string }[],
): string {
  const lines = [`# Research brief\n`, `**Issue:** ${query}\n`, `## Authorities (verified)\n`];
  if (authorities.length === 0) {
    lines.push("_No authorities could be verified against the corpus for this query._");
  }
  authorities.forEach((a, i) => {
    const cite = a.citationString ? ` — ${a.citationString}` : "";
    const src = a.sourceUrl ? ` ([source](${a.sourceUrl}))` : "";
    lines.push(`### ${i + 1}. ${a.caseName}${cite}${src}`);
    lines.push(a.summary);
    lines.push(`> ${a.relevancePassage.trim().slice(0, 300)}…\n`);
  });
  return lines.join("\n");
}
