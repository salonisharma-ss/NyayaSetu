"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function AuthForm() {
  const { signIn } = useAuthActions();

  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBusy(true);
    setError(null);

    try {
      await signIn("password", {
        email,
        password,
        flow,
      });
    } catch {
      setError(
        flow === "signUp"
          ? "We could not create your account. Please check your email and try again."
          : "The email or password is incorrect.",
      );
      setBusy(false);
    }
  }

  const isSignUp = flow === "signUp";

  return (
    <form
      onSubmit={submit}
      className="card w-full max-w-md border-white/70 p-6 sm:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue/10 text-blue">
            <ShieldCheck size={23} />
          </div>

          <p className="section-label">SECURE LEGAL WORKSPACE</p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isSignUp
              ? "Start managing your legal research and matters in one secure workspace."
              : "Sign in to continue to your NyayaSetu workspace."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="auth-email">
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="auth-email"
              className="input pl-10"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="auth-password">
            Password
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="auth-password"
              className="input pl-10"
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button type="submit" className="btn mt-6 w-full" disabled={busy}>
        {busy
          ? "Please wait..."
          : isSignUp
            ? "Create secure account"
            : "Sign in to workspace"}
      </button>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck size={14} className="text-success" />
        <span>Your legal workspace is protected by secure authentication.</span>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        className="w-full text-center text-sm font-semibold text-blue transition hover:text-navy"
        onClick={() => {
          setError(null);
          setFlow(isSignUp ? "signIn" : "signUp");
        }}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "New to NyayaSetu? Create an account"}
      </button>
    </form>
  );
}
