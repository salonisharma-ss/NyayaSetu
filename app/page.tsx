"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  FileText,
  Gavel,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import AuthForm from "@/components/AuthForm";
import Nav from "@/components/Nav";

const quickActions = [
  {
    icon: BrainCircuit,
    title: "Ask a legal question",
    text: "Explain your issue in simple words and understand possible next steps.",
    href: "/citizen",
    label: "Get guidance",
  },
  {
    icon: FileSearch,
    title: "Analyze a document",
    text: "Upload a legal document and explore summaries, clauses and important details.",
    href: "/citizen",
    label: "Analyze document",
  },
  {
    icon: Landmark,
    title: "Know your rights",
    text: "Explore practical legal information for common citizen problems.",
    href: "/citizen",
    label: "Explore rights",
  },
  {
    icon: Users,
    title: "Find an advocate",
    text: "Discover verified advocate listings by location and practice area.",
    href: "/marketplace",
    label: "Find advocate",
  },
];

const legalAreas = [
  "Property & tenancy",
  "Consumer disputes",
  "Motor vehicle",
  "Employment",
  "Family matters",
  "Cyber issues",
];

const workflow = [
  {
    number: "01",
    title: "Describe",
    text: "Share your problem or upload a legal document.",
  },
  {
    number: "02",
    title: "Understand",
    text: "Get information in clear, plain language.",
  },
  {
    number: "03",
    title: "Research",
    text: "Explore relevant legal context and authorities.",
  },
  {
    number: "04",
    title: "Take action",
    text: "Find next steps or connect with a professional.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="overflow-hidden">
        {/* Announcement bar */}
        <div className="border-b border-blue-100 bg-blue-50/70">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold text-navy sm:text-sm">
            <Sparkles size={15} className="text-gold" />
            Legal information made easier for citizens and professionals
          </div>
        </div>

        {/* Hero */}
        <section className="relative bg-[#fffaf2]">
          <div className="absolute left-[-160px] top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute right-[-160px] top-10 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="page-container relative">
            <div className="grid items-center gap-12 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="section-label">NYAYASETU LEGAL INTELLIGENCE</p>

                <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[1.03] tracking-[-0.045em] text-navy sm:text-6xl lg:text-7xl">
                  Understand your rights.
                  <span className="mt-2 block text-blue">
                    Take your next step with confidence.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  A modern legal intelligence platform for citizens, lawyers and
                  legal researchers. Get clear information, organise legal work
                  and discover relevant resources in one place.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/citizen" className="btn group">
                    Get legal help
                    <ArrowRight
                      size={17}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <Link href="/dashboard" className="btn-ghost">
                    For lawyers
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-success" />
                    Plain-language guidance
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-success" />
                    Indian legal context
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-success" />
                    Privacy-conscious
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border-[10px] border-white bg-white shadow-2xl">
                  <div className="relative h-[420px] sm:h-[520px]">
                    <Image
                      src="/images/hero-legal-help.jpg.avif"
                      alt="A person receiving professional legal guidance"
                      fill
                      priority
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                        <ShieldCheck size={15} className="text-amber-300" />
                        Built for trusted legal information
                      </div>

                      <h2 className="max-w-md text-3xl font-black leading-tight sm:text-4xl">
                        Legal help that starts with understanding.
                      </h2>

                      <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                        Explore your options before taking the next step.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-5 -left-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:-left-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-success">
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Platform principle</p>
                      <p className="text-sm font-bold text-navy">
                        Information with context
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="page-container py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">HOW CAN WE HELP?</p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">
              Start with what you need today
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Choose a path based on your legal problem, document or professional
              requirement.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="card group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue transition group-hover:bg-navy group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-navy">
                    {action.title}
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">
                    {action.text}
                  </p>

                  <Link
                    href={action.href}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue hover:underline"
                  >
                    {action.label}
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Citizen / lawyer split */}
        <section className="page-container py-8 md:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-navy"
            >
              <Image
                src="/images/citizen-help.jpg.avif"
                alt="Citizen receiving legal support"
                fill
                className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-65"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

              <div className="relative flex min-h-[440px] flex-col justify-end p-6 text-white sm:p-9">
                <p className="section-label text-amber-300">FOR CITIZENS</p>

                <h2 className="mt-3 max-w-md text-3xl font-black sm:text-4xl">
                  Legal information in language you can understand
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-200">
                  Describe your issue, understand possible options, explore
                  documents and discover verified advocate listings.
                </p>

                <Link href="/citizen" className="btn mt-6 w-fit bg-white text-navy hover:bg-slate-100">
                  Explore legal help
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#10253e]"
            >
              <Image
                src="/images/lawyer-workspace.jpg.avif"
                alt="Lawyer working with documents in a professional workspace"
                fill
                className="object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071a31] via-[#10253e]/60 to-transparent" />

              <div className="relative flex min-h-[440px] flex-col justify-end p-6 text-white sm:p-9">
                <p className="section-label text-amber-300">FOR LAWYERS</p>

                <h2 className="mt-3 max-w-md text-3xl font-black sm:text-4xl">
                  A smarter workspace for legal practice
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-200">
                  Organise clients and matters, conduct grounded research,
                  review authorities and prepare assisted drafts.
                </p>

                <Link href="/dashboard" className="btn mt-6 w-fit">
                  Open lawyer workspace
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Legal areas */}
        <section className="page-container py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-label">LEGAL TOPICS</p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">
                Explore common legal concerns
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-slate-600">
                Start with a broad area and explain your situation in your own
                words. NyayaSetu helps organise the conversation.
              </p>

              <Link href="/citizen" className="btn mt-6 w-fit">
                Explore legal help
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {legalAreas.map((area, index) => (
                <motion.div
                  key={area}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-sm font-black text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-navy">{area}</span>
                  </div>

                  <ArrowRight size={17} className="text-slate-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white/70">
          <div className="page-container py-14 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-label">HOW NYAYASETU WORKS</p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">
                From a question to a clearer next step
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {workflow.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-3xl border border-slate-200 bg-white p-5"
                >
                  {index < workflow.length - 1 && (
                    <span className="absolute -right-3 top-12 z-10 hidden text-xl text-gold md:block">
                      →
                    </span>
                  )}

                  <span className="text-sm font-black text-gold">
                    {item.number}
                  </span>

                  <h3 className="mt-5 text-xl font-bold text-navy">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal identity image section */}
        <section className="page-container py-14 md:py-20">
          <div className="grid overflow-hidden rounded-[2rem] bg-navy lg:grid-cols-2">
            <div className="relative min-h-[320px]">
              <Image
                src="/images/india-legal-system.jpg.avif"
                alt="Indian legal system and law books"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-navy/35" />
            </div>

            <div className="flex flex-col justify-center p-7 text-white sm:p-10">
              <p className="section-label text-amber-300">BUILT FOR INDIA</p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Technology with legal context and human responsibility
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Legal information should be easier to discover, understand and
                discuss. NyayaSetu brings technology and structured legal
                workflows together while keeping professional review important.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <ShieldCheck size={20} className="text-amber-300" />
                  <p className="mt-3 text-sm font-semibold">
                    Trust-focused experience
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <LockKeyhole size={20} className="text-amber-300" />
                  <p className="mt-3 text-sm font-semibold">
                    Privacy-conscious workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auth area */}
        <section className="page-container pb-16">
          <Unauthenticated>
            <div className="grid items-center gap-8 rounded-[2rem] border border-blue-100 bg-blue-50/60 p-6 sm:p-10 lg:grid-cols-2">
              <div>
                <p className="section-label">GET STARTED</p>

                <h2 className="mt-3 text-3xl font-black text-navy">
                  Create your secure legal workspace
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
                  Create an account to explore the platform and organise your
                  legal work in one place.
                </p>
              </div>

              <div className="flex justify-center lg:justify-end">
                <AuthForm />
              </div>
            </div>
          </Unauthenticated>

          <Authenticated>
            <div className="rounded-[2rem] bg-navy p-8 text-center text-white">
              <Gavel className="mx-auto text-amber-300" size={30} />

              <h2 className="mt-4 text-3xl font-black">
                Continue to your workspace
              </h2>

              <p className="mt-3 text-sm text-slate-300">
                Manage matters, clients, research and drafts.
              </p>

              <Link href="/dashboard" className="btn mt-6 bg-white text-navy hover:bg-slate-100">
                Open workspace
              </Link>
            </div>
          </Authenticated>
        </section>
      </main>
    </>
  );
}