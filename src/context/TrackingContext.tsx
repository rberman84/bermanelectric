import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  TrackingNumberDefinition,
  TrackingSession,
  createTrackingSession,
  getDefaultTrackingNumber,
  loadTrackingSession,
  persistTrackingSession,
  resolveTrackingNumber,
  touchTrackingSession,
} from "@/lib/tracking";
import { getOrCreateSessionId, sendAnalyticsEvent } from "@/lib/analytics";

type TrackingContextValue = {
  trackingNumber: TrackingNumberDefinition;
  sessionId: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  sourcePage: string;
};

const defaultValue: TrackingContextValue = {
  trackingNumber: getDefaultTrackingNumber(),
  sessionId: "server",
  sourcePage: "/",
};

const TrackingContext = createContext<TrackingContextValue>(defaultValue);

function buildState({
  session,
  utmSource,
  utmMedium,
  utmCampaign,
  sourcePage,
}: {
  session: TrackingSession;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  sourcePage: string;
}): TrackingContextValue {
  return {
    trackingNumber: session.number,
    sessionId: session.id,
    utmSource,
    utmMedium,
    utmCampaign,
    sourcePage,
  };
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [value, setValue] = useState<TrackingContextValue>(() => defaultValue);
  const baseSessionId = useMemo(() => getOrCreateSessionId("berman:tracking-session"), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const search = new URLSearchParams(location.search);
    const utmSource = search.get("utm_source");
    const utmMedium = search.get("utm_medium");
    const utmCampaign = search.get("utm_campaign");

    const existing = loadTrackingSession();
    const resolvedNumber = resolveTrackingNumber({
      pathname: location.pathname,
      utmSource: utmSource ?? undefined,
    });

    let session: TrackingSession;
    let shouldFireEvent = false;

    if (existing) {
      const numberToUse = existing.number ?? resolvedNumber;
      const sessionNeedsUpdate = existing.number.id !== numberToUse.id;
      session = sessionNeedsUpdate
        ? { ...createTrackingSession(numberToUse, utmSource, location.pathname), id: existing.id }
        : touchTrackingSession({
            ...existing,
            utmSource: existing.utmSource ?? utmSource ?? undefined,
            pathname: location.pathname,
          });

      if (sessionNeedsUpdate) {
        shouldFireEvent = true;
      }
    } else {
      session = createTrackingSession(resolvedNumber, utmSource, location.pathname);
      shouldFireEvent = true;
    }

    persistTrackingSession(session);

    const replacePhoneNumberInstances = (display: string, telValue: string) => {
      try {
        const normalizedTel = telValue.startsWith("+") ? telValue : `+${telValue.replace(/[^0-9]/g, "")}`;
        const telHref = `tel:${normalizedTel}`;

        document.querySelectorAll<HTMLAnchorElement>('a[href*="5163614068"]').forEach((anchor) => {
          anchor.href = telHref;
        });

        const patterns = [
          /\(\s*516\s*\)\s*361-4068/g,
          /516-361-4068/g,
          /516\s*361\s*4068/g,
        ];

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const replacements: Text[] = [];
        let currentNode = walker.nextNode();
        while (currentNode) {
          const textNode = currentNode as Text;
          const original = textNode.nodeValue;
          if (original) {
            let updated = original;
            patterns.forEach((pattern) => {
              updated = updated.replace(pattern, display);
            });
            if (updated !== original) {
              textNode.nodeValue = updated;
              replacements.push(textNode);
            }
          }
          currentNode = walker.nextNode();
        }

        document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((anchor) => {
          if (anchor.textContent && patterns.some((pattern) => pattern.test(anchor.textContent!))) {
            anchor.textContent = display;
          }
          if (anchor.href.includes("5163614068")) {
            anchor.href = telHref;
          }
        });
      } catch (error) {
        console.warn("Failed to replace phone number instances", error);
      }
    };

    setValue(
      buildState({
        session: session,
        utmSource: utmSource ?? undefined,
        utmMedium: utmMedium ?? undefined,
        utmCampaign: utmCampaign ?? undefined,
        sourcePage: location.pathname,
      }),
    );

    replacePhoneNumberInstances(session.number.display, session.number.tel);

    if (shouldFireEvent) {
      sendAnalyticsEvent("tracking_number_assigned", {
        tracking_id: session.number.id,
        tracking_tel: session.number.tel,
        session_id: session.id,
        base_session: baseSessionId,
        source_page: location.pathname,
        utm_source: utmSource ?? undefined,
      });
    } else {
      sendAnalyticsEvent("tracking_session_refreshed", {
        tracking_id: session.number.id,
        session_id: session.id,
        base_session: baseSessionId,
        source_page: location.pathname,
      });
    }
  }, [location, baseSessionId]);

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTrackingContext() {
  return useContext(TrackingContext);
}
