// Intelligent citizen chatbot (§1, §8, §10).
// - Classifies the user's problem into a legal domain (our taxonomy) using the LLM.
// - Detects whether it still needs the user's location before suggesting advocates.
// - Returns a plain-language answer + a one-line matter summary.
// - Persists the session as a lead-intelligence signal (domain + location + summary), with an
//   explicit consent flag before anything is shared with advocates.
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalMutation, query } from "./_generated/server";
import { complete } from "./lib/llm";
import { redactPii } from "./lib/pii";
import { requireUser } from "./model/access";

const CATEGORIES = [
  { key: "motor_vehicle", label: "Motor Vehicle (accidents, insurance claims, vehicle loans)" },
  { key: "consumer", label: "Consumer Dispute (defective goods/services, refunds)" },
  { key: "property", label: "Property / Tenancy (rent, eviction, title)" },
  { key: "other", label: "Other / general" },
];

const SYS = `You are NyayaSetu's citizen legal-information assistant for Indian law. You give general
INFORMATION, not legal advice. Be warm, plain-language, and concise.

Classify the user's issue into ONE category from this list (use the key):
${CATEGORIES.map((c) => `- ${c.key}: ${c.label}`).join("\n")}

Return STRICT JSON ONLY (no markdown, no prose outside JSON) with this shape:
{
  "answer": "2-5 sentence plain-language explanation of their situation, relevant law/act, and the next practical step",
  "category": "one of the keys above",
  "subcategory": "short label e.g. 'accident claim + loan dispute' or empty",
  "act": "the main Indian act/law that applies, e.g. 'Motor Vehicles Act, 1988' or empty",
  "needsLocation": true if you do NOT yet know the user's city and should ask for it to suggest a nearby advocate,
  "location": "the user's city if they mentioned it, else empty",
  "summary": "one short line summarizing the user's problem"
}`;

function parseJson(text: string): any {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

export const saveSession = internalMutation({
  args: {
    sessionId: v.optional(v.id("chatSessions")),
    userId: v.optional(v.id("users")),
    messages: v.array(v.object({ role: v.string(), content: v.string() })),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    location: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"chatSessions">> => {
    if (args.sessionId) {
      const existing = await ctx.db.get(args.sessionId);
      if (existing) {
        await ctx.db.patch(args.sessionId, {
          messages: args.messages,
          category: args.category,
          subcategory: args.subcategory,
          location: args.location,
          summary: args.summary,
        });
        return args.sessionId;
      }
    }
    return ctx.db.insert("chatSessions", {
      userId: args.userId,
      messages: args.messages,
      category: args.category,
      subcategory: args.subcategory,
      location: args.location,
      summary: args.summary,
      consentToShare: false,
      createdAt: Date.now(),
    });
  },
});

export const respond = action({
  args: {
    sessionId: v.optional(v.id("chatSessions")),
    history: v.array(v.object({ role: v.string(), content: v.string() })),
    message: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    answer: string;
    category: string;
    subcategory: string;
    act: string;
    needsLocation: boolean;
    location: string;
    summary: string;
    sessionId: Id<"chatSessions">;
    modelUsed: string;
  }> => {
    // §9.2: redact PII before the (free-tier-capable) LLM call.
    const safeMessage = redactPii(args.message).text;
    const convo = [...args.history, { role: "user", content: safeMessage }]
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const res = await complete("general", SYS, `Conversation so far:\n${convo}\n\nRespond as JSON.`);
    const parsed = parseJson(res.text) ?? {};

    const answer: string =
      parsed.answer ||
      "I can help with general legal information. Could you describe your issue in a bit more detail?";
    const category: string = parsed.category || "other";
    const subcategory: string = parsed.subcategory || "";
    const act: string = parsed.act || "";
    const location: string = parsed.location || "";
    const needsLocation: boolean =
      typeof parsed.needsLocation === "boolean" ? parsed.needsLocation : !location;
    const summary: string = parsed.summary || safeMessage.slice(0, 140);

    const messages = [...args.history, { role: "user", content: safeMessage }, { role: "assistant", content: answer }];
    const sessionId: Id<"chatSessions"> = await ctx.runMutation(internal.chat.saveSession, {
      sessionId: args.sessionId,
      messages,
      category,
      subcategory,
      location: location || undefined,
      summary,
    });

    return {
      answer,
      category,
      subcategory,
      act,
      needsLocation,
      location,
      summary,
      sessionId,
      modelUsed: `${res.provider}:${res.model}`,
    };
  },
});

// Mark a session as consenting to be shared with advocates (explicit opt-in for lead routing),
// capturing the contact details the citizen agrees to share.
export const consentToShare = internalMutation({
  args: {
    sessionId: v.id("chatSessions"),
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      consentToShare: true,
      contactName: args.contactName,
      contactPhone: args.contactPhone,
    });
  },
});

export const grantConsent = action({
  args: {
    sessionId: v.id("chatSessions"),
    contactName: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ ok: boolean }> => {
    await ctx.runMutation(internal.chat.consentToShare, {
      sessionId: args.sessionId,
      contactName: args.contactName,
      contactPhone: args.contactPhone,
    });
    return { ok: true };
  },
});

// Firm-side lead inbox (§10): consented sessions the advocate can act on.
export const leads = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    const sessions = await ctx.db.query("chatSessions").order("desc").take(200);
    return sessions
      .filter((s) => s.consentToShare)
      .map((s) => ({
        _id: s._id,
        category: s.category ?? "other",
        location: s.location ?? "",
        summary: s.summary ?? "",
        contactName: s.contactName ?? "",
        contactPhone: s.contactPhone ?? "",
        createdAt: s.createdAt,
      }));
  },
});
