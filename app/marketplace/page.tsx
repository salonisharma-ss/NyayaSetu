"use client";

import { Search, ShieldCheck, MapPin, Languages, IndianRupee } from "lucide-react";
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

      <main className="page-container">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[2rem] bg-navy p-6 text-white shadow-2xl sm:p-10">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="section-label text-amber-300">LEGAL PROFESSIONAL NETWORK</p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Find the right advocate for your legal matter
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Search verified advocate listings by city and practice area.
              Results are shown neutrally so you can choose the professional
              who is right for your needs.
            </p>
          </div>
        </section>

        {/* Search panel */}
        <section className="card mt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue/10 text-blue">
              <Search size={20} />
            </div>

            <div>
              <h2 className="font-bold text-navy">Search advocates</h2>
              <p className="text-sm text-slate-500">
                Filter the directory using your requirement
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                className="input pl-10"
                placeholder="Search by city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <input
              className="input"
              placeholder="Practice area, e.g. Property"
              value={practiceArea}
              onChange={(e) => setPracticeArea(e.target.value)}
            />

            <button
              type="button"
              className="btn"
              onClick={() => {
                // Convex query automatically updates from filter state.
                setCity(city.trim());
                setPracticeArea(practiceArea.trim());
              }}
            >
              Search advocates
            </button>
          </div>

          {(city || practiceArea) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Active filters:
              </span>

              {city && <span className="badge">{city}</span>}
              {practiceArea && <span className="badge">{practiceArea}</span>}

              <button
                type="button"
                className="text-xs font-semibold text-blue hover:underline"
                onClick={() => {
                  setCity("");
                  setPracticeArea("");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Directory header */}
        <section className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">ADVOCATE DIRECTORY</p>
            <h2 className="mt-2 text-2xl font-black text-navy">
              Verified advocates
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {results === undefined
              ? "Loading directory..."
              : `${results.length} advocate${results.length === 1 ? "" : "s"} found`}
          </p>
        </section>

        {/* Loading state */}
        {results === undefined && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card animate-pulse">
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-56 rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {results.map((profile: any) => (
              <article key={profile._id} className="card card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-xl font-black text-white">
                      {profile.displayName?.charAt(0)?.toUpperCase() || "A"}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-navy">
                        {profile.displayName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={13} />
                        {profile.city || "Location not listed"}
                      </div>
                    </div>
                  </div>

                  {profile.verified && (
                    <span className="badge-success flex items-center gap-1">
                      <ShieldCheck size={13} />
                      Verified
                    </span>
                  )}
                </div>

                {profile.bciEnrolmentNo && (
                  <div className="mt-5 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      BCI enrolment:
                    </span>{" "}
                    {profile.bciEnrolmentNo}
                  </div>
                )}

                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Practice areas
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {profile.practiceAreas?.map((area: string) => (
                      <span key={area} className="badge">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Languages size={16} className="mt-0.5 text-blue" />
                    <div>
                      <p className="text-xs text-slate-400">Languages</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {profile.languages?.join(", ") || "Not listed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <IndianRupee size={16} className="mt-0.5 text-gold" />
                    <div>
                      <p className="text-xs text-slate-400">Fee range</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {profile.feeRange || "Contact advocate"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button type="button" className="btn flex-1">
                    Request consultation
                  </button>

                  <button type="button" className="btn-ghost px-4">
                    View profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty state */}
        {results && results.length === 0 && (
          <div className="card mt-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue/10 text-2xl">
              ⚖
            </div>

            <h3 className="mt-5 text-xl font-black text-navy">
              No advocates found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try a different city or practice area. You can also load sample
              advocate profiles for the project demonstration.
            </p>

            <button
              type="button"
              className="btn mt-5"
              onClick={() => void seed()}
            >
              Load sample advocates
            </button>
          </div>
        )}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate-400">
          Directory search is provided for discovery only. NyayaSetu does not
          rank advocates or guarantee professional outcomes. Please verify
          details independently before engaging any professional.
        </p>
      </main>
    </>
  );
}