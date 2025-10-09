import siteConfig from "./site-config.json";

interface SitemapEntry {
  path: string;
  changefreq: string;
  priority: number;
}

interface SiteConfigShape {
  siteUrl: string;
  canonicalHost: string;
  pages: SitemapEntry[];
  locations: SitemapEntry[];
  legacyRedirects: Record<string, string>;
}

const typedConfig = siteConfig as SiteConfigShape;

export const SITE_URL = typedConfig.siteUrl;
export const CANONICAL_HOST = typedConfig.canonicalHost;
export const STATIC_PAGES = typedConfig.pages;
export const LOCATION_PAGES = typedConfig.locations;
export const LEGACY_REDIRECTS = typedConfig.legacyRedirects;

export type StaticPageEntry = (typeof STATIC_PAGES)[number];
export type LocationPageEntry = (typeof LOCATION_PAGES)[number];
