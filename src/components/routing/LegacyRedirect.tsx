import { useEffect } from "react";
import { canonicalizeUrl, toAbsoluteUrl } from "@/lib/url";

interface LegacyRedirectProps {
  to: string;
  permanent?: boolean;
}

const LegacyRedirect = ({ to, permanent = true }: LegacyRedirectProps) => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const targetUrl = to.startsWith("http") ? to : toAbsoluteUrl(to);
    const normalized = canonicalizeUrl(targetUrl);

    if (permanent) {
      window.location.replace(normalized);
    } else {
      window.location.assign(normalized);
    }
  }, [permanent, to]);

  return null;
};

export default LegacyRedirect;
