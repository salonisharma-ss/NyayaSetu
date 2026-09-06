import { describe, expect, it } from "vitest";
import { cleanJudgmentText, contentHash, isLowQuality } from "./clean";

describe("cleanJudgmentText (denoise)", () => {
  it("removes page numbers, stamps and portal URLs", () => {
    const raw =
      "The Court held that the insurer is liable.\n" +
      "Page 5 of 12\nDigitally signed\nSIGNATURE NOT VERIFIED\nwww.somecourt.gov.in\n" +
      "This principle is well settled.";
    const out = cleanJudgmentText(raw);
    expect(out).not.toContain("Page 5 of 12");
    expect(out).not.toContain("Digitally signed");
    expect(out.toLowerCase()).not.toContain("www.somecourt.gov.in");
    expect(out).toContain("insurer is liable");
    expect(out).toContain("well settled");
  });

  it("de-hyphenates words split across line breaks", () => {
    expect(cleanJudgmentText("The juris-\ndiction of the court is limited.")).toContain(
      "jurisdiction",
    );
  });

  it("strips a running header repeated across the doc", () => {
    const header = "IN THE SUPREME COURT OF INDIA";
    const contents = [
      "The insurer must satisfy the decree under the policy.",
      "A wilful breach of a fundamental condition must be shown.",
      "Third-party statutory liability cannot be avoided lightly.",
      "The finance liability is independent of the claim dispute.",
      "Deficiency in service attracts compensation to the insured.",
    ];
    const raw = contents.map((c) => `${header}\n${c}`).join("\n");
    const out = cleanJudgmentText(raw);
    expect((out.match(new RegExp(header, "g")) ?? []).length).toBeLessThanOrEqual(1);
    expect(out).toContain("wilful breach");
    expect(out).toContain("Deficiency in service");
  });

  it("is idempotent", () => {
    const raw = "Held: liable.\n\n\nPage 1 of 3\nwww.x.com\nsettled law....";
    const once = cleanJudgmentText(raw);
    expect(cleanJudgmentText(once)).toBe(once);
  });
});

describe("isLowQuality", () => {
  it("flags short / gibberish, passes real text", () => {
    expect(isLowQuality("short")).toBe(true);
    expect(isLowQuality("12 34 !! ?? ## $$ %% ^^ && ** (( )) -- ++".repeat(20))).toBe(true);
    expect(isLowQuality("The Court held that the insurer must satisfy the claim. ".repeat(20))).toBe(
      false,
    );
  });
});

describe("contentHash", () => {
  it("is stable and distinguishing", () => {
    expect(contentHash("abc")).toBe(contentHash("abc"));
    expect(contentHash("abc")).not.toBe(contentHash("abd"));
  });
});
