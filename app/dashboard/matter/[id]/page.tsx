"use client";

import { useAction, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

export default function MatterPage() {
  const params = useParams();
  const matterId = params.id as string;
  const data = useQuery(api.crm.getMatter, { matterId: matterId as any });

  return (
    <>
      <Nav />
      <main className="page-container">
        {data === undefined ? (
          <div className="card">
            <div className="h-5 w-40 rounded bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-8">
            <header className="card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-label">LEGAL MATTER</p>
                  <h1 className="mt-2 text-3xl font-black text-navy">{data.matter.title}</h1>
                  <p className="mt-3 text-sm text-slate-500">
                    {data.client?.name} · {data.matter.category}/{data.matter.subcategory}
                    <span className="ml-3 badge">{data.matter.status}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="btn-ghost">Review checklist</button>
                  <button className="btn">Generate draft</button>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">{data.matter.summaryText}</p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <ResearchPanel matterId={matterId} defaultQuery={data.matter.summaryText} />
              <RightSummaryPanel data={data} />
            </div>

            {data.briefs.length > 0 && (
              <DraftPanel briefId={data.briefs[0]._id} briefs={data.briefs} />
            )}

            {data.drafts.length > 0 && (
              <section className="card">
                <h2 className="mb-4 text-xl font-black text-navy">Drafts</h2>

                {data.drafts.map((d: any) => (
                  <details key={d._id} className="mb-3 rounded-2xl border border-slate-200 p-4" open>
                    <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
                      {d.docType} <span className="ml-2 badge">{d.status}</span>
                    </summary>

                    <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                      {d.content}
                    </pre>
                  </details>
                ))}
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function RightSummaryPanel({ data }: { data: any }) {
  return (
    <aside className="space-y-6">
      <div className="card">
        <p className="section-label">MATTER OVERVIEW</p>
        <h2 className="mt-2 text-xl font-black text-navy">Legal snapshot</h2>

        <div className="mt-5 space-y-4 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Client</p>
            <p className="mt-1 font-semibold text-slate-800">{data.client?.name}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Category</p>
            <p className="mt-1 font-semibold text-slate-800">
              {data.matter.category} / {data.matter.subcategory}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Status</p>
            <p className="mt-1 font-semibold text-slate-800">{data.matter.status}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="section-label">AI INDICATORS</p>
        <h2 className="mt-2 text-xl font-black text-navy">Research quality</h2>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Verified authorities</p>
            <p className="mt-1 text-2xl font-black text-navy">{data.briefs?.length || 0}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Drafts generated</p>
            <p className="mt-1 text-2xl font-black text-navy">{data.drafts?.length || 0}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ResearchPanel({ matterId, defaultQuery }: { matterId: string; defaultQuery: string }) {
  const runResearch = useAction(api.research.runResearch);
  const [query, setQuery] = useState(defaultQuery);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  return (
    <section className="card">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="section-label">RESEARCH</p>
          <h2 className="mt-2 text-xl font-black text-navy">Grounded legal research</h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue/10 text-lg">
          🔎
        </div>
      </div>

      <textarea
        className="input min-h-[110px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="btn mt-4"
        disabled={busy || !query}
        onClick={async () => {
          setBusy(true);
          setResult(await runResearch({ matterId: matterId as any, query }));
          setBusy(false);
        }}
      >
        {busy ? "Researching..." : "Run grounded research"}
      </button>

      {result && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge">model: {result.modelUsed}</span>
            <span className="badge">
              fabrication rate: {(result.fabricationRate * 100).toFixed(0)}%
            </span>
            <span className="badge">dropped: {result.droppedCount}</span>
          </div>

          {result.authorities.length === 0 && (
            <p className="text-sm text-amber-700">
              No authorities verified. Load the demo corpus or ingest judgments first.
            </p>
          )}

          {result.authorities.map((a: any, i: number) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-900">
                {a.caseName}{" "}
                {a.citationString && <span className="text-slate-500">— {a.citationString}</span>}
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-700">{a.summary}</p>

              <p className="mt-2 text-xs text-slate-500">
                verified via {a.matchMethod}
                {a.sourceUrl && (
                  <>
                    {" · "}
                    <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="text-blue underline">
                      source
                    </a>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function DraftPanel({ briefId, briefs }: { briefId: string; briefs: any[] }) {
  const generate = useAction(api.drafting.generateDraft);
  const [docType, setDocType] = useState("legal_notice");
  const [facts, setFacts] = useState("");
  const [busy, setBusy] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [selected, setSelected] = useState(briefId);

  return (
    <section className="card">
      <div className="mb-5">
        <p className="section-label">DRAFTING</p>
        <h2 className="mt-2 text-xl font-black text-navy">Generate legal draft</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {briefs.map((b) => (
            <option key={b._id} value={b._id}>
              Brief · {new Date(b._creationTime).toLocaleString()}
            </option>
          ))}
        </select>

        <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="legal_notice">Legal notice</option>
          <option value="claim_petition">Claim petition</option>
          <option value="demand_letter">Demand letter</option>
          <option value="written_statement">Written statement</option>
        </select>
      </div>

      <textarea
        className="input mt-3 min-h-[120px]"
        placeholder="Key facts for the draft"
        value={facts}
        onChange={(e) => setFacts(e.target.value)}
      />

      <button
        className="btn mt-4"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const r = await generate({ briefId: selected as any, docType, facts });
          setContent(r.content);
          setBusy(false);
        }}
      >
        {busy ? "Drafting..." : "Generate draft"}
      </button>

      {content && (
        <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          {content}
        </pre>
      )}
    </section>
  );
}