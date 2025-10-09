import { ReactNode } from "react";
import { useTrackingNumber } from "@/hooks/useTrackingNumber";
import { sendAnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface DynamicPhoneProps {
  className?: string;
  asLink?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  children?: (info: { displayNumber: string; tel: string; trackingId: string }) => ReactNode;
  eventName?: string;
  ariaLabel?: string;
}

export function DynamicPhone({
  className,
  asLink = true,
  prefix,
  suffix,
  children,
  eventName = "phone_click",
  ariaLabel,
}: DynamicPhoneProps) {
  const { displayNumber, tel, trackingId, trackingSource, sessionId, sourcePage } = useTrackingNumber();

  const handleClick = () => {
    sendAnalyticsEvent(eventName, {
      tracking_id: trackingId,
      tracking_source: trackingSource,
      tel,
      session_id: sessionId,
      source_page: sourcePage,
    });
  };

  const baseContent = children ? (
    children({ displayNumber, tel, trackingId })
  ) : (
    <>
      {prefix}
      <span className="whitespace-nowrap">{displayNumber}</span>
      {suffix}
    </>
  );

  if (!asLink) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        {baseContent}
      </span>
    );
  }

  return (
    <a
      href={`tel:${tel}`}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 text-electric-600 font-semibold hover:text-electric-700 transition-colors",
        className,
      )}
      data-tracking-id={trackingId}
      aria-label={ariaLabel ?? `Call ${displayNumber}`}
    >
      {baseContent}
    </a>
  );
}
