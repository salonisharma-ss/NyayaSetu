"use client";

import { useMutation } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { CheckCircle2, Gavel, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

const practiceAreas = [
  "Motor Vehicle",
  "Consumer Dispute",
  "Property / Tenancy",
  "Family Law",
  "Criminal Law",
  "Employment",
  "Cyber Law",
  "Intellectual Property",
];

const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi", "Bengali", "Gujarati"];

export default function AdvocatePortalPage() {
  return (
    <>
      <Nav />
      <main className="page-container py-10">
        <Unauthenticated>
          <div className="card mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue/10 text-blue">
              <Gavel size={28} />
            </div>
            <p className="section-label mt-5">ADVOCATE PORTAL</p>
            <h1 className="mt-3 text-3xl font-black text-navy">Create your legal profile</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sign in to create a verified advocate profile, add your practice areas, city, languages,
              and listing details so citizens can find you in the marketplace.
            </p>
            <Link href="/" className="btn mt-6">
              Go to sign in
            </Link>
          </div>
        </Unauthenticated>

        <Authenticated>
          <AdvocateProfileForm />
        </Authenticated>
      </main>
    </>
  );
}

function AdvocateProfileForm() {
  const upsert = useMutation(api.marketplace.upsertLawyerProfile);

  const [displayName, setDisplayName] = useState("");
  const [bciEnrolmentNo, setBciEnrolmentNo] = useState("");
  const [city, setCity] = useState("");
  const [feeRange, setFeeRange] = useState("");
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>(["Motor Vehicle"]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [listed, setListed] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleValue(list: string[], value: string, setter: (next: string[]) => void) {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await upsert({
      displayName: displayName.trim() || "Advocate Profile",
      bciEnrolmentNo: bciEnrolmentNo.trim() || undefined,
      practiceAreas: selectedPracticeAreas,
      languages: selectedLanguages,
      city: city.trim() || undefined,
      feeRange: feeRange.trim() || undefined,
      listed,
    });

    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="card">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="section-label">ADVOCATE PROFILE</p>
            <h1 className="mt-1 text-2xl font-black text-navy">Professional details</h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Adv. A. Sharma"
              required
            />
          </div>

          <div>
            <label className="label">BCI enrolment number</label>
            <input
              className="input"
              value={bciEnrolmentNo}
              onChange={(e) => setBciEnrolmentNo(e.target.value)}
              placeholder="e.g. BCI/XXXX/2023"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">City</label>
              <div className="relative">
                <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Delhi"
                />
              </div>
            </div>

            <div>
              <label className="label">Fee range</label>
              <input
                className="input"
                value={feeRange}
                onChange={(e) => setFeeRange(e.target.value)}
                placeholder="₹2,000–₹5,000"
              />
            </div>
          </div>

          <div>
            <label className="label">Practice areas</label>
            <div className="flex flex-wrap gap-2">
              {practiceAreas.map((area) => {
                const active = selectedPracticeAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      active ? "border-blue-200 bg-blue-50 text-blue" : "border-slate-200 bg-white text-slate-600"
                    }`}
                    onClick={() => toggleValue(selectedPracticeAreas, area, setSelectedPracticeAreas)}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">Languages</label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => {
                const active = selectedLanguages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"
                    }`}
                    onClick={() => toggleValue(selectedLanguages, lang, setSelectedLanguages)}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <div className="text-sm font-semibold text-navy">Marketplace listing</div>
              <div className="text-xs text-slate-500">Visible to citizens after verification</div>
            </div>
            <button
              type="button"
              onClick={() => setListed((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition ${listed ? "bg-emerald-500" : "bg-slate-300"}`}
              aria-label="Toggle listing"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${listed ? "left-6" : "left-1"}`}
              />
            </button>
          </div>

          <button type="submit" className="btn w-full" disabled={saving}>
            {saving ? "Saving profile..." : "Save advocate profile"}
          </button>

          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} />
              Your profile has been saved successfully.
            </div>
          )}
        </form>
      </section>

      <aside className="space-y-4">
        <div className="card bg-navy text-white">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={18} className="text-amber-300" />
            </div>
            <div>
              <p className="section-label text-amber-300">PROFILE CHECKLIST</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-slate-200">
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-300" /> Full name and professional identity</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-300" /> City and practice area coverage</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-300" /> Languages for client communication</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-300" /> Fee details and availability</li>
          </ul>
        </div>

        <div className="card">
          <p className="section-label">WHY THIS MATTERS</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your profile helps citizens discover the right advocate for their legal issue, based on
            practice area, city, and language preferences.
          </p>
        </div>
      </aside>
    </div>
  );
}
