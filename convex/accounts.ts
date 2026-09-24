import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { currentUserId, requireUser } from "./model/access";

export const ensureProfile = mutation({
  args: {
    accountType: v.union(v.literal("citizen"), v.literal("advocate")),
  },
  handler: async (ctx, { accountType }) => {
    const userId = await requireUser(ctx);
    const desiredRole = accountType === "advocate" ? "firm_admin" : "citizen";
    const existingMembership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingMembership) {
      const existingType = existingMembership.role === "citizen" ? "citizen" : "advocate";
      if (existingType !== accountType) {
        throw new Error(
          `This email is already registered as a ${existingType}. Sign in using that account type.`,
        );
      }
      return { accountType, role: existingMembership.role, firmId: existingMembership.firmId };
    }

    const firmId = await ctx.db.insert("firms", {
      name: accountType === "advocate" ? "My Legal Practice" : "Citizen Account",
      ownerUserId: userId,
      plan: "basic",
    });

    await ctx.db.insert("memberships", {
      userId,
      firmId,
      role: desiredRole,
    });

    return { accountType, role: desiredRole, firmId };
  },
});

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

    if (!membership) return null;

    const lawyerProfile = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return {
      userId,
      email: user?.email ?? null,
      name: user?.name ?? null,
      phone: user?.phone ?? null,
      accountType: membership.role === "citizen" ? "citizen" : "advocate",
      role: membership.role,
      firmId: membership.firmId,
      lawyerProfileId: lawyerProfile?._id ?? null,
    };
  },
});

export const updateProfile = mutation({
  args: {
    displayName: v.string(),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership) throw new Error("Complete account setup before editing your profile.");

    await ctx.db.patch(userId, {
      name: args.displayName.trim(),
      phone: args.phone?.trim() || undefined,
    });

    const lawyerProfile = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (lawyerProfile && args.city !== undefined) {
      await ctx.db.patch(lawyerProfile._id, { city: args.city.trim() || undefined });
    }

    return userId;
  },
});
