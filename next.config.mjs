/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint is not run during builds (it runs in dev / CI).
  eslint: { ignoreDuringBuilds: true },
  // Type errors do not block the production build. Authoritative typechecking runs in CI
  // (`npm run typecheck` + `npm run typecheck:convex`) and locally via `npx convex dev`.
  // This keeps the Vercel build resilient to environment-specific TS resolution differences.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
