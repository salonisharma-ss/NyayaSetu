import { describe, expect, it } from "vitest";
import { redactPii } from "./pii";

describe("redactPii", () => {
  it("redacts email, phone, PAN and Aadhaar", () => {
    const r = redactPii(
      "Contact me at ravi.kumar@example.com or +91 98765 43210. PAN ABCDE1234F, Aadhaar 1234 5678 9012.",
    );
    expect(r.text).not.toContain("ravi.kumar@example.com");
    expect(r.text.replace(/\s/g, "")).not.toContain("9876543210");
    expect(r.text).not.toContain("ABCDE1234F");
    expect(r.text).not.toContain("1234 5678 9012");
    expect(r.counts["[EMAIL]"]).toBe(1);
    expect(r.counts["[PAN]"]).toBe(1);
    expect(r.counts["[AADHAAR]"]).toBe(1);
    expect(r.counts["[PHONE]"]).toBe(1);
    expect(r.redactedAny).toBe(true);
  });

  it("leaves clean text untouched", () => {
    const text = "What is the limitation period for a consumer complaint?";
    const r = redactPii(text);
    expect(r.text).toBe(text);
    expect(r.redactedAny).toBe(false);
  });
});
