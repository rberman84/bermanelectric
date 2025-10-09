import { getExcerpt, markdownToHtml } from "./markdown";

export type ContentType = "blog" | "case-study";

export interface ContentHero {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
  };
  stats?: { label: string; value: string }[];
}

export interface ContentGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface BeforeAfterImage {
  src: string;
  alt: string;
  label?: string;
}

export interface BadgeItem {
  label: string;
  description?: string;
}

export interface TrustStripItem {
  logo: string;
  alt: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ServiceSchema {
  name: string;
  areaServed: string;
  serviceType: string;
  provider?: string;
  serviceOutput?: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  sku?: string;
  brand?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability?: string;
  };
}

export interface ContentFrontmatter {
  title: string;
  slug?: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  category: string;
  tags?: string[];
  type?: ContentType;
  featured?: boolean;
  hero?: ContentHero;
  gallery?: ContentGalleryImage[];
  beforeAfter?: {
    before: BeforeAfterImage;
    after: BeforeAfterImage;
  };
  badges?: BadgeItem[];
  trustStrip?: {
    headline: string;
    items: TrustStripItem[];
  };
  process?: {
    title: string;
    steps: ProcessStep[];
  };
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  speakable?: string[];
  service?: ServiceSchema;
  product?: ProductSchema;
  readingTime?: string;
  image?: string;
  cta?: {
    eyebrow?: string;
    title: string;
    description?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    phoneNumber?: string;
  };
}

export interface ContentEntry {
  slug: string;
  frontmatter: ContentFrontmatter;
  body: string;
  html: string;
  type: ContentType;
  url: string;
  readTime: string;
  excerpt: string;
}

type RawModule = string;

const modules = import.meta.glob("../content/**/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default"
}) as Record<string, RawModule>;

const parseFrontmatter = (raw: string) => {
  if (!raw.startsWith("---")) {
    throw new Error("MDX files must begin with a JSON frontmatter block wrapped in --- markers.");
  }

  const endIndex = raw.indexOf("---", 3);
  if (endIndex === -1) {
    throw new Error("Invalid frontmatter: missing closing --- marker.");
  }

  const frontmatterRaw = raw.slice(3, endIndex).trim();
  const body = raw.slice(endIndex + 3).trim();

  const frontmatter: ContentFrontmatter = JSON.parse(frontmatterRaw);
  return { frontmatter, body };
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const computeReadTime = (markdown: string) => {
  const words = markdown.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const entries: ContentEntry[] = Object.entries(modules).map(([path, raw]) => {
  const { frontmatter, body } = parseFrontmatter(raw);
  const slug = frontmatter.slug || toSlug(path.split("/").pop()?.replace(/\.mdx$/, "") || "");
  const type: ContentType = frontmatter.type || (path.includes("case-studies") ? "case-study" : "blog");
  const html = markdownToHtml(body.trim());
  const readTime = frontmatter.readingTime || computeReadTime(body);
  const excerpt = getExcerpt(html);
  const url = frontmatter.type === "case-study" || type === "case-study" ? `/case-studies/${slug}` : `/blog/${slug}`;

  return {
    slug,
    frontmatter: {
      ...frontmatter,
      slug
    },
    body,
    html,
    type,
    url,
    readTime,
    excerpt
  };
});

export const contentEntries = entries.sort((a, b) =>
  new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
);

export const getContentBySlug = (slug?: string) =>
  slug ? contentEntries.find((entry) => entry.slug === slug) : undefined;

export const getContentByCategory = (category: string) =>
  contentEntries.filter((entry) => entry.frontmatter.category.toLowerCase() === category.toLowerCase());

export const getCategories = () => {
  const base = new Set<string>();
  contentEntries.forEach((entry) => base.add(entry.frontmatter.category));
  return Array.from(base);
};

export const getCaseStudies = () => contentEntries.filter((entry) => entry.type === "case-study");

export const getBlogs = () => contentEntries.filter((entry) => entry.type === "blog");
