export interface TrackingNumber {
  id: string;
  display: string;
  value: string; // tel with country code
  source?: string;
  medium?: string;
  campaign?: string;
  notes?: string;
  config: TrackingNumberConfig;
}

export interface TrackingNumberDefinition {
  id: string;
  display: string;
  value: string;
  source?: string;
  medium?: string;
  campaign?: string;
  notes?: string;
}

export interface TrackingNumberConfig {
  default: TrackingNumberDefinition;
  sources?: Record<string, TrackingNumberDefinition>;
  mediums?: Record<string, TrackingNumberDefinition>;
  campaigns?: Record<string, TrackingNumberDefinition>;
  pages?: Record<string, TrackingNumberDefinition>;
}

const DEFAULT_TRACKING_CONFIG: TrackingNumberConfig = {
  default: {
    id: "main-line",
    display: "(516) 361-4068",
    value: "+15163614068",
    notes: "Primary business line"
  },
  sources: {
    "google": {
      id: "google-organic",
      display: "(516) 361-4068",
      value: "+15163614068",
      notes: "Fallback to main line unless overridden via env"
    },
    "google_ads": {
      id: "google-ads",
      display: "(516) 531-4001",
      value: "+15165314001",
      notes: "Google Ads tracking number"
    },
    "facebook": {
      id: "facebook-ads",
      display: "(516) 886-4002",
      value: "+15168864002",
      notes: "Meta ads tracking number"
    }
  },
  pages: {
    "/emergency": {
      id: "emergency-page",
      display: "(516) 204-4003",
      value: "+15162044003",
      notes: "Emergency services landing page"
    }
  }
};

const getEnvTrackingConfig = (): TrackingNumberConfig | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = import.meta.env?.VITE_TRACKING_NUMBERS;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as TrackingNumberConfig;
    if (!parsed.default) {
      throw new Error("Tracking config must include a default number");
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse VITE_TRACKING_NUMBERS", error);
    return null;
  }
};

export const resolveTrackingNumber = (attribution?: Record<string, any>, stickyId?: string): TrackingNumber => {
  const config = getEnvTrackingConfig() || DEFAULT_TRACKING_CONFIG;
  const sources = config.sources || {};
  const mediums = config.mediums || {};
  const campaigns = config.campaigns || {};
  const pages = config.pages || {};

  const attributionSource = attribution?.utmSource?.toLowerCase();
  const attributionMedium = attribution?.utmMedium?.toLowerCase();
  const attributionCampaign = attribution?.utmCampaign?.toLowerCase();
  const landingPage = (attribution?.landingPage || attribution?.pageUrl || "").toLowerCase();

  const findMatch = (map: Record<string, TrackingNumberDefinition>, key?: string) => {
    if (!key) return undefined;
    return map[key] || map[key.replace(/\s+/g, "_")];
  };

  const directMatches: (TrackingNumberDefinition | undefined)[] = [
    findMatch(pages, landingPage),
    findMatch(campaigns, attributionCampaign),
    findMatch(mediums, attributionMedium),
    findMatch(sources, attributionSource),
  ];

  let chosen = directMatches.find(Boolean) || undefined;

  if (!chosen && stickyId) {
    const sticky = [config.default, ...Object.values(sources), ...Object.values(mediums), ...Object.values(campaigns), ...Object.values(pages)].find(
      (item) => item.id === stickyId
    );
    if (sticky) {
      chosen = sticky;
    }
  }

  if (!chosen) {
    chosen = config.default;
  }

  return {
    ...chosen,
    config,
  };
};
