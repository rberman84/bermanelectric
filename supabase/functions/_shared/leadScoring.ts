export type LeadIntent = "book" | "estimate" | "contact";

export interface LeadDetails {
  zip?: string;
  queryIntent: LeadIntent;
  serviceCategory?: string;
  budgetRange?: string;
  notes?: string;
}

export interface LeadScoreResult {
  score: number;
  tier: "A" | "B";
  route: "phone_sms" | "email_drip";
  breakdown: {
    base: number;
    zipIncome: number;
    intent: number;
    jobSize: number;
    zipFound: boolean;
  };
}

const ZIP_MEDIAN_INCOME: Record<string, number> = {
  "11779": 113500,
  "11738": 92800,
  "11741": 104200,
  "11784": 98000,
  "11755": 126400,
  "11742": 110900,
  "11720": 120300,
  "11749": 134800,
  "11769": 97500,
  "11790": 148200,
  "11787": 118400,
  "11776": 101900,
  "11727": 93800,
  "11725": 108600,
};

const HIGH_VALUE_KEYWORDS = [
  "panel",
  "service upgrade",
  "generator",
  "ev",
  "tesla",
  "remodel",
  "renovation",
  "commercial",
  "new construction",
  "addition",
  "rewire",
  "pool",
  "spa",
];

const MID_VALUE_KEYWORDS = [
  "lighting",
  "outlet",
  "switch",
  "landscape",
  "ceiling fan",
  "diagnostic",
  "troubleshoot",
  "inspection",
];

function normalizeBudgetRange(budgetRange?: string): number {
  if (!budgetRange) return 0;
  const clean = budgetRange.toLowerCase();
  if (clean.includes("$")) {
    const match = clean.replace(/[,\s]/g, "").match(/\$?(\d{2,})(?:\+(?:\d{2,})?)?/);
    if (match) {
      const value = parseInt(match[1], 10);
      if (value >= 15000) return 25;
      if (value >= 8000) return 18;
      if (value >= 3000) return 12;
      if (value >= 1000) return 8;
      return 4;
    }
  }

  if (clean.includes("high") || clean.includes("major")) return 20;
  if (clean.includes("medium")) return 10;
  if (clean.includes("small")) return 5;

  return 0;
}

function scoreJobSize(serviceCategory?: string, notes?: string, budgetRange?: string): number {
  let score = 0;
  const text = `${serviceCategory || ""} ${notes || ""}`.toLowerCase();

  if (HIGH_VALUE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    score += 22;
  } else if (MID_VALUE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    score += 14;
  } else if (text.trim()) {
    score += 8;
  }

  score += normalizeBudgetRange(budgetRange);
  return Math.min(30, score);
}

function scoreZipIncome(zip?: string): { score: number; found: boolean } {
  if (!zip) return { score: 12, found: false };
  const income = ZIP_MEDIAN_INCOME[zip];
  if (!income) return { score: 14, found: false };

  if (income >= 150000) return { score: 28, found: true };
  if (income >= 125000) return { score: 24, found: true };
  if (income >= 105000) return { score: 20, found: true };
  if (income >= 90000) return { score: 16, found: true };
  return { score: 12, found: true };
}

function scoreIntent(intent: LeadIntent): number {
  switch (intent) {
    case "book":
      return 28;
    case "estimate":
      return 20;
    default:
      return 16;
  }
}

export function scoreLead(details: LeadDetails): LeadScoreResult {
  const base = 20;
  const zipIncome = scoreZipIncome(details.zip);
  const intentScore = scoreIntent(details.queryIntent);
  const jobSize = scoreJobSize(details.serviceCategory, details.notes, details.budgetRange);

  const total = Math.min(100, base + zipIncome.score + intentScore + jobSize);
  const tier = total >= 75 ? "A" : "B";
  const route = tier === "A" ? "phone_sms" : "email_drip";

  return {
    score: Math.round(total),
    tier,
    route,
    breakdown: {
      base,
      zipIncome: zipIncome.score,
      intent: intentScore,
      jobSize,
      zipFound: zipIncome.found,
    },
  };
}

export function extractZip(address?: string): string | undefined {
  if (!address) return undefined;
  const match = address.match(/(\d{5})(?:-\d{4})?$/);
  return match ? match[1] : undefined;
}
