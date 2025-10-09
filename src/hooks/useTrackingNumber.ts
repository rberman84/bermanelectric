import { useTrackingContext } from "@/context/TrackingContext";

export function useTrackingNumber() {
  const context = useTrackingContext();
  return {
    displayNumber: context.trackingNumber.display,
    tel: context.trackingNumber.tel,
    trackingId: context.trackingNumber.id,
    trackingSource: context.trackingNumber.source,
    sessionId: context.sessionId,
    utmSource: context.utmSource,
    utmMedium: context.utmMedium,
    utmCampaign: context.utmCampaign,
    sourcePage: context.sourcePage,
  };
}
