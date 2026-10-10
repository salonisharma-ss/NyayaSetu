import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Gavel,
  Landmark,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Nav from "@/components/Nav";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Legal Assistant",
    text: "Citizen-friendly explanations for unclear legal issues, rights, and next steps.",
    accent: "from-blue-500/20 to-cyan-500/5",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    text: "Upload notices, agreements, and judgments to extract clauses, risks, and insights.",
    accent: "from-indigo-500/20 to-blue-500/5",
  },
  {
    icon: Search,
    title: "Judgment Search",
    text: "Find precedent context, legal references, and structured research in a single flow.",
    accent: "from-amber-500/20 to-orange-500/5",
  },
  {
    icon: Users,
    title: "Advocate Marketplace",
    text: "Discover verified legal professionals by state, district, specialization, and case type.",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
];

const steps = [
  { number: "01", title: "Describe your issue", text: "Share a legal problem in plain language, without legal jargon." },
  { number: "02", title: "Understand the context", text: "AI explains the law, rights, risks, and likely procedural steps." },
  { number: "03", title: "Research and compare", text: "View case context and relevant legal authorities in an easy workflow." },
  { number: "04", title: "Take informed action", text: "Connect with lawyers or proceed with confidence using clear guidance." },
];

const stats = [
  { value: "5x", label: "faster legal understanding" },
  { value: "24/7", label: "Citizen support flow" },
  { value: "100%", label: "Product-first UI" },
  { value: "India", label: "Legal context built for local needs" },
];

const lawCategories = [
  "Family law",
  "Consumer rights",
  "Property disputes",
  "Criminal matters",
  "Employment law",
  "Cyber & digital",
  "Contract review",
  "Civil litigation",
];

const widgetHighlights = [
  { title: "Legal summary", detail: "Key issues, sections, and risk marks extracted in seconds." },
  { title: "Case matrix", detail: "Relevant authorities and tribunal context grouped by matter type." },
  { title: "Lawyer matching", detail: "Specialization, district, fee, and experience aligned to your case." },
];

const reviews = [
  {
    name: "Ananya R.",
    role: "Citizen user",
    quote:
      "This feels like a legal product built for real people. The explanations are simple, structured, and practical.",
  },
  {
    name: "Vikram S.",
    role: "Advocate",
    quote:
      "The dashboard feels premium and useful. It is built like a professional legal workspace, not a template.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-[#06182d] text-white">
          <div className="absolute inset-0">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="page-container relative py-16 md:py-20 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-sm">
                  <Sparkles size={14} /> legal intelligence reimagined
                </div>

                <h1 className="mt-6 max-w-xl text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-[4.2rem] lg:leading-[0.95]">
                  Legal clarity for
                  <span className="block text-gradient">citizens and lawyers.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
                  NyayaSetu connects legal information, AI-powered assistance, and professional discovery in one modern platform built for India’s real-world legal needs.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/citizen" className="btn btn-lg">
                    Explore the platform
                    <ArrowRight size={17} />
                  </Link>
                  <Link href="/marketplace" className="btn-ghost btn-lg border-white/25 bg-white/5 text-white hover:bg-white/10">
                    Find a lawyer
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-200">
                  {[
                    "Simple legal explanations",
                    "Professional legal workflow",
                    "Trust-focused intelligence",
                  ].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-300" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative lg:ml-auto">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-3 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,#0f1f38,#102a4b,#0d2340)] p-5">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                        Legal workspace active
                      </span>
                      <ShieldCheck size={16} className="text-amber-300" />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Case snapshot</p>
                            <h3 className="mt-2 text-2xl font-black">Property matter</h3>
                          </div>
                          <div className="rounded-xl bg-blue-500/15 p-2 text-blue-200">
                            <Landmark size={20} />
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 text-sm text-slate-200">
                          <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <span>Risk index</span>
                            <span className="font-bold text-amber-300">Moderate</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <span>Relevant sections</span>
                            <span className="font-bold text-cyan-200">12, 17, 20</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <span>Recommended action</span>
                            <span className="font-bold text-emerald-300">Review notice</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">AI answer</p>
                          <p className="mt-3 text-lg font-bold text-white">“Your case appears to involve a title dispute and notice response timeline.”</p>
                        </div>

                        <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200">Recommended next step</p>
                          <p className="mt-2 text-sm text-amber-50">
                            Consult a property advocate within your district before filing a response.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <MessageSquareText size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">AI support</p>
                      <p className="font-bold">24 legal prompts ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white/80">
          <div className="page-container">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-3xl font-black tracking-[-0.05em] text-slate-900">{stat.value}</div>
                  <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">One platform, three priorities</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Built for legal understanding, not just search.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, text, accent }) => (
              <Link
                key={title}
                href="/citizen"
                className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${accent}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                    <Icon size={22} />
                  </div>
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Learn more <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[#f6f8fc] py-16 md:py-20">
          <div className="page-container">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="section-label">How it works</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
                  Clear legal guidance, in a product experience people trust.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                  The product experience is designed to guide citizens and lawyers through legal uncertainty with structured, grounded, professional flows instead of generic AI outputs.
                </p>

                <div className="mt-8 space-y-4">
                  {widgetHighlights.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                          <p className="mt-1 text-sm leading-7 text-slate-600">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {steps.map((step) => (
                  <div key={step.number} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 inline-flex rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-container py-16 md:py-20">
          <div className="rounded-[2rem] bg-[#06182d] p-6 text-white shadow-2xl md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-label text-amber-300">Legal categories</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
                  Research and support across everyday legal needs.
                </h2>
              </div>

              <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white">
                Explore advocate directory <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {lawCategories.map((category) => (
                <span key={category} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="page-container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="section-label">Why lawyers use it</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
                A professional workspace, not a generic dashboard.
              </h2>

              <div className="mt-8 space-y-4">
                {[
                  "Matter-based legal workflow and intake",
                  "AI summarization for judgments and documents",
                  "Client, appointment, and practice management tools",
                  "Professional legal research assistance",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-sm font-medium leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-label">Lawyer workspace</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">Professional tools overview</h3>
                </div>
                <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-500/20">
                  <Gavel size={22} />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Building2, title: "Practice CRM" },
                  { icon: Search, title: "Research assistant" },
                  { icon: FileText, title: "Summarization" },
                  { icon: ShieldCheck, title: "Verification" },
                ].map(({ icon: Icon, title }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 text-lg font-bold text-slate-900">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="page-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-label">Loved by users</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
                Product-first trust built into the experience.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${review.name}-${index}`} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 text-lg leading-8 text-slate-700">“{review.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {review.name.split(" ")[0][0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{review.name}</div>
                      <div className="text-sm text-slate-500">{review.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="page-container">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#06182d] to-[#193d73] px-6 py-10 text-center text-white shadow-2xl md:px-10 md:py-14">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
              <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative mx-auto max-w-3xl">
                <p className="section-label text-amber-300">Ready to begin</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
                  Build trust with a legal product people actually want to use.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  From public legal assistance to law-practice workflows, NyayaSetu is shaped for a premium end-to-end product experience.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/auth" className="btn btn-lg">
                    Start with NyayaSetu
                  </Link>
                  <Link href="/marketplace" className="btn-ghost btn-lg border-white/20 bg-white/5 text-white hover:bg-white/10">
                    View advocate directory
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
