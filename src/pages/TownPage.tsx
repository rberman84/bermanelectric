import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import TownHero from "@/components/town/TownHero";
import TownServices from "@/components/town/TownServices";
import TownMap from "@/components/town/TownMap";
import DrivingDirections from "@/components/town/DrivingDirections";
import FaqSection from "@/components/town/FaqSection";
import HowToSection from "@/components/town/HowToSection";
import TownSchema from "@/components/town/TownSchema";
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

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{town.seo.title}</title>
        <meta name="description" content={town.seo.description} />
        <link rel="canonical" href={getTownCanonicalUrl(town.slug)} />
      </Helmet>

      <TownSchema town={town} averageRating={averageRating} totalReviews={totalReviews} />

      <TownHero town={town} />
      <TownServices town={town} />
      <TownMap town={town} />
      <DrivingDirections town={town} />
      <FaqSection town={town} />
      <HowToSection town={town} />
      <ReviewsSection
        title={`Berman Electric Reviews Serving ${town.name}`}
        subtitle={`Verified electrical reviews from homeowners and facility managers in and around ${town.name}.`}
      />
    </div>
  );
};

export default TownPage;
