import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";
import NotFound from "@/pages/NotFound";
import { caseStudies, getCaseStudyBySlug, getCanonicalUrl, type CaseStudyFrontmatter } from "@/lib/caseStudies";
import { useFaqSuggestions } from "@/hooks/useFaqSuggestions";

const fallbackFaqAnswer =
  "Need a personalised answer? Call Berman Electric at 516-361-4068 or schedule a visit at bermanelectrical.com/contact.";

const buildHowToSchema = (frontmatter: CaseStudyFrontmatter & { slug: string }, canonicalUrl: string) => {
  const supplies = frontmatter.materials.map((material) => ({
    "@type": "HowToSupply",
    name: material.spec ? `${material.name} — ${material.spec}` : material.name,
  }));

  const steps = frontmatter.scope.map((item, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: item.title,
    itemListElement: item.items.map((detail) => ({
      "@type": "HowToDirection",
      text: detail,
    })),
  }));

  return {
    "@type": "HowTo",
    name: frontmatter.title,
    description: frontmatter.summary ?? `How we delivered ${frontmatter.title.toLowerCase()} in ${frontmatter.town}.`,
    image: frontmatter.after[0]?.src ? `https://bermanelectrical.com${frontmatter.after[0].src}` : undefined,
    supply: supplies,
    totalTime: frontmatter.labor.duration,
    step: steps,
    publisher: {
      "@type": "Organization",
      name: "Berman Electric",
      url: "https://bermanelectrical.com",
    },
    mainEntityOfPage: canonicalUrl,
  };
};

const buildProductSchema = (frontmatter: CaseStudyFrontmatter & { slug: string }, canonicalUrl: string) => ({
  "@type": "Product",
  name: `${frontmatter.title} — ${frontmatter.town}`,
  image: frontmatter.after[0]?.src ? `https://bermanelectrical.com${frontmatter.after[0].src}` : undefined,
  description:
    frontmatter.summary ??
    `${frontmatter.title} project completed by Berman Electric serving ${frontmatter.town}.`,
  brand: {
    "@type": "Organization",
    name: "Berman Electric",
    url: "https://bermanelectrical.com",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    url: canonicalUrl,
    availability: "https://schema.org/InStock",
    price: "0",
  },
});

const buildFaqSchema = (faqs: { question: string; answer?: string }[]) => {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer && faq.answer.trim().length > 0 ? faq.answer : fallbackFaqAnswer,
      },
    })),
  };
};

type CaseStudyPageProps = {
  presetSlug?: string;
};

const CaseStudyPage = ({ presetSlug }: CaseStudyPageProps) => {
  const params = useParams();
  const slugFromRoute = params.slug ?? presetSlug;
  const study = getCaseStudyBySlug(slugFromRoute);

  if (!study) {
    return <NotFound />;
  }

  const canonicalUrl = getCanonicalUrl(study.slug);
  const { suggestions, loading, error } = useFaqSuggestions(canonicalUrl, study.frontmatter.faq ?? []);

  const structuredData = useMemo(() => {
    const graph: Record<string, unknown>[] = [];

    graph.push(buildHowToSchema(study.frontmatter, canonicalUrl));
    graph.push(buildProductSchema(study.frontmatter, canonicalUrl));

    const faqSchema = buildFaqSchema(suggestions.length > 0 ? suggestions : study.frontmatter.faq ?? []);
    if (faqSchema) {
      graph.push(faqSchema);
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }, [study.frontmatter, canonicalUrl, suggestions]);

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO
        title={`${study.frontmatter.title} - ${study.frontmatter.town}`}
        description={
          study.frontmatter.summary ??
          `Inside look at ${study.frontmatter.title.toLowerCase()} completed by Berman Electric in ${study.frontmatter.town}.`
        }
        keywords={study.frontmatter.tags?.join(", ")}
        canonical={canonicalUrl}
        ogImage={study.frontmatter.heroImage ?? study.frontmatter.after[0]?.src}
        article={{
          publishedTime: study.frontmatter.publishDate ?? "",
          modifiedTime: study.frontmatter.updatedDate ?? study.frontmatter.publishDate ?? "",
          author: "Berman Electric",
          section: "Case Studies",
          tags: study.frontmatter.tags ?? [],
        }}
        structuredData={structuredData}
      />
      <Navbar />
      <main className="container mx-auto max-w-5xl space-y-12 py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/case-studies" className="hover:text-primary">
                Case Studies
              </a>
            </li>
            <li>/</li>
            <li className="text-foreground">{study.frontmatter.title}</li>
          </ol>
        </nav>

        <CaseStudyLayout
          frontmatter={study.frontmatter}
          markdown={study.body}
          faqSuggestions={suggestions}
          faqLoading={loading}
          faqError={error}
        />
      </main>
      <Footer />
    </div>
  );
};

export const caseStudySlugs = caseStudies.map((study) => study.slug);

export default CaseStudyPage;
