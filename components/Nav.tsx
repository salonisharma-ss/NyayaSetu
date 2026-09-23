"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  ChevronDown,
  FileSearch,
  Gavel,
  Menu,
  Scale,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const citizenLinks = [
  {
    href: "/citizen",
    label: "Ask legal assistant",
    description: "Explain your legal issue",
    icon: Scale,
  },
  {
    href: "/citizen",
    label: "Analyze a document",
    description: "Understand important details",
    icon: FileSearch,
  },
  {
    href: "/marketplace",
    label: "Find an advocate",
    description: "Explore advocate listings",
    icon: ShieldCheck,
  },
];

const lawyerLinks = [
  {
    href: "/dashboard",
    label: "Lawyer workspace",
    description: "Manage your practice",
  },
  {
    href: "/dashboard",
    label: "Research and drafting",
    description: "Work with legal matters",
  },
];

export default function Nav() {
  const { signOut } = useAuthActions();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"citizen" | "lawyer" | null>(null);

  function closeMenus() {
    setMobileOpen(false);
    setOpenMenu(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-navy text-white shadow-lg shadow-navy/20">
            <span className="absolute inset-0 bg-gradient-to-br from-blue/80 to-transparent" />
            <Gavel size={21} className="relative" />
          </span>

          <span>
            <span className="block text-lg font-black leading-none tracking-tight text-navy">
              Nyaya<span className="text-blue">Setu</span>
            </span>
            <span className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
              Legal intelligence
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue"
          >
            Home
          </Link>

          {/* Citizens dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenu(openMenu === "citizen" ? null : "citizen")
              }
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue"
              aria-expanded={openMenu === "citizen"}
            >
              For citizens
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  openMenu === "citizen" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "citizen" && (
              <div className="absolute left-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-navy/10">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    Legal help center
                  </p>
                </div>

                {citizenLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-blue-50"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue">
                        <Icon size={17} />
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-navy">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lawyers dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenu(openMenu === "lawyer" ? null : "lawyer")
              }
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue"
              aria-expanded={openMenu === "lawyer"}
            >
              For lawyers
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  openMenu === "lawyer" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "lawyer" && (
              <div className="absolute left-0 top-12 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-navy/10">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    Professional workspace
                  </p>
                </div>

                {lawyerLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenus}
                    className="block rounded-xl p-3 transition hover:bg-blue-50"
                  >
                    <span className="block text-sm font-bold text-navy">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/updates"
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue"
          >
            Legal updates
          </Link>

          <Link
            href="/marketplace"
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue"
          >
            Advocate directory
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue"
            aria-label="Search"
            onClick={() => {
              window.location.href = "/updates";
            }}
          >
            <Search size={18} />
          </button>

          <Authenticated>
            <Link href="/dashboard" className="btn px-4 py-2.5">
              Workspace
            </Link>

            <button
              type="button"
              onClick={() => void signOut()}
              className="btn-ghost px-3 py-2.5"
            >
              Sign out
            </button>
          </Authenticated>

          <Unauthenticated>
            <Link href="/" className="btn px-4 py-2.5">
              Get started
            </Link>
          </Unauthenticated>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-navy lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              href="/"
              onClick={closeMenus}
              className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>

            <p className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              For citizens
            </p>

            {citizenLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-blue-50"
                >
                  <Icon size={17} className="text-blue" />
                  <span className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <p className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              For lawyers
            </p>

            {lawyerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenus}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/updates"
              onClick={closeMenus}
              className="mt-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Legal updates
            </Link>

            <Link
              href="/marketplace"
              onClick={closeMenus}
              className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Advocate directory
            </Link>

            <Authenticated>
              <Link
                href="/dashboard"
                onClick={closeMenus}
                className="btn mt-3 w-full"
              >
                Open workspace
              </Link>

              <button
                type="button"
                onClick={() => {
                  closeMenus();
                  void signOut();
                }}
                className="btn-ghost mt-2 w-full"
              >
                Sign out
              </button>
            </Authenticated>

            <Unauthenticated>
              <Link
                href="/"
                onClick={closeMenus}
                className="btn mt-3 w-full"
              >
                Get started
              </Link>
            </Unauthenticated>
          </nav>
        </div>
      )}
    </header>
  );
}