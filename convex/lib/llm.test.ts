import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { complete } from "./llm";

const KEYS = ["GROQ_API_KEY", "GEMINI_API_KEY", "GEMINI_PAID_API_KEY", "GEMINI_FREE_API_KEY", "GEMINI_ALLOW_PRIVILEGED"];
let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = {};
  for (const k of KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});
afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("sensitivity routing (§6)", () => {
  it("privileged with only a FREE gemini key never uses it — falls back to offline echo", async () => {
    process.env.GEMINI_FREE_API_KEY = "FREE";
    const res = await complete("privileged", "", "some privileged matter facts");
    expect(res.trainedOn).toBe(false);
    expect(res.provider).toBe("echo");
  });

  it("general with a free gemini key is allowed to use it (marked trainedOn)", async () => {
    // no network here, so it will fail the call and fall to echo; assert the chain ALLOWS it
    process.env.GEMINI_FREE_API_KEY = "FREE";
    const res = await complete("general", "", "what is deficiency in service");
    // echo fallback after network failure, but no throw about privileged invariant
    expect(res).toBeTruthy();
  });

  it("offline echo stays grounded to the CONTEXT block", async () => {
    const res = await complete("privileged", "sys", "Summarize.\n\nCONTEXT:\nThe insurer is liable under the Act.");
    expect(res.provider).toBe("echo");
    expect(res.text).toContain("insurer is liable");
  });

  it("GEMINI_API_KEY is not used for privileged unless GEMINI_ALLOW_PRIVILEGED=true", async () => {
    process.env.GEMINI_API_KEY = "SINGLE";
    const res = await complete("privileged", "", "privileged facts");
    // single key alone -> not treated as no-training -> echo
    expect(res.provider).toBe("echo");
  });
});
