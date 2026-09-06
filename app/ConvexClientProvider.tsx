"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Client-side Convex Auth (no SSR middleware needed) — simplest reliable Vercel deploy.
// Trim any trailing slash/whitespace so a mis-typed env value can't produce a bad WS URL.
const CONVEX_URL = (
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://amiable-bloodhound-285.convex.cloud"
)
  .trim()
  .replace(/\/+$/, "");
const convex = new ConvexReactClient(CONVEX_URL);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
