import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { complete } from "./lib/llm";
import { requireFirmMember } from "./model/access";

const DRAFT_SYS =
  "You are an Indian advocate drafting a legal document. Use ONLY the facts and the verified " +
  "authorities provided. Insert citations exactly as given; never invent a citation or a holding. " +
  "Where the brief lacks support for a point, leave a clearly marked [TO CONFIRM] gap rather than " +
  "fabricating. Output clean, professional prose suitable for filing/editing.";

export const briefBundle = internalQuery({
  args: { briefId: v.id("researchBriefs") },
  handler: async (ctx, { briefId }) => {
    const brief = await ctx.db.get(briefId);
    if (!brief) throw new Error("Brief not found");
    await requireFirmMember(ctx, brief.firmId);
    const authorities = await ctx.db
      .query("citations")
      .withIndex("by_brief", (q) => q.eq("briefId", briefId))
      .collect();
    return { brief, authorities };
  },
});

export const saveDraft = internalMutation({
  args: {
    firmId: v.id("firms"),
    matterId: v.id("matters"),
    briefId: v.optional(v.id("researchBriefs")),
    docType: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await requireFirmMember(ctx, args.firmId);
    const id = await ctx.db.insert("drafts", {
      firmId: args.firmId,
      matterId: args.matterId,
      briefId: args.briefId,
      docType: args.docType,
      content: args.content,
      status: "draft",
    });
    await ctx.db.patch(args.matterId, { status: "drafting" });
    return id;
  },
});

export const generateDraft = action({
  args: {
    briefId: v.id("researchBriefs"),
    docType: v.string(),
    facts: v.string(),
    sensitivity: v.optional(v.union(v.literal("privileged"), v.literal("general"))),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ draftId: Id<"drafts">; content: string; modelUsed: string }> => {
    const sensitivity = args.sensitivity ?? "privileged";
    const { brief, authorities } = await ctx.runQuery(internal.drafting.briefBundle, {
      briefId: args.briefId,
    });

    const ctxLines = [`ISSUE: ${brief.queryText}`, "", "VERIFIED AUTHORITIES:"];
    if (authorities.length === 0) {
      ctxLines.push("(none verified — draft on facts only, mark legal points [TO CONFIRM])");
    }
    for (const a of authorities) {
      const cite = a.citationString ? ` (${a.citationString})` : "";
      ctxLines.push(`- ${a.caseName}${cite}: ${a.relevancePassage.slice(0, 200)}`);
    }

    const instruction = `Draft a ${args.docType.replace(/_/g, " ")}.`;
    const prompt =
      `${instruction}\n\nFACTS:\n${args.facts}\n\nCONTEXT:\n${ctxLines.join("\n")}\n\n` +
      "Produce the full document text.";
    const res = await complete(sensitivity, DRAFT_SYS, prompt);

    const draftId = await ctx.runMutation(internal.drafting.saveDraft, {
      firmId: brief.firmId,
      matterId: brief.matterId,
      briefId: args.briefId,
      docType: args.docType,
      content: res.text.trim(),
    });
    return { draftId, content: res.text.trim(), modelUsed: `${res.provider}:${res.model}` };
  },
});
