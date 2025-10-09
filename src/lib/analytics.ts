import { supabase } from "@/integrations/supabase/client";

const CLIENT_ID_STORAGE_KEY = "be_ga4_client_id";
const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100];

let analyticsInitialized = false;
const completedScrollThresholds = new Set<number>();
const trackedFaqInteractions = new Set<string>();
const trackedAbAssignments = new Set<string>();

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export const getOrCreateClientId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const existing = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  if (!("crypto" in window) || typeof window.crypto.randomUUID !== "function") {
    return null;
  }

  const newId = window.crypto.randomUUID();
  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, newId);
  return newId;
};

export const sendAnalyticsEvent = async (
  name: string,
  params: AnalyticsEventParams = {},
  options?: { userId?: string; userProperties?: Record<string, string | number | boolean> },
) => {
  if (typeof window === "undefined") return;

  const clientId = getOrCreateClientId();
  if (!clientId) {
    console.warn("Analytics client ID unavailable; skipping event", name);
    return;
  }

  try {
    const body = {
      client_id: clientId,
      user_id: options?.userId,
      user_properties: options?.userProperties
        ? Object.fromEntries(
            Object.entries(options.userProperties).map(([key, value]) => [key, { value }]),
          )
        : undefined,
      events: [
        {
          name,
          params: {
            page_location: window.location.href,
            page_title: document.title,
            page_path: window.location.pathname,
            timestamp_msec: Date.now(),
            ...normalizeParams(params),
          },
        },
      ],
    };

    const { error } = await supabase.functions.invoke("analytics-events", { body });
    if (error) {
      console.error("Failed to send analytics event", name, error);
    }
  } catch (error) {
    console.error("Analytics transmission error", name, error);
  }
};

const normalizeParams = (params: AnalyticsEventParams) => {
  const sanitized: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value;
    } else {
      sanitized[key] = String(value);
    }
  }
  return sanitized;
};

const handleTelClick = (event: MouseEvent) => {
  const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='tel:']");
  if (!anchor) return;

  const phoneNumber = anchor.getAttribute("href")?.replace("tel:", "") ?? "unknown";
  const linkText = anchor.textContent?.trim() ?? "call";

  void sendAnalyticsEvent("call_click", {
    phone_number: phoneNumber,
    link_text: linkText,
    link_location: window.location.pathname,
  });
};

const handleFaqClick = (event: MouseEvent) => {
  const faqElement = (event.target as HTMLElement).closest<HTMLElement>("[data-analytics-faq]");
  if (!faqElement) return;

  const question = faqElement.getAttribute("data-analytics-faq") || faqElement.textContent?.trim() || "faq";
  const id = faqElement.getAttribute("data-analytics-faq-id") || question;
  const cacheKey = `${window.location.pathname}:${id}`;

  if (trackedFaqInteractions.has(cacheKey)) return;
  trackedFaqInteractions.add(cacheKey);

  void sendAnalyticsEvent("faq_interaction", {
    question,
    faq_id: id,
    page_path: window.location.pathname,
  });
};

const handleScroll = () => {
  if (typeof window === "undefined") return;

  const scrollElement = document.documentElement;
  const scrollTop = window.scrollY || scrollElement.scrollTop || 0;
  const scrollHeight = scrollElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return;

  const percentScrolled = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));

  SCROLL_THRESHOLDS.forEach((threshold) => {
    if (percentScrolled >= threshold && !completedScrollThresholds.has(threshold)) {
      completedScrollThresholds.add(threshold);
      void sendAnalyticsEvent("scroll_depth", {
        percent_scrolled: threshold,
        page_path: window.location.pathname,
      });
    }
  });
};

export const initializeAnalytics = () => {
  if (analyticsInitialized || typeof window === "undefined") {
    return;
  }

  analyticsInitialized = true;
  getOrCreateClientId();

  document.addEventListener("click", handleTelClick, { capture: true });
  document.addEventListener("click", handleFaqClick, { capture: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
};

export const resetScrollTracking = () => {
  completedScrollThresholds.clear();
  trackedFaqInteractions.clear();
};

export const trackAbAssignment = (testName: string, variantId: string) => {
  const key = `ab:${testName}:${variantId}`;
  if (trackedAbAssignments.has(key)) return;
  trackedAbAssignments.add(key);

  void sendAnalyticsEvent("ab_test_assignment", {
    test_name: testName,
    variant_id: variantId,
  });
};
