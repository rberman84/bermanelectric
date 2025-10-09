import { useEffect, useMemo, useState } from "react";
import { resolveTrackingNumber, TrackingNumber, TrackingNumberConfig } from "@/lib/trackingNumbers";

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  msclkid?: string;
  fbclid?: string;
  landingPage?: string;
  pageUrl?: string;
  referrer?: string;
  firstSeenAt?: string;
  lastSeenAt?: string;
  searchParams?: Record<string, string>;
}

interface StoredAttribution {
  attribution: AttributionData;
  trackingId?: string;
}

const STORAGE_KEY = "berman-electric:attribution";

const DEFAULT_ATTRIBUTION: AttributionData = {
  landingPage: typeof window !== "undefined" ? window.location.pathname : undefined,
  pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
};

const readStoredAttribution = (): StoredAttribution | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    return parsed;
  } catch (error) {
    console.error("Failed to parse stored attribution", error);
    return null;
  }
};

const writeStoredAttribution = (value: StoredAttribution) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to persist attribution", error);
  }
};

const collectAttribution = (): AttributionData => {
  if (typeof window === "undefined") {
    return DEFAULT_ATTRIBUTION;
  }

  const now = new Date().toISOString();
  const params = new URLSearchParams(window.location.search);
  const stored = readStoredAttribution();
  const base: AttributionData = stored?.attribution || { ...DEFAULT_ATTRIBUTION, firstSeenAt: now };

  const updates: AttributionData = {
    ...base,
    pageUrl: window.location.href,
    landingPage: base.landingPage || `${window.location.pathname}${window.location.search}`,
    lastSeenAt: now,
    referrer: document.referrer || base.referrer,
  };

  const searchParams: Record<string, string> = { ...(base.searchParams || {}) };

  params.forEach((value, key) => {
    searchParams[key] = value;
    const lowerKey = key.toLowerCase();
    switch (lowerKey) {
      case "utm_source":
        updates.utmSource = value;
        break;
      case "utm_medium":
        updates.utmMedium = value;
        break;
      case "utm_campaign":
        updates.utmCampaign = value;
        break;
      case "utm_term":
        updates.utmTerm = value;
        break;
      case "utm_content":
        updates.utmContent = value;
        break;
      case "gclid":
        updates.gclid = value;
        break;
      case "msclkid":
        updates.msclkid = value;
        break;
      case "fbclid":
        updates.fbclid = value;
        break;
      default:
        break;
    }
  });

  updates.searchParams = searchParams;

  const storedTrackingId = stored?.trackingId;
  const trackingNumber = resolveTrackingNumber(updates, storedTrackingId);
  writeStoredAttribution({ attribution: updates, trackingId: trackingNumber.id });

  return updates;
};

export interface UseAttributionResult {
  attribution: AttributionData;
  trackingNumber: TrackingNumber;
  config: TrackingNumberConfig;
}

export const useAttribution = (): UseAttributionResult => {
  const [attribution, setAttribution] = useState<AttributionData>(() => {
    const stored = readStoredAttribution();
    return stored?.attribution || DEFAULT_ATTRIBUTION;
  });

  const [trackingId, setTrackingId] = useState<string | undefined>(() => readStoredAttribution()?.trackingId);

  useEffect(() => {
    const collected = collectAttribution();
    setAttribution(collected);
    const nextTracking = resolveTrackingNumber(collected, trackingId);
    setTrackingId(nextTracking.id);
  }, []);

  const trackingNumber = useMemo(() => resolveTrackingNumber(attribution, trackingId), [attribution, trackingId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateDomPhoneNumbers = () => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'));
      anchors.forEach((anchor) => {
        const href = anchor.getAttribute("href") || "";
        const normalized = href.replace("tel:", "").replace(/[^0-9+]/g, "");
        if (!normalized) return;
        const defaultVariants = ["+15163614068", "15163614068", "5163614068"]; // existing numbers to replace
        if (defaultVariants.includes(normalized)) {
          anchor.setAttribute("href", `tel:${trackingNumber.value}`);
          if (!anchor.dataset.lockDynamicPhone) {
            anchor.textContent = trackingNumber.display;
          }
          anchor.dataset.trackingNumberId = trackingNumber.id;
        }
      });

      const phoneSpans = Array.from(document.querySelectorAll<HTMLElement>("[data-dynamic-phone-text]"));
      phoneSpans.forEach((node) => {
        node.textContent = trackingNumber.display;
        node.dataset.trackingNumberId = trackingNumber.id;
      });
    };

    updateDomPhoneNumbers();
  }, [trackingNumber]);

  const config = useMemo(() => trackingNumber.config, [trackingNumber]);

  return { attribution, trackingNumber, config };
};

export const useTrackingNumber = () => {
  const { trackingNumber } = useAttribution();
  return {
    ...trackingNumber,
    href: `tel:${trackingNumber.value}`,
  };
};
