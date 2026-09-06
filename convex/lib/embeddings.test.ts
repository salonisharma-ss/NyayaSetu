import { describe, expect, it } from "vitest";
import { EMBEDDING_DIM } from "./constants";
import { fakeEmbed } from "./embeddings";

function cosine(a: number[], b: number[]) {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}

describe("fakeEmbed (deterministic dev embedder)", () => {
  it("has the configured dimension and is L2-normalized", () => {
    const v = fakeEmbed("motor vehicle insurance repudiation");
    expect(v.length).toBe(EMBEDDING_DIM);
    expect(Math.abs(Math.sqrt(cosine(v, v)) - 1)).toBeLessThan(1e-6);
  });

  it("is deterministic", () => {
    expect(fakeEmbed("truck accident claim")).toEqual(fakeEmbed("truck accident claim"));
  });

  it("ranks related text above unrelated text", () => {
    const q = fakeEmbed("insurer refused the motor accident claim");
    const related = fakeEmbed("the insurer wrongfully repudiated the accident claim");
    const unrelated = fakeEmbed("tenant eviction for arrears of rent under rent control");
    expect(cosine(q, related)).toBeGreaterThan(cosine(q, unrelated));
  });
});
