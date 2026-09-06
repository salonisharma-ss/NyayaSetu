"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

export default function MarketplacePage() {
  const [city, setCity] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const seed = useMutation(api.marketplace.seedSampleLawyers);
  const results = useQuery(api.marketplace.searchDirectory, {
    city: city || undefined,
    practiceArea: practiceArea || undefined,
  });

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold">Verified advocate directory</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search and filter verified, BCI-enrolled advocates. You choose who to contact — results are
          ordered neutrally, never ranked.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <input className="input" placeholder="Filter by city" value={city} onChange={(e) => setCity(e.target.value)} />
          <input
            className="input"
            placeholder="Filter by practice area"
            value={practiceArea}
            onChange={(e) => setPracticeArea(e.target.value)}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {results?.map((p: any) => (
            <div key={p._id} className="card">
              <p className="font-semibold">{p.displayName}</p>
              {p.bciEnrolmentNo && <p className="text-xs text-slate-400">BCI: {p.bciEnrolmentNo}</p>}
              <p className="mt-1 text-sm text-slate-600">{p.practiceAreas.join(", ")}</p>
              <p className="text-xs text-slate-500">
                {p.city} · {p.languages.join(", ")} · {p.feeRange}
              </p>
            </div>
          ))}
          {results?.length === 0 && (
            <div className="text-sm text-slate-400">
              <p>No verified advocates listed yet.</p>
              <button className="btn-ghost mt-3" onClick={() => void seed()}>
                Load sample advocates
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
