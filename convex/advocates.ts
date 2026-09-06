// Advocate search (§1, §4). Fetches advocates via a configurable Apify actor when configured,
// otherwise falls back to our own verified directory so the feature always returns results.
//
// Config (Convex env):
//   APIFY_TOKEN   - your Apify API token
//   APIFY_ACTOR   - actor id/name to run (e.g. a Google-Maps/business-directory scraper you have
//                   the right to use). Input sent: { searchStringsArray:[query], maxCrawledPlaces, city }
// Runs from a Convex action (server-side internet), returning results with a click-through URL.
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalQuery } from "./_generated/server";

export interface Advocate {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  url?: string;
  source: string;
}

export const directoryFallback = internalQuery({
  args: { practiceArea: v.optional(v.string()), city: v.optional(v.string()) },
  handler: async (ctx, args): Promise<Advocate[]> => {
    let profiles = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_listed_verified", (q) => q.eq("listed", true).eq("verified", true))
      .collect();
    if (args.practiceArea) profiles = profiles.filter((p) => p.practiceAreas.includes(args.practiceArea!));
    if (args.city) profiles = profiles.filter((p) => (p.city ?? "").toLowerCase() === args.city!.toLowerCase());
    return profiles.map((p) => ({
      name: p.displayName,
      city: p.city,
      source: "directory",
      address: p.practiceAreas.join(", "),
    }));
  },
});

async function runApify(query: string, city: string): Promise<Advocate[]> {
  const token = process.env.APIFY_TOKEN;
  const actor = process.env.APIFY_ACTOR;
  if (!token || !actor) return [];
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(
    actor,
  )}/run-sync-get-dataset-items?token=${token}`;
  const input = {
    searchStringsArray: [query],
    locationQuery: city || "India",
    maxCrawledPlacesPerSearch: 12,
    language: "en",
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`apify ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const items = (await res.json()) as any[];
  return (Array.isArray(items) ? items : []).map((it) => ({
    name: it.title || it.name || "Advocate",
    phone: it.phone || it.phoneUnformatted || undefined,
    address: it.address || it.street || undefined,
    city: it.city || city || undefined,
    url: it.url || it.website || it.googleMapsUrl || undefined,
    source: "apify",
  }));
}

export const findAdvocates = action({
  args: {
    practiceArea: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ source: string; advocates: Advocate[] }> => {
    const area = args.practiceArea || "advocates";
    const city = args.city || "";
    // Try Apify first (real, live results with click-through) when configured.
    if (process.env.APIFY_TOKEN && process.env.APIFY_ACTOR) {
      try {
        const query = `${area} lawyer advocate ${city}`.trim();
        const advocates = await runApify(query, city);
        if (advocates.length > 0) return { source: "apify", advocates };
      } catch {
        // fall through to directory
      }
    }
    const advocates: Advocate[] = await ctx.runQuery(internal.advocates.directoryFallback, {
      practiceArea: args.practiceArea,
      city: args.city,
    });
    return { source: "directory", advocates };
  },
});
