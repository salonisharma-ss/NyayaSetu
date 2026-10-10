"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Mail, LockKeyhole, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function getAuthErrorMessage(error: unknown, flow: "signIn" | "signUp") {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("already exists") || message.includes("already registered") || message.includes("account exists")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (message.includes("invalid password") || message.includes("password")) {
    return flow === "signUp"
      ? "Your password must be at least 8 characters long."
      : "The email or password is incorrect.";
  }

  if (message.includes("network") || message.includes("fetch") || message.includes("websocket")) {
    return "Connection error. Please check your internet and try again.";
  }

  return flow === "signUp"
    ? "We could not create your account. Please try again."
    : "The email or password is incorrect.";
}

export default function AuthForm({ flow: initialFlow = "signUp" }: { flow?: "signIn" | "signUp" }) {
  const { signIn } = useAuthActions();

  const [flow, setFlow] = useState<"signIn" | "signUp">(initialFlow);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (flow === "signUp" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await signIn("password", {
        email: normalizedEmail,
        password,
        flow,
      });
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, flow));
      setBusy(false);
    }
  }

  const isSignUp = flow === "signUp";

  return (
    <form onSubmit={submit} className="card w-full max-w-md border-white/70 p-7">
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue">
          <ShieldCheck size={24} />
        </div>
        <p className="section-label">SECURE WORKSPACE</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-navy">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isSignUp
            ? "Join NyayaSetu to access legal intelligence and trusted advocates."
            : "Sign in to your NyayaSetu workspace."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="auth-email">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="your@email.com"
              disabled={busy}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="auth-password">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 pr-10"
              placeholder="At least 8 characters"
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div>
            <label className="label" htmlFor="auth-confirm">
              Confirm password
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="auth-confirm"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-10 pr-10"
                placeholder="Confirm password"
                disabled={busy}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50/80 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button type="submit" className="btn mt-6 w-full" disabled={busy}>
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {isSignUp ? "Create account" : "Sign in"}
            <ArrowRight size={16} />
          </span>
        )}
      </button>

      <div className="mt-6 border-t border-slate-200/80 pt-6 text-center text-sm">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setFlow("signIn");
                setError(null);
              }}
              className="font-semibold text-blue hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setFlow("signUp");
                setError(null);
              }}
              className="font-semibold text-blue hover:underline"
            >
              Create one
            </button>
          </>
        )}
      </div>
    </form>
  );
}
