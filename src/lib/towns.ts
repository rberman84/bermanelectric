import townsData from "../../data/towns.json";

export interface TownJobReview {
  rating: number;
  quote: string;
  firstName: string;
  service: string;
}

export interface TownJob {
  id: string;
  date: string;
  serviceType: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photo: string;
  review: TownJobReview;
}

export interface TownLandmark {
  name: string;
  description: string;
}

export interface TownPhoto {
  src: string;
  alt: string;
}

export interface TownDirections {
  fromHq: string;
  distanceMiles: number;
  travelTimeMinutes: number;
}

export interface TownSEO {
  title: string;
  description: string;
  canonical: string;
}

export interface TownData {
  name: string;
  slug: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  zipCodes: string[];
  center: {
    lat: number;
    lng: number;
  };
  landmarks: TownLandmark[];
  drivingDirections: TownDirections;
  localPhotos: TownPhoto[];
  serviceHighlights: string[];
  internalLinks: { label: string; to: string }[];
  jobs: TownJob[];
  seo: TownSEO;
}

const towns = townsData as TownData[];

export const getTownBySlug = (slug: string) =>
  towns.find((town) => town.slug === slug);

export const townRoutes = towns.map((town) => ({
  path: `/electrician-${town.slug}`,
  slug: town.slug,
}));

export default towns;
