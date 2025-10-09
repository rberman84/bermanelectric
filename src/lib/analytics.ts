export type AnalyticsPayload = Record<string, unknown>;

const pushDataLayer = (event: string, payload?: AnalyticsPayload) => {
  try {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event, ...payload });
    }
  } catch (error) {
    console.warn("Analytics push failed", error);
  }
};

const trackHotjarEvent = (event: string) => {
  if (typeof window === "undefined") return;
  const hj = (window as any).hj;
  if (typeof hj === "function") {
    hj("event", event);
  }
};

const trackClarityEvent = (event: string, payload?: AnalyticsPayload) => {
  if (typeof window === "undefined") return;
  const clarity = (window as any).clarity;
  if (typeof clarity === "function") {
    clarity("set", event, payload ?? true);
  }
};

const trackHeapEvent = (event: string, payload?: AnalyticsPayload) => {
  if (typeof window === "undefined") return;
  const heap = (window as any).heap;
  if (heap && typeof heap.track === "function") {
    heap.track(event, payload ?? {});
  }
};

export const trackEvent = (event: string, payload?: AnalyticsPayload) => {
  pushDataLayer(event, payload);
  trackHotjarEvent(event);
  trackClarityEvent(event, payload);
  trackHeapEvent(event, payload);
};

export const trackHeatmapFriction = (frictionPoint: string, payload?: AnalyticsPayload) => {
  const event = `conversion_friction_${frictionPoint}`;
  trackEvent(event, payload);
};

export const trackConversionStep = (step: number, payload?: AnalyticsPayload) => {
  trackEvent("conversion_step", { step, ...payload });
};

export const trackConversionComplete = (payload?: AnalyticsPayload) => {
  trackEvent("conversion_complete", payload);
};
