// Deterministic citation verifier (§9.3) as an internal query over the corpus.
// Rules: resolve every candidate against the corpus; unresolved candidates are DROPPED (not
// flagged); every survivor links to a corpus document + passage; fabricationRate is returned.
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { parseCitation } from "./lib/citation";
import { passageSupported } from "./lib/text";
import { findDocByCaseName, findDocByCitation } from "./model/corpus";

const candidate = v.object({
  caseName: v.string(),
  citationString: v.string(),
  relevancePassage: v.string(),
});

function firstPassage(text: string, n = 320): string {
  return text.replace(/\s+/g, " ").slice(0, n);
}

export const verifyCitations = internalQuery({
  args: { candidates: v.array(candidate) },
  handler: async (ctx, { candidates }) => {
    const verified: {
      caseName: string;
      citationString: string;
      corpusDocumentId: string;
      sourceUrl?: string;
      relevancePassage: string;
      matchMethod: string;
    }[] = [];
    const dropped: { caseName: string; citationString: string }[] = [];
    const seen = new Set<string>();

    for (const cand of candidates) {
      let resolved = null as Awaited<ReturnType<typeof findDocByCitation>>;
      let method = "";

      const parsed = parseCitation(cand.citationString);
      if (parsed) {
        resolved = await findDocByCitation(ctx, parsed.canonical);
        if (resolved) method = "citation";
      }
      if (!resolved && cand.caseName) {
        const doc = await findDocByCaseName(ctx, cand.caseName);
        if (doc) {
          const passage = cand.relevancePassage || firstPassage(doc.cleanText);
          if (passageSupported(passage, doc.cleanText)) {
            resolved = doc;
            method = "case_name";
          }
        }
      }

      if (!resolved) {
        dropped.push({ caseName: cand.caseName, citationString: cand.citationString });
        continue;
      }
      const key = `${resolved._id}|${cand.citationString}`;
      if (seen.has(key)) continue;
      seen.add(key);
      verified.push({
        caseName: resolved.caseName,
        citationString: cand.citationString,
        corpusDocumentId: resolved._id,
        sourceUrl: resolved.sourceUrl,
        relevancePassage: cand.relevancePassage || firstPassage(resolved.cleanText),
        matchMethod: method,
      });
    }

    const total = verified.length + dropped.length;
    return {
      verified,
      dropped,
      droppedCount: dropped.length,
      fabricationRate: total ? dropped.length / total : 0,
    };
  },
});
