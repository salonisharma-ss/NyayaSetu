import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser, currentUserId } from "./model/access";

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
    });

    return await ctx.db.get(profileId);
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await currentUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
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
    return profile._id;
  },
});
