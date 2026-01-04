import { Helmet } from 'react-helmet-async';
import OrganizationSchema from '@/components/schema/OrganizationSchema';
import ServiceAreaGeoSchema from '@/components/schema/ServiceAreaGeoSchema';
import SitelinksSearchBoxSchema from '@/components/schema/SitelinksSearchBoxSchema';
import PerformanceResourceHints from './PerformanceResourceHints';
import CriticalCSSInliner from './CriticalCSSInliner';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface AdvancedSEOProps {
  // Core SEO
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  
  // Open Graph
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'local_business';
  ogLocale?: string;
  
  // Article specific
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  
  // Local Business
  isLocalBusiness?: boolean;
  
  // Navigation
  breadcrumbs?: BreadcrumbItem[];
  
  // Technical SEO
  noIndex?: boolean;
  noFollow?: boolean;
  
  // Performance
  enableResourceHints?: boolean;
  prerenderRoutes?: string[];
  
  // Structured data
  structuredData?: Record<string, unknown> | Array<unknown>;
  
  // Additional meta
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
}

/**
 * AdvancedSEO - Comprehensive SEO wrapper with all optimizations
 * Implements schema markup, resource hints, and enhanced meta tags
 */
const AdvancedSEO = ({
  title,
  description,
  keywords = "electrician, electrical services, Long Island, Suffolk County, Nassau County, Ronkonkoma, licensed electrician",
  canonical,
  ogImage = "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
  ogType = "website",
  ogLocale = "en_US",
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleSection,
  isLocalBusiness = true,
  breadcrumbs,
  noIndex = false,
  noFollow = false,
  enableResourceHints = true,
  prerenderRoutes,
  structuredData,
  geoRegion = "US-NY",
  geoPlacename = "Long Island",
  geoPosition = "40.8134;-73.1123"
}: AdvancedSEOProps) => {
  const baseUrl = "https://bermanelectrical.com";
  const fullTitle = title.includes('Berman Electric') ? title : `${title} | Berman Electric`;
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  
  // Build robots directive
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1'
  ].join(', ');

  // Generate breadcrumb schema
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      ...breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
      }))
    ]
  } : null;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Berman Electric" />
        <link rel="canonical" href={currentUrl} />
        
        {/* Robots */}
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />
        <meta name="bingbot" content={robotsContent} />
        
        {/* Geographic Meta Tags */}
        <meta name="geo.region" content={geoRegion} />
        <meta name="geo.placename" content={geoPlacename} />
        <meta name="geo.position" content={geoPosition} />
        <meta name="ICBM" content={geoPosition.replace(';', ', ')} />
        
        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Berman Electric" />
        <meta property="og:locale" content={ogLocale} />
        
        {/* Article specific OG tags */}
        {ogType === 'article' && articlePublishedTime && (
          <meta property="article:published_time" content={articlePublishedTime} />
        )}
        {ogType === 'article' && articleModifiedTime && (
          <meta property="article:modified_time" content={articleModifiedTime} />
        )}
        {ogType === 'article' && articleAuthor && (
          <meta property="article:author" content={articleAuthor} />
        )}
        {ogType === 'article' && articleSection && (
          <meta property="article:section" content={articleSection} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />
        
        {/* Mobile & PWA */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Berman Electric" />
        
        {/* Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* Breadcrumb Schema */}
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        
        {/* Additional Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
      
      {/* Schema Components */}
      {isLocalBusiness && <OrganizationSchema />}
      <ServiceAreaGeoSchema />
      <SitelinksSearchBoxSchema />
      
      {/* Performance Components */}
      {enableResourceHints && <PerformanceResourceHints prerenderRoutes={prerenderRoutes} />}
      <CriticalCSSInliner />
    </>
  );
};

export default AdvancedSEO;
