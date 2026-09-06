import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { audit, currentUserId, primaryFirm, requireUser } from "./model/access";

/** Called after sign-up: create the user's firm + firm_admin membership (idempotent). */
export const bootstrap = mutation({
  args: { firmName: v.string() },
  handler: async (ctx, { firmName }) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return existing.firmId;

    const firmId = await ctx.db.insert("firms", {
      name: firmName || "My Firm",
      ownerUserId: userId,
      plan: "basic",
    });
    await ctx.db.insert("memberships", { userId, firmId, role: "firm_admin" });
    await audit(ctx, "firm.create", `firms/${firmId}`, firmId, { firmName });
    return firmId;
  },
});

/** Current user + their primary firm + role. Drives the app shell. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await currentUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    const firm = membership ? await ctx.db.get(membership.firmId) : null;
    return {
      userId,
      email: (user as any)?.email ?? null,
      name: (user as any)?.name ?? null,
      firmId: membership?.firmId ?? null,
      firmName: firm?.name ?? null,
      role: membership?.role ?? null,
    };
  },
});

export const myFirmId = query({
  args: {},
  handler: async (ctx) => primaryFirm(ctx),
});
