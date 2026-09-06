"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email, password, flow });
    } catch (err) {
      setError(flow === "signUp" ? "Could not sign up. Try a different email." : "Invalid credentials.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
      <h2 className="text-lg font-semibold">
        {flow === "signUp" ? "Create your firm account" : "Sign in"}
      </h2>
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn w-full" disabled={busy}>
        {busy ? "…" : flow === "signUp" ? "Sign up" : "Sign in"}
      </button>
      <button
        type="button"
        className="w-full text-center text-sm text-brand hover:underline"
        onClick={() => setFlow(flow === "signUp" ? "signIn" : "signUp")}
      >
        {flow === "signUp" ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </form>
  );
}
