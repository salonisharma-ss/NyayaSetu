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
  LogOut,
  Settings,
  User,
} from "lucide-react";

const citizenLinks = [
  {
    href: "/citizen",
    label: "Ask legal assistant",
    description: "Explain your legal issue in plain words",
    icon: Scale,
  },
  {
    href: "/citizen/documents",
    label: "Analyze a document",
    description: "Understand important clauses and risks",
    icon: FileSearch,
  },
  {
    href: "/marketplace",
    label: "Find an advocate",
    description: "Discover verified advocates near you",
    icon: ShieldCheck,
  },
];

const lawyerLinks = [
  {
    href: "/lawyer/dashboard",
    label: "Lawyer workspace",
    description: "Manage cases and clients",
  },
  {
    href: "/lawyer/leads",
    label: "Client leads",
    description: "See qualified leads nearby",
  },
  {
    href: "/lawyer/research",
    label: "Research & drafting",
    description: "AI-assisted legal work",
  },
];

export default function Nav() {
  const { signOut } = useAuthActions();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"citizen" | "lawyer" | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function closeMenus() {
    setMobileOpen(false);
    setOpenMenu(null);
    setUserMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between gap-5">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-blue text-white shadow-lg shadow-blue/20">
            <span className="absolute inset-0 bg-gradient-to-br from-blue/80 to-transparent" />
            <Gavel size={21} className="relative" />
          </span>

          <span className="hidden sm:block">
            <span className="block text-lg font-black leading-none tracking-tight text-navy">
              Nyaya<span className="text-blue">Setu</span>
            </span>
            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
              Legal Intelligence
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

          <Unauthenticated>
            {/* Citizens dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu(openMenu === "citizen" ? null : "citizen")
                }
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue"
              >
                For Citizens <ChevronDown size={14} />
              </button>
              {openMenu === "citizen" && (
                <div className="absolute top-full right-0 mt-1 w-64 space-y-1 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-lg">
                  {citizenLinks.map(({ href, label, description, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenus}
                      className="flex gap-3 rounded-xl p-3 transition hover:bg-blue-50 group"
                    >
                      <Icon
                        size={18}
                        className="shrink-0 text-slate-400 transition group-hover:text-blue"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-navy">
                          {label}
                        </div>
                        <div className="text-xs text-slate-500">{description}</div>
                      </div>
                    </Link>
                  ))}
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
              >
                For Lawyers <ChevronDown size={14} />
              </button>
              {openMenu === "lawyer" && (
                <div className="absolute top-full right-0 mt-1 w-64 space-y-1 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-lg">
                  {lawyerLinks.map(({ href, label, description }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenus}
                      className="flex gap-3 rounded-xl p-3 transition hover:bg-blue-50 group"
                    >
                      <Scale
                        size={18}
                        className="shrink-0 text-slate-400 transition group-hover:text-blue"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-navy">
                          {label}
                        </div>
                        <div className="text-xs text-slate-500">{description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Unauthenticated>
        </nav>

        <div className="flex items-center gap-3 lg:gap-4">
          <Unauthenticated>
            <Link href="/marketplace" className="hidden text-sm font-semibold text-slate-700 transition hover:text-blue sm:block">
              Advocates
            </Link>
            <Link href="/auth/signin" className="hidden text-sm font-semibold text-slate-700 transition hover:text-blue sm:block">
              Sign in
            </Link>
            <Link href="/auth/signup" className="btn hidden sm:flex">
              Get started
            </Link>
          </Unauthenticated>

          <Authenticated>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10 text-blue transition hover:bg-blue/20"
              >
                <User size={18} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 space-y-1 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-navy transition hover:bg-blue-50"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMenus}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-navy transition hover:bg-blue-50"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      closeMenus();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </Authenticated>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200/80 bg-white px-4 py-4 lg:hidden">
          <nav className="space-y-2">
            <Unauthenticated>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Citizens</p>
                {citizenLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenus}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:bg-blue-50"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2 border-t border-slate-200/80 pt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Lawyers</p>
                {lawyerLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenus}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:bg-blue-50"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2 border-t border-slate-200/80 pt-2">
                <Link href="/auth/signin" className="btn-ghost block w-full">
                  Sign in
                </Link>
                <Link href="/auth/signup" className="btn block w-full">
                  Get started
                </Link>
              </div>
            </Unauthenticated>
            <Authenticated>
              <Link
                href="/profile"
                onClick={closeMenus}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:bg-blue-50"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={closeMenus}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:bg-blue-50"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  closeMenus();
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Sign out
              </button>
            </Authenticated>
          </nav>
        </div>
      )}
    </header>
  );
}
