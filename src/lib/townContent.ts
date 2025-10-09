import townsJson from "@/data/suffolkTowns.json";

export interface TownService {
  title: string;
  description: string;
  highlights: string[];
}

export interface TownFaq {
  question: string;
  answer: string;
}

export interface TownHowToStep {
  title: string;
  detail: string;
}

export interface TownHowTo {
  title: string;
  description: string;
  steps: TownHowToStep[];
  successNarrative: string;
}

export interface TownDirectionsStep {
  title: string;
  detail: string;
}

export interface TownDirections {
  summary: string;
  startingPoint: string;
  steps: TownDirectionsStep[];
}

export interface TownHero {
  heading: string;
  subheading: string;
  ctaLabel: string;
}

export interface TownMapInfo {
  query: string;
  description: string;
  note?: string;
}

export interface TownSeo {
  title: string;
  description: string;
}

export interface TownCoordinates {
  latitude: number;
  longitude: number;
}

export interface TownData {
  name: string;
  slug: string;
  seo: TownSeo;
  hero: TownHero;
  intro: string;
  serviceArea: string;
  map: TownMapInfo;
  coordinates: TownCoordinates;
  zipCodes: string[];
  neighborhoods: string[];
  landmarks: string[];
  serviceCatalog: string[];
  services: TownService[];
  faq: TownFaq[];
  howTo: TownHowTo;
  drivingDirections: TownDirections;
}

export const towns = townsJson as TownData[];

export const getTownBySlug = (slug: string | undefined) =>
  towns.find((town) => town.slug === slug);

export const buildTownPath = (slug: string) => `/locations/${slug}`;

export const getTownCanonicalUrl = (slug: string) =>
  `https://www.bermanelectric.com${buildTownPath(slug)}`;
