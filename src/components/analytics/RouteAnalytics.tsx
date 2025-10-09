import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetScrollTracking, sendAnalyticsEvent } from "@/lib/analytics";

export const RouteAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    resetScrollTracking();
    void sendAnalyticsEvent("page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
};
