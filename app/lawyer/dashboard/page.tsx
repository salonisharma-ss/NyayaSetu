"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Gavel,
  MessageSquareText,
  MoonStar,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const statCards = [
  { label: "Active matters", value: "18", detail: "+4 this month" },
  { label: "Appointments", value: "09", detail: "3 confirmed" },
  { label: "Revenue", value: "₹2.4L", detail: "+₹46k this week" },
  { label: "Client satisfaction", value: "96%", detail: "Strong retention" },
];

const matters = [
  { title: "Property dispute review", client: "Amit Rao", type: "Civil", status: "In review" },
  { title: "Consumer complaint draft", client: "Neha Kapoor", type: "Consumer", status: "Awaiting filing" },
  { title: "Family mediation notes", client: "S. Desai", type: "Family", status: "Ready for hearing" },
];

const appointments = [
  { time: "10:30 AM", client: "Rakesh Yadav", type: "Consultation" },
  { time: "1:15 PM", client: "Priya Jain", type: "Case review" },
  { time: "4:00 PM", client: "Vikas Mehta", type: "Document analysis" },
];

const prompts = [
  "Summarize this judgment for a client briefing",
  "Draft a notice response for a civil matter",
  "Compare relevant sections across similar cases",
  "Prepare a case timeline and next steps",
];

export default function LawyerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="page-container py-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-label">Lawyer dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Advocate workspace</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-secondary">
              <Bell size={16} />
              Alerts
            </button>
            <button className="btn">
              New matter
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="card rounded-[1.5rem] p-5">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <div className="mt-3 flex items-end justify-between gap-2">
                <span className="text-3xl font-black tracking-[-0.05em] text-slate-900">{stat.value}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  {stat.detail}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="card rounded-[1.75rem] p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="section-label">Matter board</p>
                <h2 className="mt-2 text-2xl font-black">Cases in pipeline</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <BriefcaseBusiness size={20} />
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {matters.map((matter) => (
                  <div key={matter.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{matter.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{matter.client} · {matter.type}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                        {matter.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card rounded-[1.75rem] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Professional profile</p>
                  <h3 className="mt-2 text-xl font-black">Verification status</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">Adv. Aisha Sharma</p>
                <p className="mt-1 text-sm text-slate-500">Property · Family · Consumer</p>
                <div className="mt-4 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                  Verified and active
                </div>
              </div>

              <Link href="/lawyer/onboarding" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Manage profile <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card rounded-[1.75rem] p-5">
              <p className="section-label">Schedule</p>
              <h3 className="mt-2 text-xl font-black">Appointments</h3>

              <div className="mt-5 space-y-3">
                {appointments.map((item) => (
                  <div key={`${item.time}-${item.client}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.client}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.type}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-blue-700">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label">AI legal assistant</p>
                <h3 className="mt-2 text-xl font-black">Research prompts</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <MessageSquareText size={20} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {prompts.map((prompt) => (
                <button key={prompt} type="button" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700">
                  {prompt}
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="card rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label">Performance</p>
                <h3 className="mt-2 text-xl font-black">Practice analytics</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Case conversions", value: "32%" },
                { label: "Avg. response", value: "2.4d" },
                { label: "Monthly growth", value: "+18%" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-black tracking-[-0.05em] text-slate-900">{item.value}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Document summarizer</p>
                  <p className="mt-1 text-xs text-slate-500">Latest judgment summary is ready</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FileText size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
