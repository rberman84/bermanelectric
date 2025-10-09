import { useEffect } from "react";
import { canonicalizeUrl } from "@/lib/url";

export const CanonicalGuard = () => {
  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    const currentUrl = window.location.href;
    const normalized = canonicalizeUrl(currentUrl);

    if (normalized !== currentUrl) {
      window.location.replace(normalized);
    }
  }, []);

  return null;
};

export default CanonicalGuard;
