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
} from "lucide-react";
import Nav from "@/components/Nav";

const capabilities = [
  { icon: BrainCircuit, title: "AI Legal Assistant", text: "Ask legal questions in plain language and understand possible next steps.", href: "/citizen" },
  { icon: FileSearch, title: "Document Intelligence", text: "Upload notices and agreements to identify important clauses and risks.", href: "/citizen" },
  { icon: Search, title: "Judgment Research", text: "Explore Indian legal context, authorities, and relevant precedents.", href: "/updates" },
  { icon: Users, title: "Find an Advocate", text: "Discover verified advocate listings by practice area, language, and city.", href: "/marketplace" },
];

const workflow = [
  ["01", "Describe", "Share your issue or upload a document."],
  ["02", "Understand", "Get a clear explanation without legal jargon."],
  ["03", "Research", "Explore relevant law, judgments, and sources."],
  ["04", "Take action", "Find next steps or connect with a professional."],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#081a33]">
      <Nav />
      <main className="overflow-hidden">
        <section className="relative bg-[#061a31] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(49,87,213,0.32),transparent_34%),radial-gradient(circle_at_90%_70%,rgba(217,164,65,0.16),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100">
                <Sparkles size={13} /> Intelligent legal support
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-amber-300">NYAYASETU LEGAL INTELLIGENCE</p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Legal intelligence,
                <span className="block bg-gradient-to-r from-cyan-200 via-blue-200 to-amber-200 bg-clip-text text-transparent">made understandable.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Understand legal documents, explore Indian legal context, and connect with the right advocate from one trusted platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/citizen" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#081a33] shadow-xl transition hover:bg-cyan-50">
                  Explore legal help <ArrowRight size={16} />
                </Link>
                <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                  Find an advocate <Users size={16} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-xs text-slate-300">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-300" /> Indian legal context</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-300" /> Privacy-conscious</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-300" /> Human professional review</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
                <div className="relative h-[420px] overflow-hidden rounded-[1.6rem] sm:h-[540px]">
                  <Image src="/images/hero-legal-help.jpg.avif" alt="Professional legal guidance" fill priority className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061a31] via-[#061a31]/10 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-2xl border border-white/20 bg-[#061a31]/55 px-4 py-3 text-xs backdrop-blur-md">
                    <span className="flex items-center gap-2 font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Legal intelligence workspace</span>
                    <ShieldCheck size={17} className="text-amber-300" />
                  </div>
                  <div className="absolute bottom-0 p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Understand before you act</p>
                    <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-4xl">Clearer answers for important legal decisions.</h2>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white px-4 py-3 text-[#081a33] shadow-2xl sm:-left-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><LockKeyhole size={19} /></div>
                <div><p className="text-[10px] uppercase tracking-widest text-slate-400">Platform principle</p><p className="text-sm font-bold">Information with context</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-container py-16" id="platform">
          <div className="mx-auto max-w-2xl text-center"><p className="section-label">ONE CONNECTED PLATFORM</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Every legal workflow, in one place.</h2><p className="mt-4 leading-7 text-slate-600">From a citizen’s first question to a lawyer’s case workspace, NyayaSetu keeps the journey connected.</p></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, text, href }) => <Link href={href} key={title} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-[#081a33] group-hover:text-white"><Icon size={22} /></div><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-700">Explore <ArrowRight size={15} /></span></Link>)}
          </div>
        </section>

        <section className="page-container py-4 md:py-12"><div className="grid overflow-hidden rounded-[2rem] bg-[#081a33] text-white shadow-2xl lg:grid-cols-2"><div className="relative min-h-[360px]"><Image src="/images/india-legal-system.jpg.avif" alt="Indian legal system and law books" fill className="object-cover opacity-65" /><div className="absolute inset-0 bg-gradient-to-r from-[#081a33]/20 to-[#081a33]" /><div className="relative flex h-full min-h-[360px] flex-col justify-end p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Built for India</p><h2 className="mt-3 max-w-md text-3xl font-black sm:text-4xl">Legal technology with context and responsibility.</h2></div></div><div className="p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">How it works</p><div className="mt-7 space-y-5">{workflow.map(([number, title, text]) => <div key={number} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-xs font-black text-cyan-200">{number}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></div></div>)}</div></div></div></section>

        <section className="page-container py-16"><div className="grid gap-6 lg:grid-cols-2"><div className="group relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#081a33] text-white"><Image src="/images/citizen-help.jpg.avif" alt="Citizen receiving legal support" fill className="object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-[#081a33] via-[#081a33]/40 to-transparent" /><div className="relative flex min-h-[390px] flex-col justify-end p-7 sm:p-9"><p className="section-label text-amber-300">FOR CITIZENS</p><h2 className="mt-3 text-3xl font-black">Understand your rights with confidence.</h2><p className="mt-3 max-w-md text-sm leading-7 text-slate-200">Ask questions, analyze documents, and find a professional when you need one.</p><Link href="/citizen" className="btn mt-6 w-fit bg-white text-[#081a33] hover:bg-slate-100">Explore citizen help <ArrowRight size={16} className="ml-2" /></Link></div></div><div className="group relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#10253e] text-white"><Image src="/images/lawyer-workspace.jpg.jpg" alt="Lawyer working in a professional workspace" fill className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#061a31] via-[#10253e]/60 to-transparent" /><div className="relative flex min-h-[390px] flex-col justify-end p-7 sm:p-9"><p className="section-label text-cyan-200">FOR LAWYERS</p><h2 className="mt-3 text-3xl font-black">A smarter workspace for legal practice.</h2><p className="mt-3 max-w-md text-sm leading-7 text-slate-200">Organize clients, matters, research, documents, and assisted drafting.</p><Link href="/dashboard" className="btn mt-6 w-fit">Open lawyer workspace <ArrowRight size={16} className="ml-2" /></Link></div></div></div></section>

        <section className="page-container pb-20"><div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#081a33] to-[#173b73] p-8 text-center text-white sm:p-14"><div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" /><Gavel className="mx-auto text-amber-300" size={30} /><h2 className="relative mt-4 text-3xl font-black sm:text-5xl">The future of legal work starts here.</h2><p className="relative mt-4 text-slate-300">Research faster. Understand better. Manage smarter.</p><Link href="/citizen" className="btn relative mt-7 bg-white text-[#081a33] hover:bg-slate-100">Get started <ArrowRight size={16} className="ml-2" /></Link></div></section>
      </main>
    </div>
  );
}
