import StructuredData from "../town/StructuredData";

export interface ReviewSnippet {
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}

interface ReviewRichSnippetSchemaProps {
  reviews: ReviewSnippet[];
  averageRating: number;
  totalReviews: number;
  businessName?: string;
}

const ReviewRichSnippetSchema = ({
  reviews,
  averageRating,
  totalReviews,
  businessName = "Berman Electric"
}: ReviewRichSnippetSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://bermanelectrical.com/#organization",
    "name": businessName,
    "image": "https://bermanelectrical.com/logo-optimized.webp",
    "url": "https://bermanelectrical.com",
    "telephone": "+1-516-361-4068",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "26 Railroad Avenue",
      "addressLocality": "Ronkonkoma",
      "addressRegion": "NY",
      "postalCode": "11779",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.8134",
      "longitude": "-73.1123"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": totalReviews,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.ratingValue,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      ...(review.datePublished && {
        "datePublished": review.datePublished
      })
    })),
    "sameAs": [
      "https://www.facebook.com/bermanelectric",
      "https://www.instagram.com/bermanelectric",
      "https://www.linkedin.com/company/berman-electric"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "14:00"
      }
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "license",
      "name": "NY Master Electrician License",
      "recognizedBy": {
        "@type": "Organization",
        "name": "New York State"
      }
    }
  };

  return <StructuredData data={schema} id="review-rich-snippet-schema" />;
};

export default ReviewRichSnippetSchema;
