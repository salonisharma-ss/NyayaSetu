// Small, realistic demo corpus so the RAG flow works immediately after `loadDemoCorpus`.
// Real judgments (public records). Replace/augment via the ingestion pipeline with the
// OpenJustice bulk set and Indian Kanoon API (see README).
export interface DemoRecord {
  source: string;
  sourceDocId: string;
  caseName: string;
  rawText: string;
  citations?: string[];
  court?: string;
  neutralCitation?: string;
  sourceUrl?: string;
}

export const DEMO_CORPUS: DemoRecord[] = [
  {
    source: "demo",
    sourceDocId: "1",
    caseName: "National Insurance Co. Ltd. v. Swaran Singh",
    citations: ["(2004) 3 SCC 297", "AIR 2004 SC 1531"],
    court: "Supreme Court of India",
    sourceUrl: "https://indiankanoon.org/doc/1620848/",
    rawText:
      "This appeal concerns repudiation of a motor insurance claim for a commercial vehicle " +
      "involved in an accident. The insurer sought to avoid liability under the Motor Vehicles " +
      "Act, 1988. The Court held that the insurer must establish a wilful breach of a policy " +
      "condition to repudiate; a mere technical defect does not discharge the insurer's " +
      "liability to the insured or third parties. Wrongful repudiation of a genuine claim " +
      "amounts to deficiency in service. Page 1 of 12\n\nDigitally signed\n\nSection 149 of the " +
      "Motor Vehicles Act, 1988 governs the duty of insurers to satisfy judgments against " +
      "persons insured in respect of third-party risks.",
  },
  {
    source: "demo",
    sourceDocId: "2",
    caseName: "Oriental Insurance Co. Ltd. v. Nanjappan",
    citations: ["(2004) 13 SCC 224"],
    court: "Supreme Court of India",
    sourceUrl: "https://indiankanoon.org/doc/1305611/",
    rawText:
      "The question is whether a finance/loan liability on a commercial truck continues during " +
      "the pendency of an insurance dispute. The bank pressed the borrower for instalments while " +
      "the accident claim was repudiated. The Court observed that the loan agreement obligations " +
      "are independent of the insurance claim, but a wrongful repudiation causing loss may be " +
      "compensated. Motor Vehicles Act principles on third-party liability and the insurer's duty " +
      "to satisfy the award were reiterated. WWW.SOMECOURT.GOV.IN Page 3 of 9",
  },
  {
    source: "demo",
    sourceDocId: "3",
    caseName: "Lucknow Development Authority v. M.K. Gupta",
    citations: ["(1994) 1 SCC 243", "AIR 1994 SC 787"],
    court: "Supreme Court of India",
    sourceUrl: "https://indiankanoon.org/doc/513199/",
    rawText:
      "This case defines deficiency in service under consumer law and the liability of a statutory " +
      "authority for harassment of a citizen. Compensation may be awarded for mental agony caused " +
      "by deficiency in service. The Court held that where a public functionary acts arbitrarily " +
      "and causes harassment to a common citizen, the State is liable to compensate the citizen " +
      "and may recover the amount from the officers responsible. The remedy under the Consumer " +
      "Protection Act is in addition to, and not in derogation of, other remedies available to a " +
      "consumer.",
  },
];
