// Intake taxonomy + path-specific checklists (L1). 3 full categories incl. the truck scenario.
export interface Subcategory {
  key: string;
  label: string;
  checklist: string[];
  suggestedDocTypes: string[];
  researchSeed: string;
}
export interface Category {
  key: string;
  label: string;
  subcategories: Subcategory[];
}

export const TAXONOMY: Category[] = [
  {
    key: "motor_vehicle",
    label: "Motor Vehicle",
    subcategories: [
      {
        key: "accident_claim_loan_dispute",
        label: "Accident Claim + Loan Dispute",
        checklist: [
          "FIR (First Information Report)",
          "Motor Vehicle Inspector (MVI) report",
          "Damage assessment / surveyor report",
          "Insurance policy document",
          "Insurer's claim rejection letter",
          "Vehicle loan agreement",
          "Registration Certificate (RC)",
          "Driving licence of the driver",
          "Repair estimates / invoices",
        ],
        suggestedDocTypes: ["legal_notice", "claim_petition"],
        researchSeed:
          "insurer wrongful repudiation of commercial vehicle accident claim; Motor Vehicles Act; deficiency in service; loan liability during dispute",
      },
    ],
  },
  {
    key: "consumer",
    label: "Consumer Dispute",
    subcategories: [
      {
        key: "deficiency_in_service",
        label: "Deficiency in Service",
        checklist: [
          "Purchase invoice / receipt",
          "Warranty or service agreement",
          "Correspondence with the service provider",
          "Proof of defect (photos / expert report)",
          "Payment proof",
        ],
        suggestedDocTypes: ["legal_notice", "demand_letter"],
        researchSeed:
          "deficiency in service under Consumer Protection Act; unfair trade practice; compensation to consumer",
      },
    ],
  },
  {
    key: "property",
    label: "Property / Tenancy",
    subcategories: [
      {
        key: "eviction_arrears",
        label: "Eviction & Rent Arrears",
        checklist: [
          "Registered rent/lease agreement",
          "Rent payment ledger / receipts",
          "Notice(s) already served on the tenant",
          "Ownership proof / title document",
          "Municipal tax receipts",
        ],
        suggestedDocTypes: ["legal_notice", "written_statement"],
        researchSeed:
          "eviction of tenant for arrears of rent; bona fide requirement; Rent Control Act; ejectment",
      },
    ],
  },
];

export function getChecklist(categoryKey: string, subKey: string): Subcategory | null {
  const cat = TAXONOMY.find((c) => c.key === categoryKey);
  return cat?.subcategories.find((s) => s.key === subKey) ?? null;
}
