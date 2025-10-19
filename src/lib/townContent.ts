import townsJson from "@/data/suffolkTowns.json";
import nassauTownsJson from "@/data/nassauTowns.json";

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

export interface CommonIssue {
  title: string;
  description: string;
  solution: string;
  prevalence: string;
}

export interface ElectricalCode {
  topic: string;
  requirement: string;
  details: string;
}

export interface CaseStudy {
  title: string;
  location: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
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
  commonIssues?: CommonIssue[];
  electricalCodes?: ElectricalCode[];
  caseStudies?: CaseStudy[];
  faq: TownFaq[];
  howTo: TownHowTo;
  drivingDirections: TownDirections;
}

export const towns = townsJson as TownData[];
export const nassauTowns = nassauTownsJson as TownData[];
export const allTowns = [...towns, ...nassauTowns];

export const getTownBySlug = (slug: string | undefined) =>
  allTowns.find((town) => town.slug === slug);

export const buildTownPath = (slug: string) => `/locations/${slug}`;

export const getTownCanonicalUrl = (slug: string) =>
  `https://www.bermanelectric.com${buildTownPath(slug)}`;
