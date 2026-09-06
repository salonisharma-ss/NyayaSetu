import { describe, expect, it } from "vitest";
import { extractAllCitations, normalizeCitation, parseCitation } from "./citation";

describe("parseCitation", () => {
  it.each([
    ["(2004) 3 SCC 297", "SCC"],
    ["AIR 2004 SC 1531", "AIR"],
    ["(1973) 4 SCR 225", "SCR"],
    ["2019 SCC OnLine SC 1005", "SCCONLINE"],
    ["2023 INSC 456", "INSC"],
    ["A.I.R. 1994 SC 787", "AIR"],
  ])("parses %s as %s", (text, reporter) => {
    expect(parseCitation(text)?.reporter).toBe(reporter);
  });

  it("returns null for non-citations", () => {
    expect(parseCitation("this is not a citation")).toBeNull();
    expect(normalizeCitation("")).toBeNull();
  });
});

describe("normalizeCitation (parallel citations)", () => {
  it("is stable for the same string", () => {
    expect(normalizeCitation("(2004) 3 SCC 297")).toBe(normalizeCitation("(2004) 3 SCC 297"));
  });
  it("distinguishes different reporters", () => {
    expect(normalizeCitation("(2004) 3 SCC 297")).not.toBe(normalizeCitation("AIR 2004 SC 1531"));
  });
  it("matches dotted and spaced variants", () => {
    expect(normalizeCitation("AIR 2004 SC 1531")).toBe(normalizeCitation("A.I.R. 2004 SC 1531"));
  });
});

describe("extractAllCitations", () => {
  it("finds every distinct citation in a block", () => {
    const block =
      "See National Insurance v. Swaran Singh (2004) 3 SCC 297; also AIR 2004 SC 1531.";
    const keys = new Set(extractAllCitations(block).map((c) => c.canonical));
    expect(keys.has("SCC:2004:3:297")).toBe(true);
    expect(keys.has("AIR:2004:1531")).toBe(true);
  });
});
