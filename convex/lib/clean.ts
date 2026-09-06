// Denoising for judgment text — the "no noise with the data" requirement.
// Removes running headers/footers, page numbers, signature/watermark stamps, portal URLs,
// OCR hyphenation across line breaks, form-feeds and repeated boilerplate. Deterministic and
// idempotent: running it twice yields the same output.
import { fnv1a } from "./hash";

const NOISE_LINE_PATTERNS: RegExp[] = [
  /^\s*page\s+\d+\s+of\s+\d+\s*$/i,
  /^\s*\d+\s*$/, // bare page number
  /^\s*[-–—]{2,}\s*$/, // separator rules
  /digitally signed/i,
  /signature not verified/i,
  /^\s*reportable\s*$/i,
  /^\s*non[- ]?reportable\s*$/i,
  /www\.[^\s]+/i,
  /https?:\/\/\S+/i,
  /^\s*::?\s*downloaded on/i,
  /^\s*true\s+copy\s*$/i,
  /indian kanoon/i,
];

const INLINE_NOISE: [RegExp, string][] = [
  [/\f/g, " "], // form feed
  [/[ \t]*\bPage\s+\d+\s+of\s+\d+\b/gi, " "],
  [/\bWWW\.[A-Z0-9./-]+\b/gi, " "],
  [/[•◆▪●■]/g, " "],
];

function nfkc(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/ /g, " ")
    .replace(/﻿/g, "");
}

function dehyphenate(text: string): string {
  // Join words split across line breaks by OCR: "juris-\ndiction" -> "jurisdiction".
  return text.replace(/(\w)-\n\s*(\w)/g, "$1$2");
}

function stripRepeatedHeadersFooters(lines: string[]): string[] {
  const norm = lines.map((ln) => ln.trim().toLowerCase().replace(/\d+/g, "#"));
  const counts = new Map<string, number>();
  for (const n of norm) {
    if (n.length > 0 && n.length <= 80) counts.set(n, (counts.get(n) ?? 0) + 1);
  }
  const repeated = new Set<string>();
  for (const [n, c] of counts) if (c >= 4 && n.length <= 80) repeated.add(n);
  return lines.filter((_, i) => !repeated.has(norm[i]));
}

function isNoiseLine(line: string): boolean {
  const s = line.trim();
  if (!s) return false; // blanks handled by whitespace collapse
  return NOISE_LINE_PATTERNS.some((p) => p.test(s));
}

export function cleanJudgmentText(raw: string): string {
  if (!raw) return "";
  let text = nfkc(raw);
  text = dehyphenate(text);
  for (const [pat, repl] of INLINE_NOISE) text = text.replace(pat, repl);

  let lines = text.split("\n");
  lines = stripRepeatedHeadersFooters(lines);
  const kept = lines.filter((ln) => !isNoiseLine(ln));

  text = kept.join("\n");
  // Idempotent whitespace collapse: squeeze spaces, strip each line, reduce 3+ newlines.
  text = text.replace(/[ \t]+/g, " ");
  text = text
    .split("\n")
    .map((ln) => ln.trim())
    .join("\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/\.{3,}/g, ".");
  text = text.replace(/([,;:])\1+/g, "$1");
  return text.trim();
}

const WORD = /[A-Za-z]{3,}/;

// True if the doc is still mostly noise after cleaning and should be skipped.
export function isLowQuality(text: string, minChars = 400, minWordRatio = 0.55): boolean {
  if (text.length < minChars) return true;
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const wordLike = tokens.filter((t) => WORD.test(t)).length;
  return wordLike / tokens.length < minWordRatio;
}

export function contentHash(text: string): string {
  return fnv1a(text);
}
