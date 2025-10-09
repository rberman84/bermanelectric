import { CANONICAL_HOST, SITE_URL } from "./siteConfig";

const TRACKING_PARAMS = [
  "gclid",
  "fbclid",
  "msclkid",
  "yclid",
  "_gl",
  "_ga",
  "_gid",
  "ref",
  "source",
];

const TRACKING_PREFIXES = ["utm_", "mc_"];

export const stripTrailingSlash = (pathname: string) => {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

export const ensureLeadingSlash = (pathname: string) => {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }
  return pathname;
};

export const toAbsoluteUrl = (pathname: string) => {
  const normalized = ensureLeadingSlash(stripTrailingSlash(pathname));
  return `${SITE_URL}${normalized}`;
};

export const canonicalizeUrl = (input: string) => {
  let candidate = input;
  try {
    const url = new URL(candidate, SITE_URL);
    url.protocol = "https:";
    const hostname = url.hostname.replace(/^www\./i, "");
    url.hostname = CANONICAL_HOST || hostname;

    const cleanedPath = url.pathname.replace(/\/{2,}/g, "/");
    url.pathname = ensureLeadingSlash(stripTrailingSlash(cleanedPath));

    const params = url.searchParams;
    for (const key of Array.from(params.keys())) {
      if (TRACKING_PARAMS.includes(key) || TRACKING_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        params.delete(key);
      }
    }

    url.search = params.size ? `?${params.toString()}` : "";

    url.hash = "";
    candidate = url.toString();
  } catch (error) {
    candidate = input;
  }
  return candidate;
};

export const isTrackingQueryPresent = (search: string) => {
  try {
    const params = new URLSearchParams(search);
    for (const key of params.keys()) {
      if (TRACKING_PARAMS.includes(key) || TRACKING_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        return true;
      }
    }
  } catch (error) {
    return false;
  }
  return false;
};
