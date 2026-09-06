"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

const KINDS = [
  { key: "", label: "All" },
  { key: "judgment", label: "Judgments" },
  { key: "legislation", label: "Legislation" },
  { key: "news", label: "News" },
];

function timeAgo(ms: number) {
  const d = Math.floor((Date.now() - ms) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}

export default function UpdatesPage() {
  const [kind, setKind] = useState("");
  const [area, setArea] = useState("");
  const items = useQuery(api.updates.feed, {
    kind: (kind || undefined) as any,
    practiceArea: area || undefined,
  });
  const areas = useQuery(api.updates.practiceAreas);
  const seed = useMutation(api.updates.seedDemoUpdates);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Legal updates</h1>
            <p className="mt-1 text-sm text-slate-500">
              New judgments, enacted legislation and legal news — synced on a schedule and filtered
              by practice area.
            </p>
          </div>
          {items && items.length === 0 && (
            <button className="btn-ghost" onClick={() => void seed()}>
              Load sample updates
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {KINDS.map((k) => (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={`rounded-full px-3 py-1 text-sm ${
                kind === k.key ? "bg-brand text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {k.label}
            </button>
          ))}
          <select className="input ml-auto max-w-[200px]" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">All practice areas</option>
            {areas?.map((a: any) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {items === undefined && <p className="text-slate-500">Loading…</p>}
          {items?.length === 0 && (
            <p className="text-sm text-slate-400">
              No updates yet. Configure feed sources (UPDATE_JSON_FEEDS / UPDATE_RSS_FEEDS) or load
              the sample set.
            </p>
          )}
          {items?.map((it: any) => (
            <article key={it._id} className="card">
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="badge capitalize">{it.kind}</span>
                {it.jurisdiction && <span className="badge">{it.jurisdiction}</span>}
                <span>· {it.source}</span>
                <span>· {timeAgo(it.publishedAt)}</span>
              </div>
              <h2 className="font-semibold text-slate-900">
                {it.url ? (
                  <a href={it.url} target="_blank" rel="noreferrer" className="hover:text-brand">
                    {it.title}
                  </a>
                ) : (
                  it.title
                )}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{it.summary}</p>
              {it.practiceAreas.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {it.practiceAreas.map((a: string) => (
                    <span key={a} className="badge">
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
