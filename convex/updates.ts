// Lexology-style legal-updates feed + real-time-ish scheduled sync.
//
// The sync (cron target `syncFromFeeds`) pulls new items from configured sources and upserts them,
// deduped and idempotently. Sources are configured via Convex env vars so no code change is needed
// to add a country's feeds:
//   UPDATE_JSON_FEEDS = comma-separated URLs, each returning a JSON array of update objects
//   UPDATE_RSS_FEEDS  = comma-separated RSS/Atom feed URLs (news / court / gazette)
// With none configured, the cron is a graceful no-op. Judgments/legislation ingested elsewhere
// (ingest / ingestBulk) also surface here as feed items.
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { fnv1a } from "./lib/hash";

const updateItem = v.object({
  title: v.string(),
  summary: v.string(),
  url: v.optional(v.string()),
  source: v.string(),
  kind: v.union(v.literal("judgment"), v.literal("legislation"), v.literal("news")),
  jurisdiction: v.optional(v.string()),
  practiceAreas: v.array(v.string()),
  publishedAt: v.number(),
});

// ── Public feed (read-only) ──────────────────────────────────────────────────
export const feed = query({
  args: {
    kind: v.optional(v.union(v.literal("judgment"), v.literal("legislation"), v.literal("news"))),
    practiceArea: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("legalUpdates")
      .withIndex("by_published")
      .order("desc")
      .take(200);
    if (args.kind) items = items.filter((i) => i.kind === args.kind);
    if (args.jurisdiction) items = items.filter((i) => i.jurisdiction === args.jurisdiction);
    if (args.practiceArea) items = items.filter((i) => i.practiceAreas.includes(args.practiceArea!));
    return items.slice(0, args.limit ?? 50);
  },
});

export const practiceAreas = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("legalUpdates").take(500);
    const set = new Set<string>();
    for (const i of items) for (const a of i.practiceAreas) set.add(a);
    return [...set].sort();
  },
});

// ── Upsert (dedup by content hash) ───────────────────────────────────────────
export const upsertUpdate = internalMutation({
  args: { item: updateItem },
  handler: async (ctx, { item }) => {
    const contentHash = fnv1a(`${item.title}|${item.url ?? ""}`);
    const existing = await ctx.db
      .query("legalUpdates")
      .withIndex("by_hash", (q) => q.eq("contentHash", contentHash))
      .first();
    if (existing) return existing._id;
    return ctx.db.insert("legalUpdates", { ...item, contentHash });
  },
});

export const recordSync = internalMutation({
  args: { source: v.string(), itemsIngested: v.number(), status: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("syncState")
      .withIndex("by_source", (q) => q.eq("source", args.source))
      .first();
    const patch = { lastRunAt: Date.now(), itemsIngested: args.itemsIngested, status: args.status };
    if (existing) await ctx.db.patch(existing._id, patch);
    else await ctx.db.insert("syncState", { source: args.source, lastCursor: undefined, ...patch });
  },
});

// ── Scheduled sync (cron target) ─────────────────────────────────────────────
function parseRss(xml: string, source: string): any[] {
  const items: any[] = [];
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/(item|entry)>/gi) ?? [];
  for (const b of blocks) {
    const pick = (tag: string) => {
      const m = b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim() : "";
    };
    const title = pick("title");
    if (!title) continue;
    const link = (b.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? pick("link")).trim();
    const dateStr = pick("pubDate") || pick("updated") || pick("published");
    const publishedAt = dateStr ? Date.parse(dateStr) || Date.now() : Date.now();
    items.push({
      title,
      summary: pick("description") || pick("summary") || title,
      url: link || undefined,
      source,
      kind: "news" as const,
      practiceAreas: [] as string[],
      publishedAt,
    });
  }
  return items;
}

export const syncFromFeeds = internalAction({
  args: {},
  handler: async (ctx) => {
    let total = 0;
    const jsonFeeds = (process.env.UPDATE_JSON_FEEDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const rssFeeds = (process.env.UPDATE_RSS_FEEDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    for (const url of jsonFeeds) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status}`);
        const arr = (await res.json()) as any[];
        for (const raw of Array.isArray(arr) ? arr : []) {
          await ctx.runMutation(internal.updates.upsertUpdate, {
            item: {
              title: String(raw.title ?? "").slice(0, 300),
              summary: String(raw.summary ?? raw.description ?? "").slice(0, 2000),
              url: raw.url ?? raw.link,
              source: String(raw.source ?? "feed"),
              kind: (["judgment", "legislation", "news"].includes(raw.kind)
                ? raw.kind
                : "news") as "judgment" | "legislation" | "news",
              jurisdiction: raw.jurisdiction,
              practiceAreas: Array.isArray(raw.practiceAreas) ? raw.practiceAreas : [],
              publishedAt: Number(raw.publishedAt) || Date.now(),
            },
          });
          total++;
        }
      } catch (e) {
        await ctx.runMutation(internal.updates.recordSync, {
          source: url,
          itemsIngested: 0,
          status: `error: ${String(e).slice(0, 120)}`,
        });
      }
    }

    for (const url of rssFeeds) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status}`);
        const xml = await res.text();
        for (const item of parseRss(xml, new URL(url).hostname)) {
          await ctx.runMutation(internal.updates.upsertUpdate, { item });
          total++;
        }
      } catch (e) {
        await ctx.runMutation(internal.updates.recordSync, {
          source: url,
          itemsIngested: 0,
          status: `error: ${String(e).slice(0, 120)}`,
        });
      }
    }

    await ctx.runMutation(internal.updates.recordSync, {
      source: "sync",
      itemsIngested: total,
      status: "ok",
    });
    return { itemsIngested: total, jsonFeeds: jsonFeeds.length, rssFeeds: rssFeeds.length };
  },
});

// Manual trigger (authenticated) — same work as the cron, on demand.
export const syncNow = action({
  args: {},
  handler: async (ctx): Promise<{ itemsIngested: number }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Sign in to sync");
    return ctx.runAction(internal.updates.syncFromFeeds, {});
  },
});

// Seed a few real, dated demo updates so the feed isn't empty before feeds are configured.
export const seedDemoUpdates = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const day = 86400000;
    const demo = [
      {
        title: "Supreme Court reiterates insurer's duty in third-party motor claims",
        summary:
          "The Court held that a technical breach of policy conditions does not let an insurer avoid liability to third parties under the Motor Vehicles Act; the insurer must satisfy the award and recover from the insured.",
        source: "SC",
        kind: "judgment" as const,
        jurisdiction: "IN",
        practiceAreas: ["Motor Vehicle", "Insurance"],
        publishedAt: now - 1 * day,
      },
      {
        title: "Consumer Protection (E-Commerce) amendments notified",
        summary:
          "Amendments tighten disclosure and grievance-redressal obligations for e-commerce entities, expanding what counts as an unfair trade practice.",
        source: "eGazette",
        kind: "legislation" as const,
        jurisdiction: "IN",
        practiceAreas: ["Consumer Dispute"],
        publishedAt: now - 3 * day,
      },
      {
        title: "High Court clarifies bona fide requirement in tenancy eviction",
        summary:
          "The Court restated the test for a landlord's bona fide requirement and the tenant's protections under the Rent Control framework.",
        source: "HC",
        kind: "judgment" as const,
        jurisdiction: "IN-DL",
        practiceAreas: ["Property / Tenancy"],
        publishedAt: now - 6 * day,
      },
    ];
    let n = 0;
    for (const item of demo) {
      const contentHash = fnv1a(`${item.title}|`);
      const existing = await ctx.db
        .query("legalUpdates")
        .withIndex("by_hash", (q) => q.eq("contentHash", contentHash))
        .first();
      if (!existing) {
        await ctx.db.insert("legalUpdates", { ...item, url: undefined, contentHash });
        n++;
      }
    }
    return { inserted: n };
  },
});
