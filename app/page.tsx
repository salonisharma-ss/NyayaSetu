import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Gavel,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";
import Nav from "@/components/Nav";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "AI Legal Assistant",
    text: "Ask legal questions in plain language and understand possible next steps.",
    href: "/auth/signin",
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    text: "Upload notices and agreements to identify important clauses and risks.",
    href: "/auth/signin",
  },
  {
    icon: Search,
    title: "Judgment Research",
    text: "Explore Indian legal context, authorities, and relevant precedents.",
    href: "/auth/signin",
  },
  {
    icon: Users,
    title: "Find an Advocate",
    text: "Discover verified advocate listings by practice area, language, and city.",
    href: "/marketplace",
  },
];

const workflow = [
  ["01", "Describe", "Share your legal issue or upload a document."],
  ["02", "Understand", "Get a clear explanation without legal jargon."],
  ["03", "Research", "Explore relevant law, judgments, and sources."],
  ["04", "Take action", "Find next steps or connect with a professional."],
];

const features = [
  { icon: MessageSquare, title: "Smart Chat", text: "Real-time legal guidance" },
  { icon: TrendingUp, title: "Analytics", text: "Track case progress" },
  { icon: Clock, title: "Time Tracking", text: "Billable hours management" },
  { icon: ShieldCheck, title: "Verified Lawyers", text: "Trusted professionals" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#081a33]">
      <Nav />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#061a31] via-[#081a33] to-[#f5f7fb] text-white py-20 sm:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative page-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-cyan-100">
                  <Sparkles size={16} /> AI Legal Intelligence
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                  Legal intelligence,
                  <span className="block bg-gradient-to-r from-cyan-200 via-blue-200 to-amber-200 bg-clip-text text-transparent">
                    made understandable.
                  </span>
                </h1>

                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Understand complex legal documents, explore Indian legal context with AI-powered insights, and connect with verified advocates from one trusted platform.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/auth/signup" className="btn">
                    Get started free <ArrowRight size={16} />
                  </Link>
                  <Link href="/marketplace" className="btn-ghost text-white border-white/30 hover:bg-white/10">
                    Browse advocates
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 pt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <span>Indian legal focus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <span>Privacy-first design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <span>Expert review</span>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl" />
                <div className="relative rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400" />
                  <div className="space-y-4">
                    <div className="h-8 bg-white/20 rounded-lg w-3/4" />
                    <div className="h-8 bg-white/20 rounded-lg w-1/2" />
                    <div className="space-y-2 mt-8">
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="page-container py-20">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="section-label">ONE CONNECTED PLATFORM</p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-navy tracking-tight">
              Every legal workflow, reimagined
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From document analysis to advocate discovery, everything you need for legal clarity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map(({ icon: Icon, title, text, href }) => (
              <Link
                key={title}
                href={href}
                className="group card card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue mb-4 group-hover:bg-blue/20 transition">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="page-container py-20">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="section-label">HOW IT WORKS</p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-navy tracking-tight">
              Your legal journey, simplified
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map(([number, title, description]) => (
              <div key={number} className="card">
                <div className="text-4xl font-black text-blue/20 mb-2">{number}</div>
                <h3 className="font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="page-container py-20">
          <div className="rounded-3xl bg-gradient-to-br from-navy via-blue-900 to-blue-600 text-white p-12 sm:p-16">
            <div className="max-w-2xl">
              <p className="section-label text-amber-300">PROFESSIONAL TOOLS</p>
              <h2 className="mt-4 text-4xl font-black">
                Built for lawyers, designed for simplicity
              </h2>
              <p className="mt-4 text-lg text-slate-200">
                Complete legal practice management with intelligent AI assistance.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mt-12">
                {features.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="text-sm text-slate-300 mt-1">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="page-container py-20">
          <div className="card text-center">
            <Gavel size={40} className="mx-auto text-blue mb-4" />
            <h2 className="text-3xl font-black text-navy">
              Ready to transform your legal workflow?
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Join thousands of legal professionals using NyayaSetu for smarter legal work.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/auth/signup" className="btn">
                Get started free
              </Link>
              <Link href="/marketplace" className="btn-ghost">
                Explore marketplace
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
