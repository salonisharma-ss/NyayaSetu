"use client";

import { useAction } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";

type Msg = { role: "user" | "assistant"; content: string };
type Advocate = { name: string; phone?: string; address?: string; city?: string; url?: string; source: string };

const CATEGORY_LABEL: Record<string, string> = {
  motor_vehicle: "Motor Vehicle",
  consumer: "Consumer Dispute",
  property: "Property / Tenancy",
  other: "General",
};

const THINKING = [
  "Understanding your issue…",
  "Identifying the applicable law…",
  "Preparing plain-language guidance…",
];

export default function CitizenPage() {
  const respond = useAction(api.chat.respond);
  const findAdvocates = useAction(api.advocates.findAdvocates);
  const grantConsent = useAction(api.chat.grantConsent);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! Tell me what happened in plain words — for example, 'I had an accident and the other person won’t pay,' and I’ll explain your options and can help you find an advocate.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinkIdx, setThinkIdx] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [needsLocation, setNeedsLocation] = useState(false);
  const [city, setCity] = useState("");
  const [advocates, setAdvocates] = useState<Advocate[] | null>(null);
  const [findingAdv, setFindingAdv] = useState(false);
  const [consentName, setConsentName] = useState("");
  const [consentPhone, setConsentPhone] = useState("");
  const [consenting, setConsenting] = useState(false);
  const [consentDone, setConsentDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, advocates, busy]);

  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setThinkIdx((i) => (i + 1) % THINKING.length), 1200);
    return () => clearInterval(t);
  }, [busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    try {
      const r = await respond({
        sessionId: (sessionId as any) ?? undefined,
        history,
        message: text,
      });

      setSessionId(r.sessionId);
      setCategory(r.category);
      setNeedsLocation(r.needsLocation && r.category !== "other");
      if (r.location) setCity(r.location);
      setMessages((m) => [...m, { role: "assistant", content: r.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry — I couldn't reach the assistant. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function shareWithAdvocate() {
    if (!sessionId || !consentName.trim() || !consentPhone.trim()) return;
    setConsenting(true);

    try {
      await grantConsent({
        sessionId: sessionId as any,
        contactName: consentName.trim(),
        contactPhone: consentPhone.trim(),
      });
      setConsentDone(true);
    } catch {
      // ignore
    } finally {
      setConsenting(false);
    }
  }

  async function locateAdvocates() {
    if (!category || category === "other") return;
    setFindingAdv(true);
    setAdvocates(null);

    try {
      const r = await findAdvocates({ practiceArea: CATEGORY_LABEL[category], city: city || undefined });
      setAdvocates(r.advocates);
    } catch {
      setAdvocates([]);
    } finally {
      setFindingAdv(false);
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col">
      <Nav />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-3 sm:px-4">
        <div className="py-4">
          <p className="section-label">LEGAL ASSISTANT</p>
          <h1 className="mt-2 text-2xl font-black text-navy">Legal information assistant</h1>

          <p className="mt-2 text-sm text-slate-500">
            General information about Indian law — not legal advice. Identifiers you type are redacted.
            {category && category !== "other" && (
              <span className="badge ml-2">Detected: {CATEGORY_LABEL[category]}</span>
            )}
          </p>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-sm text-white shadow-md"
                    : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm"
                }
              >
                {m.content}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </span>
                {THINKING[thinkIdx]}
              </div>
            </div>
        )}

          {category && category !== "other" && !busy && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  ⚖
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">
                    Find a verified advocate
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Based on your conversation, you may want to speak with a
                    {` ${CATEGORY_LABEL[category]}`} advocate.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {needsLocation && (
                      <input
                        className="input max-w-[220px]"
                        placeholder="Your city, e.g. Delhi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    )}

                    <button
                      className="btn"
                      disabled={findingAdv}
                      onClick={() => void locateAdvocates()}
                    >
                      {findingAdv ? "Finding advocates..." : "Find advocates"}
                    </button>
                  </div>
                </div>
              </div>

              {advocates && advocates.length === 0 && (
                <p className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-600">
                  No advocates found for this filter. Try another city or visit
                  the{" "}
                  <a href="/marketplace" className="font-semibold text-blue underline">
                    advocate directory
                  </a>
                  .
                </p>
              )}

              {advocates && advocates.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {advocates.map((advocate, index) => (
                    <div
                      key={`${advocate.name}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-navy">{advocate.name}</p>

                          {advocate.city && (
                            <p className="mt-1 text-xs text-slate-500">
                              {advocate.city}
                            </p>
                          )}
                        </div>

                        <span className="badge-success">Verified</span>
                      </div>

                      {advocate.address && (
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {advocate.address}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-3 text-xs">
                        {advocate.phone && (
                          <a
                            href={`tel:${advocate.phone}`}
                            className="font-semibold text-blue hover:underline"
                          >
                            Call advocate
                          </a>
                        )}

                        {advocate.url && (
                          <a
                            href={advocate.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-blue hover:underline"
                          >
                            View profile →
                          </a>
                        )}

                        <span className="badge">via {advocate.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {category && category !== "other" && !busy && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              {!consentDone ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-bold text-emerald-900">
                        Want to connect with a verified advocate?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                        This is optional. With your consent, only the information
                        you approve will be shared with verified advocates.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <input
                      className="input"
                      placeholder="Your name"
                      value={consentName}
                      onChange={(e) => setConsentName(e.target.value)}
                    />

                    <input
                      className="input"
                      placeholder="Phone or email"
                      value={consentPhone}
                      onChange={(e) => setConsentPhone(e.target.value)}
                    />
                  </div>

                  <button
                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={
                      consenting ||
                      !consentName.trim() ||
                      !consentPhone.trim()
                    }
                    onClick={() => void shareWithAdvocate()}
                  >
                    {consenting
                      ? "Sharing..."
                      : "I consent — connect me with an advocate"}
                  </button>
                </>
              ) : (
                <p className="text-sm font-semibold text-emerald-800">
                  ✓ Thanks, {consentName}. Your request has been shared with
                  verified advocates.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 py-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
            <div className="flex items-end gap-2">
              <textarea
                className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                rows={1}
                placeholder="Describe your legal issue..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />

              <button
                className="btn shrink-0"
                disabled={busy || !input.trim()}
                onClick={() => void send()}
              >
                Send
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            Information only, not legal advice. For advice, consult a verified
            advocate.
          </p>
        </div>
      </main>
    </div>
  );
}