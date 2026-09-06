// Indian legal citation parsing + normalization (§9.3).
// Handles parallel citations: the same judgment appears as SCC/AIR/SCR/SCC OnLine/INSC. We
// normalize each to a canonical key so different spellings resolve to the same corpus document.

export interface ParsedCitation {
  raw: string;
  canonical: string;
  reporter: string;
  year: number;
  number: number;
  volume?: number;
}

const REPORTER_ALIASES: Record<string, string> = {
  scc: "SCC",
  air: "AIR",
  scr: "SCR",
  "scc online": "SCCONLINE",
  scconline: "SCCONLINE",
  insc: "INSC",
};

// (year) vol REPORTER page  e.g. (2019) 5 SCC 266
const RE_VOL_REPORTER_PAGE =
  /\(?((?:19|20)\d{2})\)?\s+(\d{1,3})\s+(scc online sc|scc online|s\.?c\.?c\.?|a\.?i\.?r\.?|s\.?c\.?r\.?)\s+(\d{1,5})/i;
// REPORTER year [SC] page   e.g. AIR 2019 SC 1234
const RE_REPORTER_YEAR_PAGE =
  /(a\.?i\.?r\.?|s\.?c\.?c\.?|s\.?c\.?r\.?)\s+((?:19|20)\d{2})\s+(?:sc\s+)?(\d{1,5})/i;
// year SCC OnLine [SC] page e.g. 2019 SCC OnLine SC 1005
const RE_SCC_ONLINE = /((?:19|20)\d{2})\s+scc\s+online\s+(?:sc\s+)?(\d{1,6})/i;
// Neutral: year INSC number e.g. 2023 INSC 456
const RE_NEUTRAL = /((?:19|20)\d{2})\s+insc\s+(\d{1,6})/i;

function canonReporter(text: string): string {
  const t = text.trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
  return REPORTER_ALIASES[t] ?? t.toUpperCase();
}

export function parseCitation(text: string): ParsedCitation | null {
  if (!text) return null;
  const s = text.trim();

  let m = RE_SCC_ONLINE.exec(s);
  if (m) {
    const year = +m[1];
    const page = +m[2];
    return { raw: s, canonical: `SCCONLINE:${year}:${page}`, reporter: "SCCONLINE", year, number: page };
  }
  m = RE_NEUTRAL.exec(s);
  if (m) {
    const year = +m[1];
    const num = +m[2];
    return { raw: s, canonical: `INSC:${year}:${num}`, reporter: "INSC", year, number: num };
  }
  m = RE_VOL_REPORTER_PAGE.exec(s);
  if (m) {
    const rep = canonReporter(m[3]);
    const year = +m[1];
    const vol = +m[2];
    const page = +m[4];
    return { raw: s, canonical: `${rep}:${year}:${vol}:${page}`, reporter: rep, year, number: page, volume: vol };
  }
  m = RE_REPORTER_YEAR_PAGE.exec(s);
  if (m) {
    const rep = canonReporter(m[1]);
    const year = +m[2];
    const page = +m[3];
    return { raw: s, canonical: `${rep}:${year}:${page}`, reporter: rep, year, number: page };
  }
  return null;
}

export function normalizeCitation(text: string): string | null {
  return parseCitation(text)?.canonical ?? null;
}

// Find every distinct citation in a block of text (dedup by canonical key).
export function extractAllCitations(text: string): ParsedCitation[] {
  const out = new Map<string, ParsedCitation>();
  const globals = [
    new RegExp(RE_SCC_ONLINE, "gi"),
    new RegExp(RE_NEUTRAL, "gi"),
    new RegExp(RE_VOL_REPORTER_PAGE, "gi"),
    new RegExp(RE_REPORTER_YEAR_PAGE, "gi"),
  ];
  for (const re of globals) {
    let match: RegExpExecArray | null;
    while ((match = re.exec(text || "")) !== null) {
      const p = parseCitation(match[0]);
      if (p && !out.has(p.canonical)) out.set(p.canonical, p);
    }
  }
  return [...out.values()];
}
