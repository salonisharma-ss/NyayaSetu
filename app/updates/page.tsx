"use client";

import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Newspaper,
  RefreshCw,
  Scale,
  Search,
  ScrollText,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

const KINDS = [
  { key: "", label: "All updates", icon: Newspaper },
  { key: "judgment", label: "Judgments", icon: Scale },
  { key: "legislation", label: "Legislation", icon: ScrollText },
  { key: "news", label: "Legal news", icon: Newspaper },
];

function timeAgo(ms: number) {
  const days = Math.floor((Date.now() - ms) / 86400000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function kindLabel(kind: string) {
  if (kind === "judgment") return "Judgment";
  if (kind === "legislation") return "Legislation";
  if (kind === "news") return "Legal news";
  return kind;
}

function kindIcon(kind: string) {
  if (kind === "judgment") return Scale;
  if (kind === "legislation") return ScrollText;
  return Newspaper;
}

export default function UpdatesPage() {
  const [kind, setKind] = useState("");
  const [area, setArea] = useState("");
  const [search, setSearch] = useState("");

  const items = useQuery(api.updates.feed, {
    kind: (kind || undefined) as any,
    practiceArea: area || undefined,
  });

  const areas = useQuery(api.updates.practiceAreas);
  const seed = useMutation(api.updates.seedDemoUpdates);

  const filteredItems = useMemo(() => {
    if (!items) return undefined;

    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item: any) => {
      const searchableText = [
        item.title,
        item.summary,
        item.source,
        item.jurisdiction,
        ...(item.practiceAreas ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [items, search]);

  return (
    <>
      <Nav />

      <main className="page-container">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-navy p-6 text-white shadow-2xl sm:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="section-label text-amber-300">LEGAL INTELLIGENCE FEED</p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Stay informed about changes in law
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore new judgments, enacted legislation and legal news
                organised by jurisdiction and practice area.
              </p>
            </div>

            {items && items.length === 0 && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => void seed()}
              >
                <RefreshCw size={16} />
                Load sample updates
              </button>
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="card mt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue/10 text-blue">
                <Search size={19} />
              </div>

              <div>
                <h2 className="font-bold text-navy">Explore legal updates</h2>
                <p className="text-sm text-slate-500">
                  Filter updates by category, practice area or keyword
                </p>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  className="input pl-10"
                  placeholder="Search judgments, legislation or legal news..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="input"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="">All practice areas</option>
                {areas?.map((practiceArea: any) => (
                  <option key={practiceArea} value={practiceArea}>
                    {practiceArea}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {KINDS.map((item) => {
                const Icon = item.icon;
                const selected = kind === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setKind(item.key)}
                    className={
                      selected
                        ? "inline-flex shrink-0 items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                        : "inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue"
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results header */}
        <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">LATEST INTELLIGENCE</p>
            <h2 className="mt-2 text-2xl font-black text-navy">
              Legal updates
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {filteredItems === undefined
              ? "Loading updates..."
              : `${filteredItems.length} update${filteredItems.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        {/* Loading state */}
        {filteredItems === undefined && (
          <div className="mt-5 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card animate-pulse">
                <div className="h-3 w-32 rounded bg-slate-200" />
                <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredItems && filteredItems.length === 0 && (
          <div className="card mt-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue/10 text-blue">
              <BookOpen size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black text-navy">
              No updates found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your filters or search terms. You can also load
              sample updates for the project demonstration.
            </p>

            <button
              type="button"
              className="btn mt-5"
              onClick={() => void seed()}
            >
              Load sample updates
            </button>
          </div>
        )}

        {/* Update cards */}
        {filteredItems && filteredItems.length > 0 && (
          <div className="mt-5 space-y-4">
            {filteredItems.map((item: any) => {
              const Icon = kindIcon(item.kind);

              return (
                <article
                  key={item._id}
                  className="card card-hover group"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue/10 text-blue">
                        <Icon size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="badge">
                            {kindLabel(item.kind)}
                          </span>

                          {item.jurisdiction && (
                            <span className="badge-gold">
                              {item.jurisdiction}
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-slate-400">
                            <CalendarDays size={13} />
                            {timeAgo(item.publishedAt)}
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-bold leading-7 text-navy transition group-hover:text-blue">
                          {item.title}
                        </h3>

                        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue hover:underline"
                      >
                        Read source
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold text-slate-400">
                      Source:
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.source}
                    </span>

                    {item.practiceAreas?.map((practiceArea: string) => (
                      <span key={practiceArea} className="badge">
                        {practiceArea}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate-400">
          Legal updates are provided for research and information purposes.
          Always verify the source document and consult a qualified legal
          professional for advice.
        </p>
      </main>
    </>
  );
}