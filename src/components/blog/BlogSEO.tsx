import { Helmet } from 'react-helmet-async';

type StructuredData = Record<string, unknown> | Array<unknown>;

interface ArticleMetadata {
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  section: string;
  tags: string[];
}

interface BlogSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  article?: ArticleMetadata;
  structuredData?: StructuredData;
}

const BlogSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
  article,
  structuredData
}: BlogSEOProps) => {
  const fullTitle = title.includes('Berman Electric') ? title : `${title} | Berman Electric Blog`;
  const currentUrl = canonical || window.location.href;

  // Generate FAQ Schema if content has FAQ structure
  const generateFAQSchema = (): StructuredData | null => {
    if (
      !structuredData ||
      (!title.toLowerCase().includes('tips') && !title.toLowerCase().includes('guide'))
    ) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When should I upgrade my electrical panel?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Consider upgrading if your panel is over 25 years old, frequently trips breakers, or can't handle modern electrical demands."
          }
        },
        {
          "@type": "Question", 
          "name": "How much does electrical panel upgrade cost on Long Island?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Panel upgrades typically range from $1,500-$4,000 depending on amperage and complexity. Licensed work prevents costly repairs later."
          }
        }
      ]
    };
  };

  // Generate comprehensive Article Schema
  const generateArticleSchema = (): StructuredData => {
    const baseSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": {
        "@type": "ImageObject",
        "url": `https://bermanelectrical.com${ogImage}`,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": article?.author || "Rob Berman",
        "jobTitle": "Licensed Electrician",
        "worksFor": {
          "@type": "LocalBusiness",
          "name": "Berman Electric",
          "url": "https://bermanelectrical.com"
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "Berman Electric",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bermanelectrical.com/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png"
        }
      },
      "datePublished": article?.publishedTime,
      "dateModified": article?.modifiedTime || article?.publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      },
      "articleSection": article?.section,
      "keywords": article?.tags?.join(", "),
      "inLanguage": "en-US",
      "isPartOf": {
        "@type": "Website",
        "@id": "https://bermanelectrical.com"
      }
    };

    return baseSchema;
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={article?.author || "Rob Berman"} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://bermanelectrical.com${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Berman Electric" />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific Open Graph */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://bermanelectrical.com${ogImage}`} />
      <meta name="twitter:creator" content="@bermanelectric" />

      {/* Additional SEO Meta */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <link rel="alternate" type="application/rss+xml" title="Berman Electric Blog RSS" href="/blog/rss.xml" />

      {/* Article Schema */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify(generateArticleSchema())}
        </script>
      )}

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generateFAQSchema())}
      </script>

      {/* Additional Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://bermanelectrical.com"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "Blog",
              "item": "https://bermanelectrical.com/blog"
            },
            ...(article ? [{
              "@type": "ListItem",
              "position": 3,
              "name": title,
              "item": currentUrl
            }] : [])
          ]
        })}
      </script>
    </Helmet>
  );
};

export default BlogSEO;