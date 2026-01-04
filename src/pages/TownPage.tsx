import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import TownHero from "@/components/town/TownHero";
import TownServices from "@/components/town/TownServices";
import CommonIssuesSection from "@/components/town/CommonIssuesSection";
import ElectricalCodesSection from "@/components/town/ElectricalCodesSection";
import CaseStudiesSection from "@/components/town/CaseStudiesSection";
import TownMap from "@/components/town/TownMap";
import DrivingDirections from "@/components/town/DrivingDirections";
import FaqSection from "@/components/town/FaqSection";
import HowToSection from "@/components/town/HowToSection";
import TownSchema from "@/components/town/TownSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import NearbyTowns from "@/components/town/NearbyTowns";
import TownCTA from "@/components/town/TownCTA";
import TownTestimonials from "@/components/town/TownTestimonials";
import TownKeywords from "@/components/town/TownKeywords";
import ReviewsSection, {
  defaultReviews,
  getReviewStats,
  transformGoogleReviews,
} from "@/components/shared/ReviewsSection";
import { getTownBySlug, getTownCanonicalUrl, allTowns } from "@/lib/townContent";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import NotFound from "./NotFound";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import InternalLinkingSidebar from "@/components/seo/InternalLinkingSidebar";
import { getNearbyTowns } from "@/data/internalLinks";

const TownPage = () => {
  const { townSlug } = useParams();
  const town = getTownBySlug(townSlug);
  const { data: googleReviews } = useGoogleReviews();

  if (!town) {
    return <NotFound />;
  }

  const reviews = googleReviews && googleReviews.length > 0
    ? transformGoogleReviews(googleReviews)
    : defaultReviews;

  const { averageRating, totalReviews } = getReviewStats(reviews);

  // Determine county based on which JSON file the town came from
  const county: 'nassau' | 'suffolk' = town.slug.includes('nassau') || 
    ['garden-city', 'great-neck', 'manhasset', 'port-washington', 'roslyn', 'oyster-bay', 'glen-cove', 'hempstead', 'freeport', 'long-beach', 'valley-stream', 'mineola', 'westbury', 'new-hyde-park', 'floral-park'].includes(town.slug) 
    ? 'nassau' : 'suffolk';

  // Get nearby towns for internal linking
  const nearbyTowns = getNearbyTowns(
    town.slug,
    county,
    allTowns.map(t => ({ name: t.name, slug: t.slug })),
    5
  );

  // Build content string for keyword matching
  const pageContent = `${town.name} ${town.intro} ${town.serviceArea} ${town.serviceCatalog.join(' ')}`;

  const townKeywords = [
    `${town.name} electrician`,
    `electrician ${town.name} NY`,
    `electrical contractor ${town.name}`,
    ...town.neighborhoods.map(n => `electrician ${n}`),
    ...town.serviceCatalog,
    "licensed electrician",
    "emergency electrical service"
  ].join(", ");

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{town.seo.title}</title>
        <meta name="description" content={town.seo.description} />
        <meta name="keywords" content={townKeywords} />
        <link rel="canonical" href={getTownCanonicalUrl(town.slug)} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={town.seo.title} />
        <meta property="og:description" content={town.seo.description} />
        <meta property="og:url" content={getTownCanonicalUrl(town.slug)} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Berman Electric" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={town.seo.title} />
        <meta name="twitter:description" content={town.seo.description} />
        
        {/* Geographic Tags */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content={`${town.name}, NY`} />
        <meta name="geo.position" content={`${town.coordinates.latitude};${town.coordinates.longitude}`} />
        <meta name="ICBM" content={`${town.coordinates.latitude}, ${town.coordinates.longitude}`} />
      </Helmet>

      <Navbar />
      <TownSchema town={town} averageRating={averageRating} totalReviews={totalReviews} />
      <BreadcrumbSchema
        items={[
          { name: "Service Areas", url: "/locations" },
          { name: county === 'nassau' ? "Nassau County" : "Suffolk County", url: county === 'nassau' ? "/locations/nassau-county" : "/locations/suffolk-county" },
          { name: `${town.name}, NY` },
        ]}
      />

      <TownHero town={town} />
      
      {/* Main content with sidebar */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-12">
            <TownServices town={town} />
            <CommonIssuesSection town={town} />
            <ElectricalCodesSection town={town} />
            <CaseStudiesSection town={town} />
          </div>
          
          {/* Internal linking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <InternalLinkingSidebar
                currentContent={pageContent}
                currentSlug={`/locations/${town.slug}`}
                townName={town.name}
                county={county}
                nearbyTowns={nearbyTowns}
              />
              
              {/* Quick contact card */}
              <div className="bg-primary rounded-xl p-6 text-primary-foreground">
                <h3 className="font-bold text-lg mb-2">Need an Electrician in {town.name}?</h3>
                <p className="text-primary-foreground/90 text-sm mb-4">
                  Same-day service available. Licensed & insured.
                </p>
                <a
                  href="tel:+15163614068"
                  className="block w-full text-center bg-primary-foreground text-primary font-semibold py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors"
                >
                  (516) 361-4068
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TownCTA town={town} />
      <TownTestimonials town={town} />
      <TownMap town={town} />
      <DrivingDirections town={town} />
      <FaqSection town={town} />
      <HowToSection town={town} />
      <ReviewsSection
        title={`Berman Electric Reviews Serving ${town.name}`}
        subtitle={`Verified electrical reviews from homeowners and facility managers in and around ${town.name}.`}
      />
      <TownKeywords town={town} />
      <NearbyTowns currentTown={town} />
      <Footer />
    </div>
  );
};

export default TownPage;
