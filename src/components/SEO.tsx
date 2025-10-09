import { Helmet } from 'react-helmet-async';

type StructuredData = Record<string, unknown> | Array<unknown>;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: StructuredData;
}

const SEO = ({ 
  title, 
  description, 
  keywords = "electrician, electrical services, Long Island, Suffolk County, Ronkonkoma, licensed electrician, emergency electrical",
  canonical,
  ogImage = "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
  ogType = "website",
  structuredData
}: SEOProps) => {
  const fullTitle = title.includes('Berman Electric') ? title : `${title} | Berman Electric - Licensed Electrician Long Island`;
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Berman Electric" />
      <link rel="canonical" href={currentUrl} />
      <link rel="preload" href="/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png" as="image" fetchPriority="high" />
      
      {/* DNS prefetch and preconnect for external domains */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="dns-prefetch" href="https://www.facebook.com" />
      <link rel="dns-prefetch" href="https://www.instagram.com" />
      <link rel="dns-prefetch" href="https://www.linkedin.com" />
      <link rel="dns-prefetch" href="https://dcxndhszdrfznisudctt.supabase.co" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Berman Electric" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://bermanelectrical.com",
          "name": "Berman Electric",
          "alternateName": "Berman Electrical",
          "description": "Licensed electrician serving Long Island, NY with over 20 years of experience. Specializing in residential and commercial electrical services.",
          "url": "https://bermanelectrical.com",
          "telephone": "+1-516-361-4068",
          "email": "Rob@bermanelectrical.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Ronkonkoma",
            "addressRegion": "NY",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.8134",
            "longitude": "-73.1123"
          },
          "areaServed": [
            {
              "@type": "State",
              "name": "New York"
            },
            {
              "@type": "City",
              "name": "Ronkonkoma"
            },
            "Nassau County",
            "Suffolk County",
            "Long Island"
          ],
          "serviceType": [
            "Electrical Services",
            "Emergency Electrical Repair",
            "Panel Upgrades",
            "Lighting Installation",
            "EV Charger Installation",
            "Generator Installation"
          ],
          "priceRange": "$$",
          "openingHours": [
            "Mo-Fr 07:00-19:00"
          ],
          "image": [
            "https://bermanelectrical.com/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"
          ],
          "logo": "https://bermanelectrical.com/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png",
          "sameAs": [
            "https://www.facebook.com/bermanelectric",
            "https://www.instagram.com/bermanelectric",
            "https://www.linkedin.com/company/berman-electric"
          ],
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "name": "Licensed Electrician"
          }
        })}
      </script>

      {/* Additional Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;