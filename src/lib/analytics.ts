export type AnalyticsEvent = Record<string, unknown> & { event?: string };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function sendAnalyticsEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

export function getOrCreateSessionId(storageKey = "berman:session") {
  if (typeof window === "undefined") return "server";

  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) {
      return existing;
    }

    const newId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, newId);
    return newId;
  } catch (error) {
    console.warn("Failed to access sessionStorage", error);
    return crypto.randomUUID();
  }
}
