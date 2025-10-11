import { Helmet } from "react-helmet-async";

export interface ReviewData {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished: string;
  location?: string;
}

interface ReviewSchemaProps {
  reviews: ReviewData[];
  businessName?: string;
  businessUrl?: string;
}

const ReviewSchema = ({ 
  reviews, 
  businessName = "Berman Electric",
  businessUrl = "https://www.bermanelectric.com" 
}: ReviewSchemaProps) => {
  const reviewSchemas = reviews.map((review, index) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `${businessUrl}/testimonials#review-${index}`,
    itemReviewed: {
      "@type": "LocalBusiness",
      name: businessName,
      url: businessUrl,
      telephone: "+1-516-361-4068",
      address: {
        "@type": "PostalAddress",
        streetAddress: "26 Railroad Avenue",
        addressLocality: "Ronkonkoma",
        addressRegion: "NY",
        postalCode: "11779",
        addressCountry: "US",
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewRating,
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Person",
      name: review.author,
      ...(review.location && {
        address: {
          "@type": "PostalAddress",
          addressLocality: review.location,
        },
      }),
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    publisher: {
      "@type": "Organization",
      name: businessName,
    },
  }));

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(reviewSchemas)}
      </script>
    </Helmet>
  );
};

export default ReviewSchema;
