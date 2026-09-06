import { describe, expect, it } from "vitest";
import { chunkText } from "./chunk";

describe("chunkText", () => {
  it("splits into ordered chunks", () => {
    const text = Array.from({ length: 6 }, (_, i) => `Paragraph ${i} with enough words to matter here.`).join(
      "\n\n",
    );
    const chunks = chunkText(text, { targetTokens: 20, overlapTokens: 0 });
    expect(chunks.length).toBeGreaterThan(1);
    chunks.forEach((c, i) => expect(c.ordinal).toBe(i));
  });

  it("dedups identical paragraphs across a doc (no-overlap)", () => {
    const para = "The insurer must satisfy the claim under the Act.";
    const text = [para, para, para].join("\n\n");
    // With zero overlap, identical paragraph bodies hash the same and collapse to one chunk.
    const chunks = chunkText(text, { targetTokens: 10, overlapTokens: 0 });
    expect(chunks.length).toBe(1);
  });

  it("returns nothing for empty input", () => {
    expect(chunkText("")).toEqual([]);
  });
});
