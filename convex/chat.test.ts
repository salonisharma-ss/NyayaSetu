import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob(["./**/*.ts", "!./**/*.test.ts", "!./http.ts", "!./auth.ts"]);

describe("citizen chatbot", () => {
  test("respond returns a structured answer and persists a session", async () => {
    const t = convexTest(schema, modules);
    const r = await t.action(api.chat.respond, {
      history: [],
      message: "I had a bike accident and the other person won't pay for damages",
    });
    expect(r.answer.length).toBeGreaterThan(0);
    expect(typeof r.category).toBe("string");
    expect(r.sessionId).toBeTruthy();
    // session stored
    const sessions = await t.run((ctx) => ctx.db.query("chatSessions").collect());
    expect(sessions.length).toBe(1);
    expect(sessions[0].messages.length).toBe(2); // user + assistant

    // consent flow: opt-in shares contact, and it shows up in the firm-side leads inbox
    await t.action(api.chat.grantConsent, {
      sessionId: r.sessionId,
      contactName: "Test Citizen",
      contactPhone: "9876543210",
    });
    const leads = await t.withIdentity({ subject: "u1|s" }).query(api.chat.leads, {});
    expect(leads.length).toBe(1);
    expect(leads[0].contactName).toBe("Test Citizen");
  });
});

describe("advocate search", () => {
  test("falls back to the directory when Apify is not configured", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.marketplace.seedSampleLawyers, {});
    const r = await t.action(api.advocates.findAdvocates, {
      practiceArea: "Motor Vehicle",
      city: "Delhi",
    });
    expect(r.source).toBe("directory");
    expect(r.advocates.length).toBeGreaterThan(0);
    expect(r.advocates.every((a: any) => a.city === "Delhi")).toBe(true);
  });
});
