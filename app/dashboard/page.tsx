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
      <div className="page-container">
        <AuthLoading>
          <div className="card animate-pulse">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-64 rounded bg-slate-100" />
          </div>
        </AuthLoading>

        <Unauthenticated>
          <div className="card mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue/10 text-2xl">
              ⚖
            </div>

            <h1 className="mt-5 text-2xl font-black text-navy">
              Your legal workspace awaits
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Please sign in to manage clients, matters, research and legal drafts.
            </p>

            <Link href="/" className="btn mt-6">
              Sign in to continue
            </Link>
          </div>
        </Unauthenticated>

        <Authenticated>
          <Workspace />
        </Authenticated>
      </div>
    </>
  );
}

function Workspace() {
  const me = useQuery(api.firms.me);

  if (me === undefined) {
    return (
      <div className="card">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-100" />
      </div>
    );
  }

  if (!me?.firmId) return <CreateFirm />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-navy p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="section-label text-amber-300">PROFESSIONAL WORKSPACE</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome to {me.firmName}
            </h1>

            <p className="mt-3 text-sm text-slate-300">
              {me.email}
              <span className="mx-2 text-slate-500">•</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                {me.role}
              </span>
            </p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Organise matters, understand legal authorities and prepare research-backed
              drafts from one secure workspace.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2">
            <Link
              href="/dashboard/leads"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Client leads →
            </Link>
            <DemoCorpusButton />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
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
    <div className="page-container">
      <form
        className="card mx-auto max-w-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          await bootstrap({ firmName: name || "My Firm" });
          setBusy(false);
        }}
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-2xl">
            ⚖
          </div>

          <h2 className="mt-4 text-2xl font-black text-navy">Name your firm</h2>
          <p className="mt-2 text-sm text-slate-500">
            One-time setup for your legal workspace.
          </p>
        </div>

        <input
          className="input"
          placeholder="e.g. Sharma & Associates"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn w-full" disabled={busy}>
          {busy ? "Creating..." : "Create workspace"}
        </button>
      </form>
    </div>
  );
}

function DemoCorpusButton() {
  const load = useAction(api.seed.loadDemoCorpus);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="text-right">
      <button
        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const r = await load({});
          setMsg(`Corpus ready: ${r.ingested} ingested, ${r.skippedDuplicate} already present.`);
          setBusy(false);
        }}
      >
        {busy ? "Loading..." : "Load demo judgment corpus"}
      </button>

      {msg && <p className="mt-2 text-xs text-emerald-300">{msg}</p>}
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
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="section-label">CRM</p>
          <h2 className="mt-1 text-xl font-black text-navy">Clients</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your client relationships</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue/10 text-lg">
          👥
        </div>
      </div>

      <form
        className="mb-5 flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name) return;
          await create({ firmId: firmId as any, name, phone: phone || undefined });
          setName("");
          setPhone("");
        }}
      >
        <input
          className="input"
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn shrink-0">Add</button>
      </form>

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
        {clients?.map((c: any) => (
          <li
            key={c._id}
            className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-slate-50"
          >
            <div>
              <span className="font-semibold text-slate-800">{c.name}</span>
              {c.phone && <span className="ml-2 text-slate-400">· {c.phone}</span>}
            </div>
          </li>
        ))}

        {clients?.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-400">No clients yet.</li>
        )}
      </ul>
    </section>
  );
}

function MattersPanel({ firmId }: { firmId: string }) {
  const matters = useQuery(api.crm.listMatters, { firmId: firmId as any });

  return (
    <section className="card">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="section-label">CASE MANAGEMENT</p>
          <h2 className="mt-1 text-xl font-black text-navy">Active matters</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track your legal work from intake to draft
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-lg">
          ⚖
        </div>
      </div>

      <IntakeWizard firmId={firmId} />

      <ul className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
        {matters?.map((m: any) => (
          <li
            key={m._id}
            className="flex items-center justify-between gap-3 px-4 py-4 text-sm transition hover:bg-slate-50"
          >
            <div>
              <Link href={`/dashboard/matter/${m._id}`} className="font-semibold text-blue hover:underline">
                {m.title}
              </Link>
              <span className="ml-2 text-slate-400">· {m.clientName}</span>
            </div>

            <span className="badge">{m.status}</span>
          </li>
        ))}

        {matters?.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-400">No matters yet.</li>
        )}
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
    <details className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
      <summary className="cursor-pointer list-none text-sm font-bold text-blue">
        + New matter (guided intake)
      </summary>

      <form
        className="mt-4 space-y-3"
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

        <div className="grid gap-2 sm:grid-cols-2">
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

        <input
          className="input"
          placeholder="Matter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {checklist && (
          <div className="rounded-xl bg-white p-3 text-sm">
            <p className="mb-2 font-semibold text-slate-800">Required documents:</p>
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