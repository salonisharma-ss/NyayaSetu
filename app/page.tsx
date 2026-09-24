import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  ChevronRight,
  FileText,
  Gavel,
  Landmark,
  LineChart,
  Lock,
  Microscope,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  Users,
  Workflow,
} from "lucide-react";
import Nav from "@/components/Nav";

const capabilityCards = [
  {
    icon: BrainCircuit,
    title: "AI Legal Assistant",
    description: "Ask complex legal questions in plain language and receive structured, explainable answers grounded in Indian legal context.",
  },
  {
    icon: FileText,
    title: "Judgment Intelligence",
    description: "Transform long judgments into concise summaries, issue mapping, ratio decidendi, and practical legal understanding.",
  },
  {
    icon: Search,
    title: "Legal Research",
    description: "Search precedents, sections, acts, and citations with semantic retrieval designed for legal discovery workflows.",
  },
  {
    icon: Building2,
    title: "Legal Practice Management",
    description: "Track cases, clients, billing, hearings, and documents in one connected operating system for modern legal work.",
  },
];

const pipeline = [
  "Upload",
  "OCR / Extraction",
  "NLP preprocessing",
  "Transformer understanding",
  "Legal corpus",
  "RAG retrieval",
  "AI reasoning",
  "Summary + insights",
  "Explainable results",
];

const userModes = [
  {
    title: "I’m a Citizen",
    text: "Understand legal issues, rights, remedies, and document risk without legal jargon.",
    cta: "Continue as Citizen",
    accent: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "I’m a Lawyer",
    text: "Manage clients, cases, research, documents, hearings, and AI-assisted legal workflows.",
    cta: "Continue as Lawyer",
    accent: "from-violet-500/20 to-indigo-500/20",
  },
];

const metrics = [
  { label: "AI-assisted research", value: "4.8x" },
  { label: "Average time saved", value: "62%" },
  { label: "Verification workflows", value: "24/7" },
  { label: "Legal trust layers", value: "7" },
];

const footerLinks = {
  Platform: ["AI Assistant", "Legal Research", "Document Intelligence", "Case Workspace"],
  Solutions: ["For Citizens", "For Lawyers", "Law Students", "Find a Lawyer"],
  Resources: ["Privacy", "Terms", "Security", "Contact"],
};

export default function HomePage() {
  return (
    <>
      <Nav />

      <main className="min-h-screen bg-[#040b16] text-slate-100">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

          <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[1.02fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  <Sparkles size={12} />
                  AI-powered legal intelligence
                </div>

                <h1 className="mt-8 max-w-xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl xl:text-7xl">
                  Legal Intelligence,
                  <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">
                    Reimagined.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Understand complex legal documents, research Indian precedents, get AI-powered legal
                  insights, and manage legal practice — all from one intelligent platform.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="#platform" className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white">
                    Explore Legal AI <ArrowRight size={16} />
                  </Link>
                  <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800/80">
                    Find a Lawyer <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <span>AI-powered</span>
                  <span>Research-focused</span>
                  <span>Built for India</span>
                </div>
              </div>

              <div className="relative">
                <div className="glass-panel relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(14,165,233,0.18)] backdrop-blur-xl">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                  <div className="rounded-[28px] border border-white/10 bg-[#071322]/90 p-5">
                    <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-400">
                      <span>LEGAL INTELLIGENCE</span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live analysis
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.85),rgba(15,23,42,0.45))] p-4">
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Matter</p>
                            <p className="mt-2 text-xl font-semibold text-white">Property Dispute</p>
                          </div>
                          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200">
                            <Scale size={20} />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
                              <span>Risk</span>
                              <span>Moderate</span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400" />
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Relevant law</p>
                              <p className="mt-2 text-sm font-medium text-slate-200">Section 106, Transfer of Property Act</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Precedent</p>
                              <p className="mt-2 text-sm font-medium text-slate-200">Supreme Court: landlord-tenant review</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-violet-400/20 bg-violet-500/10 p-4">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-violet-200">
                            <BrainCircuit size={12} /> AI Summary
                          </div>
                          <p className="mt-3 text-lg font-semibold text-white">High-risk notice</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            Notice appears to be valid but there are procedural timing concerns that require review.
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                            <Workflow size={12} /> Workflow
                          </div>
                          <ul className="mt-3 space-y-2 text-sm text-slate-200">
                            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Intake complete</li>
                            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Precedent retrieval</li>
                            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Draft recommendation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section id="platform" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Platform</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                One Platform. Every Legal Workflow.
              </h2>
            </div>
            <div className="hidden rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 md:block">
              Trust + intelligence + speed
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCards.map(({ icon: Icon, title, description }) => (
              <div key={title} className="premium-card group rounded-[28px] border border-white/10 bg-slate-900/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_25px_70px_rgba(14,165,233,0.12)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">How the AI works</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              From document to decision-ready insight.
            </h2>
          </div>

          <div className="flow-grid grid gap-3 md:grid-cols-3 xl:grid-cols-9">
            {pipeline.map((step, index) => (
              <div key={step} className="group rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:border-cyan-400/30 hover:bg-slate-900">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-200">
                  {index + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">Choose your journey</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Built for citizens, lawyers, and legal research.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {userModes.map(({ title, text, cta, accent }) => (
              <div key={title} className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${accent} p-[1px]`}>
                <div className="h-full rounded-[27px] bg-[#071322]/90 p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-cyan-200">
                    {title.includes("Citizen") ? <Users size={22} /> : <Gavel size={22} />}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-slate-300">{text}</p>
                  <button className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:text-cyan-200">
                    {cta}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-slate-900/60 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)]">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="section-eyebrow">Why LEGALMIND AI</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                  Legal clarity, built for trust and action.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  From first-time legal questions to structured law firm operations, the platform connects
                  understanding, research, decisions, and execution in one connected legal intelligence layer.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Secure authentication and role-based access",
                    "Explainable AI with legal provenance",
                    "Judgment intelligence and precedent retrieval",
                    "Client, case, and billing workflows",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100">
                      <BadgeCheck className="mt-0.5 text-cyan-300" size={18} />
                      <span className="text-sm leading-6">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-[24px] border border-white/10 bg-[#0a1728] p-5">
                    <div className="text-3xl font-black tracking-[-0.05em] text-white">{metric.value}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/8 via-slate-900 to-violet-500/8 p-8 text-center sm:p-12">
            <p className="section-eyebrow">The future of legal work</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              The Future of Legal Work Starts Here.
            </h2>
            <p className="mt-4 text-lg text-slate-300">Research faster. Understand better. Manage smarter.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/" className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="#platform" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800/80">
                Explore Legal AI
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#040b16]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
                    <Scale size={18} />
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-[-0.04em] text-white">LEGALMIND AI</div>
                  </div>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                  A premium legal intelligence ecosystem for citizens, lawyers, researchers, and legal teams.
                </p>
              </div>

              {Object.entries(footerLinks).map(([heading, items]) => (
                <div key={heading}>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{heading}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {items.map((item) => (
                      <li key={item}><Link href="/" className="transition hover:text-cyan-200">{item}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 LEGALMIND AI. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <span>Privacy</span>
                <span>Terms</span>
                <span>Security</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
