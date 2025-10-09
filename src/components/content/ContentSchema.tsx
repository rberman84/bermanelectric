import { Helmet } from "react-helmet-async";
import type { ContentEntry } from "@/lib/content";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface ContentSchemaProps {
  entry: ContentEntry;
}

const buildBreadcrumbSchema = (entry: ContentEntry, canonical: string) => {
  const breadcrumbs = entry.frontmatter.breadcrumbs || [
    { name: "Home", url: "https://bermanelectrical.com" },
    entry.type === "case-study"
      ? { name: "Case Studies", url: "https://bermanelectrical.com/case-studies" }
      : { name: "Blog", url: "https://bermanelectrical.com/blog" },
    { name: entry.frontmatter.title, url: canonical }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
};

const buildArticleSchema = (entry: ContentEntry, canonical: string) => ({
  "@context": "https://schema.org",
  "@type": entry.type === "case-study" ? "NewsArticle" : "BlogPosting",
  headline: entry.frontmatter.title,
  description: entry.frontmatter.description,
  datePublished: entry.frontmatter.date,
  dateModified: entry.frontmatter.updated || entry.frontmatter.date,
  url: canonical,
  author: {
    "@type": "Person",
    name: entry.frontmatter.author || "Rob Berman"
  },
  publisher: {
    "@type": "Organization",
    name: "Berman Electric",
    logo: {
      "@type": "ImageObject",
      url: "https://bermanelectrical.com/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png"
    }
  },
  image: entry.frontmatter.image
    ? `https://bermanelectrical.com${entry.frontmatter.image}`
    : "https://bermanelectrical.com/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
  articleSection: entry.frontmatter.category,
  keywords: entry.frontmatter.tags?.join(", ") || "",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonical
  }
});

const buildFAQSchema = (entry: ContentEntry) =>
  entry.frontmatter.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entry.frontmatter.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    : undefined;

const buildServiceSchema = (entry: ContentEntry, canonical: string) =>
  entry.frontmatter.service
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: entry.frontmatter.service.name,
        serviceType: entry.frontmatter.service.serviceType,
        provider: {
          "@type": "LocalBusiness",
          name: entry.frontmatter.service.provider || "Berman Electric",
          url: "https://bermanelectrical.com"
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: entry.frontmatter.service.areaServed
        },
        serviceOutput: entry.frontmatter.service.serviceOutput,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: canonical
        }
      }
    : undefined;

const buildProductSchema = (entry: ContentEntry) =>
  entry.frontmatter.product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: entry.frontmatter.product.name,
        description: entry.frontmatter.product.description,
        sku: entry.frontmatter.product.sku,
        brand: {
          "@type": "Brand",
          name: entry.frontmatter.product.brand || "Berman Electric"
        },
        offers: entry.frontmatter.product.offers && {
          "@type": "Offer",
          price: entry.frontmatter.product.offers.price,
          priceCurrency: entry.frontmatter.product.offers.priceCurrency,
          availability:
            entry.frontmatter.product.offers.availability || "https://schema.org/InStock"
        }
      }
    : undefined;

const buildSpeakableSchema = (entry: ContentEntry, canonical: string) => {
  const speakableIds = entry.frontmatter.speakable?.length
    ? entry.frontmatter.speakable
    : entry.frontmatter.faqs?.slice(0, 2).map((faq) => `faq-answer-${slugify(faq.question)}`) || [];

  if (!speakableIds.length) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: canonical,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableIds.map((id) => `#${id}`)
    }
  };
};

const ContentSchema = ({ entry }: ContentSchemaProps) => {
  const canonical = `https://bermanelectrical.com${entry.url}`;
  const breadcrumbSchema = buildBreadcrumbSchema(entry, canonical);
  const articleSchema = buildArticleSchema(entry, canonical);
  const faqSchema = buildFAQSchema(entry);
  const serviceSchema = buildServiceSchema(entry, canonical);
  const productSchema = buildProductSchema(entry);
  const speakableSchema = buildSpeakableSchema(entry, canonical);

  return (
    <Helmet>
      <title>{`${entry.frontmatter.title} | Berman Electric`}</title>
      <meta name="description" content={entry.frontmatter.description} />
      <meta property="og:title" content={`${entry.frontmatter.title} | Berman Electric`} />
      <meta property="og:description" content={entry.frontmatter.description} />
      {entry.frontmatter.image && (
        <meta property="og:image" content={`https://bermanelectrical.com${entry.frontmatter.image}`} />
      )}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonical} />
      <link rel="canonical" href={canonical} />

      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      {serviceSchema && <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>}
      {productSchema && <script type="application/ld+json">{JSON.stringify(productSchema)}</script>}
      {speakableSchema && <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>}
    </Helmet>
  );
};

export default ContentSchema;
