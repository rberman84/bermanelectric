import { z } from "zod";

const frontMatterPattern = /^---\s*([\s\S]*?)\s*---\s*/;

const scopeItemSchema = z
  .union([
    z.string().transform((value) => ({ title: value, items: [] as string[] })),
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      items: z.array(z.string()).optional(),
    }),
  ])
  .transform((value) => ({
    title: value.title,
    summary: value.summary,
    items: value.items ?? [],
  }));

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const materialSchema = z.object({
  name: z.string(),
  spec: z.string().optional(),
  quantity: z.string().optional(),
  url: z.string().url().optional(),
  brand: z.string().optional(),
});

const laborSchema = z.object({
  summary: z.string(),
  crewSize: z.number().optional(),
  totalHours: z.number().optional(),
  duration: z.string().optional(),
  tasks: z.array(z.string()).default([]),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string().optional(),
});

const caseStudyFrontmatterSchema = z.object({
  title: z.string(),
  town: z.string(),
  slug: z.string().optional(),
  publishDate: z.string().optional(),
  updatedDate: z.string().optional(),
  summary: z.string().optional(),
  heroImage: z.string().optional(),
  scope: z.array(scopeItemSchema),
  materials: z.array(materialSchema),
  labor: laborSchema,
  before: z.array(imageSchema).min(1),
  after: z.array(imageSchema).min(1),
  quote: z.object({
    text: z.string(),
    author: z.string().optional(),
    role: z.string().optional(),
  }),
  outcome: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  gallery: z.array(imageSchema).optional(),
  faq: z.array(faqSchema).optional(),
});

export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;

export type CaseStudy = {
  slug: string;
  frontmatter: CaseStudyFrontmatter & { slug: string };
  body: string;
  sourcePath: string;
};

const modules = import.meta.glob("../content/case-studies/*.mdx", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const CASE_STUDY_ROUTE_PREFIX = "/case-studies";

function parseFrontmatter(raw: string, sourcePath: string) {
  const match = raw.match(frontMatterPattern);

  if (!match) {
    throw new Error(`Missing front matter in case study: ${sourcePath}`);
  }

  const [, frontMatterRaw] = match;
  const body = raw.slice(match[0].length).trim();
  const trimmed = frontMatterRaw.trim();

  if (!trimmed.startsWith("{")) {
    throw new Error(
      `Front matter for ${sourcePath} must be provided as JSON between the --- delimiters.`,
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    throw new Error(`Failed to parse front matter JSON for ${sourcePath}: ${(error as Error).message}`);
  }

  const data = caseStudyFrontmatterSchema.parse(parsed);

  const pathSegments = sourcePath.split("/");
  const fileName = pathSegments[pathSegments.length - 1] ?? "";
  const derivedSlug = fileName.replace(/\.mdx$/, "");

  const slug = data.slug ?? derivedSlug;

  return {
    frontmatter: { ...data, slug },
    body,
  };
}

function normalisePath(filePath: string) {
  return filePath.replace(/^\.\//, "");
}

const loadedCaseStudies: CaseStudy[] = Object.entries(modules).map(([path, raw]) => {
  const sourcePath = normalisePath(path.replace(/^\.\./, "src"));
  const { frontmatter, body } = parseFrontmatter(raw, sourcePath);

  return {
    slug: frontmatter.slug,
    frontmatter,
    body,
    sourcePath,
  };
});

export const caseStudies: CaseStudy[] = loadedCaseStudies.sort((a, b) => {
  const dateA = a.frontmatter.publishDate ?? "";
  const dateB = b.frontmatter.publishDate ?? "";

  if (dateA === dateB) {
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  }

  return dateA > dateB ? -1 : 1;
});

export function getCaseStudyBySlug(slug?: string) {
  if (!slug) return undefined;
  return caseStudies.find((study) => study.slug === slug);
}

export function getCaseStudyUrl(slug: string) {
  return `${CASE_STUDY_ROUTE_PREFIX}/${slug}`;
}

export function getCanonicalUrl(slug: string) {
  return `https://bermanelectrical.com${getCaseStudyUrl(slug)}`;
}
