import { Helmet } from "react-helmet-async";

interface SEOEnhancedProps {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
  breadcrumb?: Array<{
    name: string;
    url?: string;
  }>;
  lastModified?: string;
  publishedTime?: string;
  author?: string;
  section?: string;
}

const SEOEnhanced = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "https://bermanelectrical.com/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
  ogType = "website",
  structuredData,
  alternates,
  breadcrumb,
  lastModified,
  publishedTime,
  author = "Berman Electric",
  section
}: SEOEnhancedProps) => {
  const breadcrumbSchema = breadcrumb ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumb.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": item.url })
    }))
  } : null;

  return (
    <Helmet>
      {/* Enhanced Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      
      {/* Robots and Indexing */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Performance and Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      
      {/* Open Graph Enhanced */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Berman Electric" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {lastModified && <meta property="article:modified_time" content={lastModified} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      
      {/* Twitter Card Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="US-NY" />
      <meta name="geo.placename" content="Long Island" />
      <meta name="geo.position" content="40.8134;-73.1123" />
      <meta name="ICBM" content="40.8134, -73.1123" />
      
      {/* Business Information */}
      <meta name="contact" content="Rob@bermanelectrical.com" />
      <meta name="phone" content="+1-516-361-4068" />
      
      {/* Alternate Language/Region Links */}
      {alternates?.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      
      {/* Mobile and Apple */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Additional Structured Data */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOEnhanced;
