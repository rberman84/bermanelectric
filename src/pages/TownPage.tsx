import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import TownHero from "@/components/town/TownHero";
import TownServices from "@/components/town/TownServices";
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
import { getTownBySlug, getTownCanonicalUrl } from "@/lib/townContent";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import NotFound from "./NotFound";

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
    <div className="flex flex-col">
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

      <TownSchema town={town} averageRating={averageRating} totalReviews={totalReviews} />
      <BreadcrumbSchema
        items={[
          { name: "Service Areas", url: "/locations" },
          { name: `${town.name}, NY` },
        ]}
      />

      <TownHero town={town} />
      <TownServices town={town} />
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
    </div>
  );
};

export default TownPage;
