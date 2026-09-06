// Access-control helpers — tenant isolation (§9.4) enforced in every firm-scoped function.
// Convex has no RLS; instead EVERY read/write of a firm-scoped table goes through these guards,
// which verify the caller is a member of the firm. Never query a firm-scoped table without one.
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function requireUser(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function currentUserId(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users"> | null> {
  return getAuthUserId(ctx);
}

/** Assert the caller belongs to `firmId`; returns their role. Throws otherwise. */
export async function requireFirmMember(
  ctx: QueryCtx | MutationCtx,
  firmId: Id<"firms">,
): Promise<{ userId: Id<"users">; role: string }> {
  const userId = await requireUser(ctx);
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_user_firm", (q) => q.eq("userId", userId).eq("firmId", firmId))
    .unique();
  if (!membership) throw new Error("Forbidden: not a member of this firm");
  return { userId, role: membership.role };
}

/** The caller's primary firm (first membership). Creates none — see firms.bootstrap. */
export async function primaryFirm(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"firms"> | null> {
  const userId = await currentUserId(ctx);
  if (!userId) return null;
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  return membership?.firmId ?? null;
}

export async function audit(
  ctx: MutationCtx,
  action: string,
  resource: string,
  firmId?: Id<"firms">,
  metadata: unknown = {},
): Promise<void> {
  const actorId = await currentUserId(ctx);
  await ctx.db.insert("auditLogs", {
    firmId,
    actorId: actorId ?? undefined,
    action,
    resource,
    metadata,
  });
}
