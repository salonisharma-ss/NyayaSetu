"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

export default function Dashboard() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <AuthLoading>
          <p className="text-slate-500">Loading…</p>
        </AuthLoading>
        <Unauthenticated>
          <p className="text-slate-600">
            Please <Link href="/" className="text-brand underline">sign in</Link> to access your workspace.
          </p>
        </Unauthenticated>
        <Authenticated>
          <Workspace />
        </Authenticated>
      </main>
    </>
  );
}

function Workspace() {
  const me = useQuery(api.firms.me);
  if (me === undefined) return <p className="text-slate-500">Loading…</p>;
  if (!me?.firmId) return <CreateFirm />;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{me.firmName}</h1>
          <p className="text-sm text-slate-500">
            {me.email} · <span className="badge">{me.role}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/leads" className="btn-ghost">
            Client leads →
          </Link>
          <DemoCorpusButton />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ClientsPanel firmId={me.firmId} />
        <MattersPanel firmId={me.firmId} />
      </div>
    </div>
  );
}

function CreateFirm() {
  const bootstrap = useMutation(api.firms.bootstrap);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="card mx-auto max-w-md space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await bootstrap({ firmName: name || "My Firm" });
        setBusy(false);
      }}
    >
      <h2 className="text-lg font-semibold">Name your firm</h2>
      <p className="text-sm text-slate-500">One-time setup for your workspace.</p>
      <input className="input" placeholder="e.g. Sharma & Associates" value={name} onChange={(e) => setName(e.target.value)} />
      <button className="btn w-full" disabled={busy}>
        Create workspace
      </button>
    </form>
  );
}

function DemoCorpusButton() {
  const load = useAction(api.seed.loadDemoCorpus);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="text-right">
      <button
        className="btn-ghost"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const r = await load({});
          setMsg(`Corpus ready: ${r.ingested} ingested, ${r.skippedDuplicate} already present.`);
          setBusy(false);
        }}
      >
        {busy ? "Loading…" : "Load demo judgment corpus"}
      </button>
      {msg && <p className="mt-1 text-xs text-emerald-600">{msg}</p>}
    </div>
  );
}

function ClientsPanel({ firmId }: { firmId: string }) {
  const clients = useQuery(api.crm.listClients, { firmId: firmId as any });
  const create = useMutation(api.crm.createClient);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-semibold">Clients</h2>
      <form
        className="mb-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name) return;
          await create({ firmId: firmId as any, name, phone: phone || undefined });
          setName("");
          setPhone("");
        }}
      >
        <input className="input" placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="btn shrink-0">Add</button>
      </form>
      <ul className="divide-y divide-slate-100">
        {clients?.map((c: any) => (
          <li key={c._id} className="py-2 text-sm">
            <span className="font-medium">{c.name}</span>
            {c.phone && <span className="text-slate-400"> · {c.phone}</span>}
          </li>
        ))}
        {clients?.length === 0 && <li className="py-2 text-sm text-slate-400">No clients yet.</li>}
      </ul>
    </section>
  );
}

function MattersPanel({ firmId }: { firmId: string }) {
  const matters = useQuery(api.crm.listMatters, { firmId: firmId as any });
  return (
    <section className="card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Matters</h2>
      </div>
      <IntakeWizard firmId={firmId} />
      <ul className="mt-4 divide-y divide-slate-100">
        {matters?.map((m: any) => (
          <li key={m._id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <Link href={`/dashboard/matter/${m._id}`} className="font-medium text-brand hover:underline">
                {m.title}
              </Link>
              <span className="text-slate-400"> · {m.clientName}</span>
            </div>
            <span className="badge">{m.status}</span>
          </li>
        ))}
        {matters?.length === 0 && <li className="py-2 text-sm text-slate-400">No matters yet.</li>}
      </ul>
    </section>
  );
}

function IntakeWizard({ firmId }: { firmId: string }) {
  const taxonomy = useQuery(api.intake.taxonomy);
  const clients = useQuery(api.crm.listClients, { firmId: firmId as any });
  const createMatter = useMutation(api.crm.createMatter);
  const [clientId, setClientId] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const checklist = useQuery(
    api.intake.checklist,
    category && subcategory ? { category, subcategory } : "skip",
  );

  const cat = taxonomy?.find((c: any) => c.key === category);

  return (
    <details className="rounded-lg border border-slate-200 p-3">
      <summary className="cursor-pointer text-sm font-medium text-brand">+ New matter (guided intake)</summary>
      <form
        className="mt-3 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!clientId || !category || !subcategory) return;
          await createMatter({
            firmId: firmId as any,
            clientId: clientId as any,
            title: title || `${category} matter`,
            category,
            subcategory,
            summaryText: summary,
          });
          setTitle("");
          setSummary("");
        }}
      >
        <select className="input" value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="">Select client…</option>
          {clients?.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <select
            className="input"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
          >
            <option value="">Category…</option>
            {taxonomy?.map((c: any) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <select className="input" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">Sub-category…</option>
            {cat?.subcategories.map((s: any) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <input className="input" placeholder="Matter title" value={title} onChange={(e) => setTitle(e.target.value)} />
        {checklist && (
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <p className="mb-1 font-medium">Required documents:</p>
            <ul className="list-inside list-disc text-slate-600">
              {checklist.checklist.map((d: any) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        )}
        <textarea
          className="input"
          rows={3}
          placeholder="~300-word fact summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <button className="btn w-full">Create matter</button>
      </form>
    </details>
  );
}
