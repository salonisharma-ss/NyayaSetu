"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              From a client&apos;s raw problem to a research-backed draft — without opening a law book.
            </h1>
            <p className="mt-4 text-slate-600">
              Structured intake → grounded AI legal research over a verified Indian-judgment corpus →
              assisted drafting. Every citation is verified against the corpus before you see it.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li>✅ Path-specific document checklists</li>
              <li>✅ Retrieval-grounded research briefs — no hallucinated citations</li>
              <li>✅ First-draft legal notices & petitions</li>
              <li>✅ Live feed of new judgments & legislation, synced on a schedule</li>
              <li>✅ Citizen legal-information assistant + verified-advocate directory</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link href="/citizen" className="btn-ghost">
                Ask a legal question
              </Link>
              <Link href="/marketplace" className="btn-ghost">
                Find an advocate
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Authenticated>
              <div className="card w-full max-w-sm text-center">
                <p className="mb-4 text-slate-700">You&apos;re signed in.</p>
                <Link href="/dashboard" className="btn w-full">
                  Go to your workspace →
                </Link>
              </div>
            </Authenticated>
            <Unauthenticated>
              <AuthForm />
            </Unauthenticated>
          </div>
        </div>
      </main>
    </>
  );
}
