"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

export default function Nav() {
  const { signOut } = useAuthActions();
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 sm:px-4">
        <Link href="/" className="shrink-0 font-semibold text-brand">
          <span className="text-base sm:text-lg">⚖️ NyayaSetu</span>
        </Link>
        {/* Horizontally scrollable on small screens so the nav never wraps/overflows. */}
        <nav className="no-scrollbar ml-auto flex items-center gap-3 overflow-x-auto whitespace-nowrap text-sm sm:gap-4">
          <Link href="/updates" className="shrink-0 text-slate-600 hover:text-brand">
            Updates
          </Link>
          <Link href="/citizen" className="shrink-0 text-slate-600 hover:text-brand">
            Ask
          </Link>
          <Link href="/marketplace" className="shrink-0 text-slate-600 hover:text-brand">
            Advocates
          </Link>
          <Authenticated>
            <Link href="/dashboard" className="shrink-0 text-slate-600 hover:text-brand">
              Workspace
            </Link>
            <button onClick={() => void signOut()} className="btn-ghost shrink-0 px-3 py-1.5">
              Sign out
            </button>
          </Authenticated>
          <Unauthenticated>
            <Link href="/" className="btn shrink-0 px-3 py-1.5">
              Sign in
            </Link>
          </Unauthenticated>
        </nav>
      </div>
    </header>
  );
}
