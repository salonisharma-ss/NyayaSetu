import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Gavel,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  Lock,
  BarChart3,
} from "lucide-react";
import Nav from "@/components/Nav";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "AI Legal Assistant",
    text: "Ask legal questions in plain language. Get instant explanations without jargon.",
    href: "/auth/signup",
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    text: "Upload contracts and notices. Understand clauses, risks, and obligations instantly.",
    href: "/auth/signup",
  },
  {
    icon: Search,
    title: "Judgment Research",
    text: "Access verified Indian judgments and precedents grounded in real law.",
    href: "/auth/signup",
  },
  {
    icon: Users,
    title: "Find Verified Advocates",
    text: "Discover BCI-verified advocates by specialization, location, and experience.",
    href: "/marketplace",
  },
];

const workflow = [
  [
    "01",
    "Describe",
    "Tell us what happened in plain words. No legal jargon needed.",
  ],
  [
    "02",
    "Understand",
    "Get a clear explanation of your rights and legal options.",
  ],
  [
    "03",
    "Research",
    "Explore relevant law, judgments, and legal precedents.",
  ],
  [
    "04",
    "Connect",
    "Opt-in to meet a verified advocate who can actually help.",
  ],
];

const lawyerBenefits = [
  { icon: MessageSquare, title: "Smart Research", text: "AI research grounded in verified Indian judgments" },
  { icon: TrendingUp, title: "Lead Pipeline", text: "Qualified leads from clients near your district courts" },
  { icon: Clock, title: "Draft Faster", text: "AI assists first draft; you handle judgment and filing" },
  { icon: BarChart3, title: "Analytics", text: "Track matters, billable time, and practice growth" },
];

const citizenBenefits = [
  { icon: Lock, title: "Your Data is Private", text: "You control what you share. No unauthorized data use." },
  { icon: ShieldCheck, title: "Verified Advocates", text: "Every advocate is BCI-enrolled and verified." },
  { icon: BrainCircuit, title: "AI Guidance", text: "Understand your legal issue before you hire." },
  { icon: Sparkles, title: "No Hidden Costs", text: "Transparent, flat fees. Know what you're paying." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Nav />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy via-blue-900 to-navy text-white">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="relative page-container">
            <div className="grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
              {/* Left content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-cyan-100 lg:inline-flex">
                  <Sparkles size={16} /> AI-Powered Legal Intelligence
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                    Legal clarity,
                    <span className="block bg-gradient-to-r from-cyan-200 via-blue-200 to-amber-200 bg-clip-text text-transparent">
                      no lawyers required.
                    </span>
                  </h1>

                  <p className="text-lg leading-relaxed text-slate-200 sm:text-xl">
                    Understand your legal rights. Connect with verified advocates. Get research-backed drafts. All from one trusted platform.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link href="/auth/signup" className="btn inline-flex justify-center gap-2">
                    Get Started Free <ArrowRight size={18} />
                  </Link>
                  <Link href="/marketplace" className="btn-ghost inline-flex justify-center gap-2 border-white/30 text-white hover:bg-white/10">
                    Browse Advocates
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm lg:justify-start">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>BCI-Verified Advocates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>Privacy-First Design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>Zero Fabricated Citations</span>
                  </div>
                </div>
              </div>

              {/* Right side - Image or visual */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-xl">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-8">
                    <div className="space-y-4">
                      <div className="h-3 rounded-full bg-white/20 w-2/3" />
                      <div className="h-3 rounded-full bg-white/20 w-1/2" />
                      <div className="space-y-2 pt-4">
                        <div className="h-2 rounded-full bg-white/10" />
                        <div className="h-2 rounded-full bg-white/10" />
                        <div className="h-2 rounded-full bg-white/10 w-2/3" />
                      </div>
                      <div className="pt-6 space-y-3">
                        <div className="flex gap-2">
                          <div className="h-8 w-8 rounded-lg bg-cyan-400/20" />
                          <div className="flex-1 h-3 rounded bg-white/10" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 rounded-lg bg-amber-400/20" />
                          <div className="flex-1 h-3 rounded bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Sides Section */}
        <section className="page-container py-20 sm:py-28">
          <div className="mb-20 text-center">
            <p className="section-label">PLATFORM FOR EVERYONE</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
              Built for citizens and lawyers
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              One platform. Two pathways. Same mission: fair, fast, transparent legal help.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Citizens Side */}
            <div className="card">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-black text-navy">For Citizens</h3>
              <p className="mt-2 text-slate-600">
                Understand your legal issue, know your rights, find a trustworthy advocate.
              </p>
              <div className="mt-6 space-y-4">
                {citizenBenefits.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3">
                    <Icon size={18} className="mt-1 shrink-0 text-blue" />
                    <div>
                      <p className="font-semibold text-navy">{title}</p>
                      <p className="text-sm text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className="btn mt-8 w-full">
                Start Free <ArrowRight size={16} />
              </Link>
            </div>

            {/* Lawyers Side */}
            <div className="card">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 text-amber-600">
                <Gavel size={24} />
              </div>
              <h3 className="text-2xl font-black text-navy">For Lawyers</h3>
              <p className="mt-2 text-slate-600">
                Get qualified leads, research fast, draft smarter, manage practice efficiently.
              </p>
              <div className="mt-6 space-y-4">
                {lawyerBenefits.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3">
                    <Icon size={18} className="mt-1 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-semibold text-navy">{title}</p>
                      <p className="text-sm text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className="btn mt-8 w-full bg-gradient-to-r from-amber-600 to-amber-500">
                Register as Lawyer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="page-container py-20 sm:py-28">
          <div className="mb-16 text-center">
            <p className="section-label">CAPABILITIES</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
              Everything you need, in one place
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, text, href }) => (
              <Link
                key={title}
                href={href}
                className="group card card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue transition group-hover:bg-blue/20">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="page-container py-20 sm:py-28">
          <div className="mb-16 text-center">
            <p className="section-label">HOW IT WORKS</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
              From problem to solution in 4 steps
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map(([number, title, description], idx) => (
              <div key={number} className="relative">
                {/* Connection line */}
                {idx < workflow.length - 1 && (
                  <div className="absolute top-1/3 left-[60%] hidden h-0.5 w-[80px] bg-gradient-to-r from-blue to-transparent lg:block" />
                )}
                <div className="card relative z-10">
                  <div className="mb-4 inline-block rounded-full bg-blue/10 px-3 py-1.5 text-sm font-black text-blue">
                    {number}
                  </div>
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="page-container py-20 sm:py-28">
          <div className="rounded-3xl bg-gradient-to-br from-navy via-blue-900 to-blue-600 p-12 text-white sm:p-16">
            <div className="max-w-2xl">
              <p className="section-label text-amber-300">WHY NYAYASETU</p>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Trust is our foundation
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-200">
                We believe legal help should be trustworthy, transparent, and accessible. Every feature is built with compliance and citizen protection at its core.
              </p>

              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="font-bold">Zero Fabricated Citations</h3>
                  <p className="text-sm text-slate-300">
                    Every legal citation is verified against real judgments before you see it.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="font-bold">BCI-Verified Advocates</h3>
                  <p className="text-sm text-slate-300">
                    Every lawyer on our marketplace is Bar Council enrolled and verified.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="font-bold">Your Data is Private</h3>
                  <p className="text-sm text-slate-300">
                    You explicitly consent before your case summary reaches any advocate.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="font-bold">Transparent Pricing</h3>
                  <p className="text-sm text-slate-300">
                    Flat fees, no hidden costs, no engagement-based ranking. Fair for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="page-container py-20 sm:py-28">
          <div className="card text-center">
            <Gavel size={40} className="mx-auto mb-6 text-blue" />
            <h2 className="text-3xl font-black text-navy sm:text-4xl">
              Ready to transform your legal life?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Join thousands of Indians getting clear legal guidance and finding the right advocate.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/signup" className="btn">
                Get Started Free
              </Link>
              <Link href="/marketplace" className="btn-ghost">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-slate-50/50 py-12">
          <div className="page-container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-sm font-black text-navy">NyayaSetu</div>
                <p className="mt-2 text-xs text-slate-600">
                  Legal intelligence for citizens and advocates.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Product</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      For Citizens
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      For Lawyers
                    </Link>
                  </li>
                  <li>
                    <Link href="/marketplace" className="text-slate-600 hover:text-navy">
                      Marketplace
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Legal</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      Compliance
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-slate-600 hover:text-navy">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-slate-200/80 pt-8 text-center text-xs text-slate-600">
              <p>&copy; 2026 NyayaSetu. All rights reserved. Built for India.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
