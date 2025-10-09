import React from "react";
import { useAttribution } from "@/hooks/useAttribution";
import { cn } from "@/lib/utils";

interface BaseProps {
  className?: string;
  prefix?: string;
  suffix?: string;
}

interface RenderProps extends BaseProps {
  children?: React.ReactNode | ((display: string) => React.ReactNode);
}

export const DynamicPhoneText: React.FC<RenderProps> = ({ className, prefix, suffix, children }) => {
  const { trackingNumber } = useAttribution();
  const numberLabel = trackingNumber.display;
  const content = typeof children === "function" ? children(numberLabel) : children;

  if (content) {
    return <span className={className}>{content}</span>;
  }

  const segments = [prefix, numberLabel, suffix].filter(Boolean);
  return <span className={className}>{segments.join(" ")}</span>;
};

type LinkProps = RenderProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const DynamicPhoneLink: React.FC<LinkProps> = ({ className, prefix, suffix, children, ...anchorProps }) => {
  const { trackingNumber } = useAttribution();
  const label = typeof children === "function"
    ? children(trackingNumber.display)
    : children || [prefix, trackingNumber.display, suffix].filter(Boolean).join(" ");

  const { className: inheritedClassName, ...rest } = anchorProps;

  return (
    <a
      {...rest}
      href={`tel:${trackingNumber.value}`}
      className={cn(className, inheritedClassName)}
      data-tracking-number-id={trackingNumber.id}
    >
      {label}
    </a>
  );
};
