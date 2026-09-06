// C2 verified advocate directory + C3 booking (Side B). Compliance-safe (§9.1 BCI Rule 36):
//   - Only VERIFIED + LISTED profiles are returned.
//   - Neutral ordering (city, then name) — NO ranking by engagement/quality.
//   - BCI-permissible particulars only; citizen-initiated selection; no auto-matching.
//   - Flat listing fee model; NO commission (fee-sharing is the sharpest exposure).
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./model/access";

export const upsertLawyerProfile = mutation({
  args: {
    displayName: v.string(),
    bciEnrolmentNo: v.optional(v.string()),
    practiceAreas: v.array(v.string()),
    languages: v.array(v.string()),
    city: v.optional(v.string()),
    feeRange: v.optional(v.string()),
    listed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    const fields = {
      userId,
      displayName: args.displayName,
      bciEnrolmentNo: args.bciEnrolmentNo,
      practiceAreas: args.practiceAreas,
      languages: args.languages,
      city: args.city,
      feeRange: args.feeRange,
      listed: args.listed,
      // verification (C4) is set by an admin workflow, never self-serve.
      verified: existing?.verified ?? false,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    }
    return ctx.db.insert("lawyerProfiles", fields);
  },
});

// Public search — search/filter only, no ranking. Permissible particulars.
export const searchDirectory = query({
  args: {
    practiceArea: v.optional(v.string()),
    language: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let profiles = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_listed_verified", (q) => q.eq("listed", true).eq("verified", true))
      .collect();
    if (args.practiceArea) {
      profiles = profiles.filter((p) => p.practiceAreas.includes(args.practiceArea!));
    }
    if (args.language) profiles = profiles.filter((p) => p.languages.includes(args.language!));
    if (args.city) profiles = profiles.filter((p) => p.city === args.city);
    // Neutral ordering (never a quality/engagement score).
    profiles.sort((a, b) => (a.city ?? "").localeCompare(b.city ?? "") || a.displayName.localeCompare(b.displayName));
    // Expose permissible particulars only.
    return profiles.map((p) => ({
      _id: p._id,
      userId: p.userId,
      displayName: p.displayName,
      bciEnrolmentNo: p.bciEnrolmentNo,
      practiceAreas: p.practiceAreas,
      languages: p.languages,
      city: p.city,
      feeRange: p.feeRange,
    }));
  },
});

// C3 booking — citizen self-selects a lawyer; intake transfers to that lawyer. No routing.
export const requestBooking = mutation({
  args: {
    lawyerUserId: v.id("users"),
    slot: v.string(),
    intakePayload: v.any(),
  },
  handler: async (ctx, args) => {
    const citizenUserId = await requireUser(ctx);
    const profile = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.lawyerUserId))
      .unique();
    if (!profile || !profile.listed || !profile.verified) {
      throw new Error("Lawyer is not available for booking");
    }
    return ctx.db.insert("bookings", {
      citizenUserId,
      lawyerUserId: args.lawyerUserId,
      slot: args.slot,
      intakePayload: args.intakePayload,
      status: "requested",
    });
  },
});

// Seed a few FICTIONAL sample advocates so the directory demonstrates fully before real lawyers
// self-register. These are not real people (no real names/BCI numbers). Real listings come from
// lawyer self-registration (upsertLawyerProfile) + admin verification, or a CSV import — never
// from scraping third-party sites (ToS + DPDP + BCI Rule 36 concerns).
export const seedSampleLawyers = mutation({
  args: {},
  handler: async (ctx) => {
    const samples = [
      { displayName: "Adv. A. Sample (demo)", bciEnrolmentNo: "DEMO/0001/2020", practiceAreas: ["Motor Vehicle", "Insurance"], languages: ["English", "Hindi"], city: "Delhi", feeRange: "₹2,000–₹5,000" },
      { displayName: "Adv. B. Example (demo)", bciEnrolmentNo: "DEMO/0002/2019", practiceAreas: ["Consumer Dispute"], languages: ["English", "Marathi"], city: "Mumbai", feeRange: "₹1,500–₹4,000" },
      { displayName: "Adv. C. Placeholder (demo)", bciEnrolmentNo: "DEMO/0003/2021", practiceAreas: ["Property / Tenancy"], languages: ["English", "Tamil"], city: "Chennai", feeRange: "₹3,000–₹7,000" },
      { displayName: "Adv. D. Specimen (demo)", bciEnrolmentNo: "DEMO/0004/2018", practiceAreas: ["Motor Vehicle", "Consumer Dispute"], languages: ["English", "Kannada"], city: "Bengaluru", feeRange: "₹2,500–₹6,000" },
    ];
    const existing = await ctx.db.query("lawyerProfiles").take(200);
    const seen = new Set(existing.map((p) => p.displayName));
    let inserted = 0;
    for (const s of samples) {
      if (seen.has(s.displayName)) continue;
      // create a placeholder user record so userId is a valid Id<"users">
      const userId = await ctx.db.insert("users", { name: s.displayName });
      await ctx.db.insert("lawyerProfiles", { userId, ...s, listed: true, verified: true });
      inserted++;
    }
    return { inserted };
  },
});

export const myBookingsAsLawyer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return ctx.db
      .query("bookings")
      .withIndex("by_lawyer", (q) => q.eq("lawyerUserId", userId))
      .order("desc")
      .collect();
  },
});
