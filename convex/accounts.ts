import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { currentUserId, requireUser } from "./model/access";

export const ensureProfile = mutation({
  args: {
    accountType: v.union(v.literal("citizen"), v.literal("advocate")),
  },
  handler: async (ctx, { accountType }) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      if (existing.accountType !== accountType) {
        throw new Error(
          `This email is already registered as a ${existing.accountType}. Sign in using that account type.`,
        );
      }
      return existing;
    }

    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      accountType,
      displayName: undefined,
      phone: undefined,
      city: undefined,
      onboardingComplete: false,
      createdAt: Date.now(),
    });

    if (accountType === "advocate") {
      const firmId = await ctx.db.insert("firms", {
        name: "My Legal Practice",
        ownerUserId: userId,
        plan: "basic",
      });
      await ctx.db.insert("memberships", { userId, firmId, role: "firm_admin" });
    }

    return await ctx.db.get(profileId);
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await currentUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return null;

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const lawyerProfile = await ctx.db
      .query("lawyerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return {
      userId,
      email: user?.email ?? null,
      name: user?.name ?? profile.displayName ?? null,
      phone: user?.phone ?? profile.phone ?? null,
      accountType: profile.accountType,
      onboardingComplete: profile.onboardingComplete,
      firmId: membership?.firmId ?? null,
      role: membership?.role ?? null,
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
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Complete account setup before editing your profile.");

    await ctx.db.patch(profile._id, {
      displayName: args.displayName.trim(),
      phone: args.phone?.trim() || undefined,
      city: args.city?.trim() || undefined,
      onboardingComplete: true,
    });
    await ctx.db.patch(userId, {
      name: args.displayName.trim(),
      phone: args.phone?.trim() || undefined,
    });
    return profile._id;
  },
});
