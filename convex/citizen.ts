import { v } from "convex/values";
import { action } from "./_generated/server";
import { complete } from "./lib/llm";
import { redactPii } from "./lib/pii";

// C1 citizen info-assistant. Information, NOT advice. Non-privileged → free tier permitted, so
// PII MUST be redacted before the prompt leaves the process (§9.2).
const DISCLAIMER =
  "This is general legal information, not legal advice, and does not create an advocate-client " +
  "relationship. For advice on your situation, please consult a verified advocate.";

const SYS =
  "You provide general legal INFORMATION about Indian law to the public. You do NOT give advice, " +
  "predict outcomes, or draft documents. Keep it plain-language and neutral, and end by " +
  "suggesting the person consult a qualified advocate. Never claim certainty about a specific case.";

export const ask = action({
  args: { question: v.string() },
  handler: async (_ctx, { question }) => {
    const safe = redactPii(question).text;
    const res = await complete("general", SYS, safe);
    return {
      answer: res.text,
      disclaimer: DISCLAIMER,
      modelUsed: `${res.provider}:${res.model}`,
    };
  },
});
