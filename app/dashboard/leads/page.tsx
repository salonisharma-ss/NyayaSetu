"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

const CATEGORY_LABEL: Record<string, string> = {
  motor_vehicle: "Motor Vehicle",
  consumer: "Consumer Dispute",
  property: "Property / Tenancy",
  other: "General",
};

export default function LeadsPage() {
  return (
    <>
      <Nav />

      <main className="page-container">
        <Unauthenticated>
          <div className="card mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-black text-navy">Client leads</h1>
            <p className="mt-2 text-sm text-slate-600">
              Please <Link href="/" className="text-blue underline">sign in</Link> to view leads.
            </p>
          </div>
        </Unauthenticated>

        <Authenticated>
          <Leads />
        </Authenticated>
      </main>
    </>
  );
}

function Leads() {
  const leads = useQuery(api.chat.leads, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-label">CLIENT LEADS</p>
          <h1 className="mt-2 text-3xl font-black text-navy">Consented leads</h1>
        </div>

        <Link href="/dashboard" className="btn-ghost">
          ← Workspace
        </Link>
      </div>

      <p className="text-sm leading-6 text-slate-600">
        Citizens who used the assistant and consented to be connected with an advocate. Only what they approved is shown.
      </p>

      {leads === undefined && (
        <div className="card">
          <div className="h-5 w-40 rounded bg-slate-200" />
        </div>
      )}

      {leads?.length === 0 && (
        <div className="card">
          <p className="text-sm text-slate-500">
            No consented leads yet. They appear here when a citizen opts in from the assistant.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {leads?.map((l: any) => (
          <div key={l._id} className="card">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
              <span className="badge">{CATEGORY_LABEL[l.category] ?? l.category}</span>
              {l.location && <span className="badge">{l.location}</span>}
              <span>{new Date(l.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-sm leading-7 text-slate-700">{l.summary}</p>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="font-semibold text-slate-900">{l.contactName || "—"}</p>

              {l.contactPhone && (
                <a href={`tel:${l.contactPhone}`} className="mt-1 inline-block text-sm text-blue hover:underline">
                  {l.contactPhone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}