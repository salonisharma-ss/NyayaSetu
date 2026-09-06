import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

// Email + password auth. Deployable on Convex + Vercel with no third-party provider.
// Run `npx @convex-dev/auth` once to generate the JWT keys in your Convex deployment.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
