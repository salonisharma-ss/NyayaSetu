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
      <main className="mx-auto max-w-4xl px-4 py-8">
        {data === undefined ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <div className="space-y-6">
            <header>
              <h1 className="text-2xl font-bold">{data.matter.title}</h1>
              <p className="text-sm text-slate-500">
                {data.client?.name} · {data.matter.category}/{data.matter.subcategory} ·{" "}
                <span className="badge">{data.matter.status}</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">{data.matter.summaryText}</p>
            </header>

            <ResearchPanel matterId={matterId} defaultQuery={data.matter.summaryText} />

            {data.briefs.length > 0 && <DraftPanel briefId={data.briefs[0]._id} briefs={data.briefs} />}

            {data.drafts.length > 0 && (
              <section className="card">
                <h2 className="mb-3 text-lg font-semibold">Drafts</h2>
                {data.drafts.map((d: any) => (
                  <details key={d._id} className="mb-2 rounded-lg border border-slate-200 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      {d.docType} · <span className="badge">{d.status}</span>
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{d.content}</pre>
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

function ResearchPanel({ matterId, defaultQuery }: { matterId: string; defaultQuery: string }) {
  const runResearch = useAction(api.research.runResearch);
  const [query, setQuery] = useState(defaultQuery);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-semibold">Research</h2>
      <textarea className="input" rows={2} value={query} onChange={(e) => setQuery(e.target.value)} />
      <button
        className="btn mt-3"
        disabled={busy || !query}
        onClick={async () => {
          setBusy(true);
          setResult(await runResearch({ matterId: matterId as any, query }));
          setBusy(false);
        }}
      >
        {busy ? "Researching…" : "Run grounded research"}
      </button>

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2 text-xs">
            <span className="badge">model: {result.modelUsed}</span>
            <span className="badge">
              fabrication rate: {(result.fabricationRate * 100).toFixed(0)}%
            </span>
            <span className="badge">dropped: {result.droppedCount}</span>
          </div>
          {result.authorities.length === 0 && (
            <p className="text-sm text-amber-600">
              No authorities verified. Load the demo corpus (Workspace) or ingest judgments first.
            </p>
          )}
          {result.authorities.map((a: any, i: number) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">
                {a.caseName} {a.citationString && <span className="text-slate-500">— {a.citationString}</span>}
              </p>
              <p className="mt-1 text-sm text-slate-600">{a.summary}</p>
              <p className="mt-1 text-xs text-slate-400">
                verified via {a.matchMethod}
                {a.sourceUrl && (
                  <>
                    {" · "}
                    <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="text-brand underline">
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
      <h2 className="mb-3 text-lg font-semibold">Draft</h2>
      <div className="grid gap-2 sm:grid-cols-2">
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
        className="input mt-2"
        rows={3}
        placeholder="Key facts for the draft"
        value={facts}
        onChange={(e) => setFacts(e.target.value)}
      />
      <button
        className="btn mt-3"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const r = await generate({ briefId: selected as any, docType, facts });
          setContent(r.content);
          setBusy(false);
        }}
      >
        {busy ? "Drafting…" : "Generate draft"}
      </button>
      {content && <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm">{content}</pre>}
    </section>
  );
}
