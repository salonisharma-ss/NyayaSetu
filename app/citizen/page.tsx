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
        "Hi! Tell me what happened in plain words — for example, “I had an accident and the other person won’t pay,” and I’ll explain your options and can help you find an advocate.",
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
      const r = await respond({ sessionId: (sessionId as any) ?? undefined, history, message: text });
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
      /* ignore */
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
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 sm:px-4">
        <div className="py-4">
          <h1 className="text-xl font-bold">Legal information assistant</h1>
          <p className="text-xs text-slate-500">
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
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-sm text-white"
                    : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm"
                }
              >
                {m.content}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">
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
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
              <p className="text-sm font-medium text-slate-800">Want help from a {CATEGORY_LABEL[category]} advocate?</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {needsLocation && (
                  <input
                    className="input max-w-[180px]"
                    placeholder="Your city (e.g. Delhi)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                )}
                <button className="btn" disabled={findingAdv} onClick={locateAdvocates}>
                  {findingAdv ? "Finding advocates…" : "Find advocates near me"}
                </button>
              </div>

              {advocates && advocates.length === 0 && (
                <p className="mt-3 text-sm text-slate-500">
                  No advocates found for that filter. Try a different city, or browse the{" "}
                  <a href="/marketplace" className="text-brand underline">directory</a>.
                </p>
              )}
              {advocates && advocates.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {advocates.map((a, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="font-medium text-slate-900">{a.name}</p>
                      {a.address && <p className="text-xs text-slate-500">{a.address}</p>}
                      {a.city && <p className="text-xs text-slate-400">{a.city}</p>}
                      <div className="mt-2 flex gap-3 text-xs">
                        {a.phone && <a href={`tel:${a.phone}`} className="text-brand underline">Call</a>}
                        {a.url && (
                          <a href={a.url} target="_blank" rel="noreferrer" className="text-brand underline">
                            View details →
                          </a>
                        )}
                        <span className="badge">via {a.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {category && category !== "other" && !busy && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              {!consentDone ? (
                <>
                  <p className="text-sm font-medium text-slate-800">
                    Want us to connect you with a verified advocate?
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    With your consent, we&apos;ll share a short summary of your{" "}
                    {CATEGORY_LABEL[category]} matter{city ? ` in ${city}` : ""} with verified,
                    BCI-enrolled advocates so they can reach out and help. You can decline — this is
                    optional, and only what you approve is shared.
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                    className="btn mt-3 bg-emerald-600 hover:bg-emerald-700"
                    disabled={consenting || !consentName.trim() || !consentPhone.trim()}
                    onClick={shareWithAdvocate}
                  >
                    {consenting ? "Sharing…" : "I consent — connect me with an advocate"}
                  </button>
                </>
              ) : (
                <p className="text-sm font-medium text-emerald-800">
                  ✓ Thanks, {consentName}. Your case has been shared with verified advocates in your
                  area — one of them will reach out to you shortly.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 py-3">
          <div className="flex items-end gap-2">
            <textarea
              className="input flex-1 resize-none"
              rows={1}
              placeholder="Describe your legal issue…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <button className="btn" disabled={busy || !input.trim()} onClick={() => void send()}>
              Send
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Information only, not legal advice. For advice, consult a verified advocate.
          </p>
        </div>
      </main>
    </div>
  );
}
