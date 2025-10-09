export interface TrackingNumberDefinition {
  id: string;
  display: string;
  tel: string;
  source: string;
}

const DEFAULT_NUMBER: TrackingNumberDefinition = {
  id: "main",
  display: "(516) 361-4068",
  tel: "+15163614068",
  source: "default",
};

const UTM_NUMBERS: Record<string, TrackingNumberDefinition> = {
  google: {
    id: "google-ads",
    display: "(516) 217-1120",
    tel: "+15162171120",
    source: "utm-google",
  },
  facebook: {
    id: "facebook-paid",
    display: "(516) 217-1121",
    tel: "+15162171121",
    source: "utm-facebook",
  },
  bing: {
    id: "bing-ads",
    display: "(516) 217-1122",
    tel: "+15162171122",
    source: "utm-bing",
  },
};

const PATH_NUMBERS: Array<{ path: RegExp; number: TrackingNumberDefinition }> = [
  {
    path: /ev-charger/i,
    number: {
      id: "ev-charger",
      display: "(516) 217-1123",
      tel: "+15162171123",
      source: "path-ev-charger",
    },
  },
  {
    path: /emergency/i,
    number: {
      id: "emergency-service",
      display: "(516) 217-1124",
      tel: "+15162171124",
      source: "path-emergency",
    },
  },
  {
    path: /commercial/i,
    number: {
      id: "commercial",
      display: "(516) 217-1125",
      tel: "+15162171125",
      source: "path-commercial",
    },
  },
];

export interface TrackingResolutionInput {
  pathname?: string;
  utmSource?: string | null;
}

export interface TrackingSession {
  id: string;
  expiresAt: number;
  number: TrackingNumberDefinition;
  utmSource?: string | null;
  pathname?: string;
}

const SESSION_STORAGE_KEY = "berman:tracking";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function resolveTrackingNumber({ pathname = "", utmSource }: TrackingResolutionInput): TrackingNumberDefinition {
  if (utmSource) {
    const match = UTM_NUMBERS[utmSource.toLowerCase()];
    if (match) {
      return match;
    }
  }

  const pathMatch = PATH_NUMBERS.find((entry) => entry.path.test(pathname));
  if (pathMatch) {
    return pathMatch.number;
  }

  return DEFAULT_NUMBER;
}

export function loadTrackingSession(): TrackingSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TrackingSession;
    if (parsed.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn("Failed to parse tracking session", error);
    return null;
  }
}

export function persistTrackingSession(session: TrackingSession) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn("Failed to persist tracking session", error);
  }
}

export function createTrackingSession(number: TrackingNumberDefinition, utmSource?: string | null, pathname?: string): TrackingSession {
  return {
    id: crypto.randomUUID(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    number,
    utmSource: utmSource ?? undefined,
    pathname,
  };
}

export function touchTrackingSession(session: TrackingSession): TrackingSession {
  const next = { ...session, expiresAt: Date.now() + SESSION_DURATION_MS };
  persistTrackingSession(next);
  return next;
}

export function getDefaultTrackingNumber() {
  return DEFAULT_NUMBER;
}
