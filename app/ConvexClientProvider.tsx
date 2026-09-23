"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Use the local Convex dev deployment by default so local auth works without extra config.
// If a deployment URL is explicitly provided, prefer that for production/staging.
const CONVEX_URL = (() => {
  const envValue = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (envValue) return envValue.replace(/\/+$/, "");
  return "http://127.0.0.1:3210";
})();

const convex = new ConvexReactClient(CONVEX_URL);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
