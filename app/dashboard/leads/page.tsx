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
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Unauthenticated>
          <p className="text-slate-600">
            Please <Link href="/" className="text-brand underline">sign in</Link> to view leads.
          </p>
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
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Client leads</h1>
        <Link href="/dashboard" className="text-sm text-brand hover:underline">← Workspace</Link>
      </div>
      <p className="mb-5 text-sm text-slate-500">
        Citizens who used the assistant and <b>consented</b> to be connected with an advocate. Only
        what they approved is shown.
      </p>

      {leads === undefined && <p className="text-slate-500">Loading…</p>}
      {leads?.length === 0 && (
        <p className="text-sm text-slate-400">
          No consented leads yet. They appear here when a citizen opts in from the{" "}
          <Link href="/citizen" className="text-brand underline">assistant</Link>.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {leads?.map((l: any) => (
          <div key={l._id} className="card">
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="badge">{CATEGORY_LABEL[l.category] ?? l.category}</span>
              {l.location && <span className="badge">{l.location}</span>}
              <span>· {new Date(l.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-slate-800">{l.summary}</p>
            <div className="mt-2 border-t border-slate-100 pt-2 text-sm">
              <p className="font-medium text-slate-900">{l.contactName || "—"}</p>
              {l.contactPhone && (
                <a href={`tel:${l.contactPhone}`} className="text-brand underline">
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
