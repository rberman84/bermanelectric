import { Star, Quote, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";
import { useGoogleReviews, useSyncGoogleReviews, type GoogleReview } from "@/hooks/useGoogleReviews";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  verified?: boolean;
}

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
  showSchema?: boolean;
  reviews?: Review[];
  className?: string;
}

export const defaultReviews: Review[] = [
  {
    id: "1",
    author: "Emily R.",
    location: "Huntington, NY",
    rating: 5,
    text: "Berman Electric installed recessed lighting throughout our home, and the results were amazing! The team was professional, on time, and kept everything clean. I highly recommend them for any electrical work!",
    service: "Lighting Installation",
    date: "2024-01-15",
    verified: true
  },
  {
    id: "2", 
    author: "David M.",
    location: "Massapequa, NY",
    rating: 5,
    text: "I needed an EV charger installed, and Berman Electric handled everything from start to finish. They upgraded my panel and installed the charger seamlessly. The process was smooth, and the pricing was fair!",
    service: "EV Charger Installation",
    date: "2024-01-10",
    verified: true
  },
  {
    id: "3",
    author: "Lisa T.",
    location: "Babylon, NY", 
    rating: 5,
    text: "After a major storm, we lost power, and our panel was damaged. Berman Electric arrived quickly, assessed the situation, and restored our power the same day. They were absolute lifesavers!",
    service: "Emergency Repair",
    date: "2024-01-08",
    verified: true
  },
  {
    id: "4",
    author: "Michael K.",
    location: "Smithtown, NY",
    rating: 5,
    text: "We hired Berman Electric for a complete electrical fit-out in our retail store. They handled everything, from lighting design to wiring, and did an incredible job. They are now our go-to electricians!",
    service: "Commercial Installation",
    date: "2024-01-05",
    verified: true
  },
  {
    id: "5",
    author: "Dr. Steven L.",
    location: "Ronkonkoma, NY",
    rating: 5,
    text: "We needed a generator installed for our medical facility, and Berman Electric ensured everything was up to code. Their knowledge and professionalism gave us complete confidence in their work.",
    service: "Generator Installation", 
    date: "2024-01-02",
    verified: true
  },
  {
    id: "6",
    author: "John P.",
    location: "Long Island, NY",
    rating: 5,
    text: "Berman Electric upgraded the electrical system in our warehouse, and the difference is night and day. The lighting is more energy-efficient, and everything runs smoothly now. Great work!",
    service: "System Upgrade",
    date: "2023-12-28",
    verified: true
  }
];

export const transformGoogleReviews = (googleReviews: GoogleReview[]): Review[] =>
  googleReviews.map((review) => ({
    id: review.id,
    author: review.author_name,
    location: "Long Island, NY",
    rating: review.rating,
    text: review.text,
    service: "Google Review",
    date: new Date(review.time * 1000).toISOString().split("T")[0],
    verified: true,
  }));

export const getReviewStats = (reviews: Review[]) => {
  if (!reviews.length) {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  }

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  return { averageRating, totalReviews };
};

const ReviewsSection = ({ 
  title = "What Our Customers Say",
  subtitle = "Real reviews from satisfied customers across Long Island",
  showSchema = true,
  reviews: propReviews,
  className = ""
}: ReviewsSectionProps) => {
  const { data: googleReviews, isLoading, refetch } = useGoogleReviews();
  const { syncReviews } = useSyncGoogleReviews();
  const [isSyncing, setIsSyncing] = useState(false);

  // Convert Google reviews to Review format or use provided reviews
  const reviews = googleReviews && googleReviews.length > 0
    ? transformGoogleReviews(googleReviews)
    : propReviews || defaultReviews;

  const { averageRating, totalReviews } = getReviewStats(reviews);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncReviews();
      await refetch();
      toast({
        title: "Success",
        description: "Google reviews synced successfully!",
      });
    } catch (error) {
      console.error('Error syncing reviews:', error);
      toast({
        title: "Error",
        description: "Failed to sync reviews. Please check your Google Place ID configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4', 
      lg: 'w-5 h-5'
    };
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const reviewSchema = showSchema ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Berman Electric",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": totalReviews,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  } : null;

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      {showSchema && reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewSchema)
          }}
        />
      )}
      
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Sync Google Reviews"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating), 'lg')}
              <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">{totalReviews}</span> verified reviews
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating, 'sm')}
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    {" • "}
                    <span>{review.location}</span>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-electric-200 flex-shrink-0" />
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 leading-relaxed">{review.text}</p>

              {/* Review Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="bg-electric-50 text-electric-700 px-2 py-1 rounded-full">
                  {review.service}
                </span>
                <span>{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Ready to Join Our Satisfied Customers?</h3>
          <p className="text-gray-600 mb-6">
            Experience the same quality service that earned us these 5-star reviews
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15163614068"
              className="inline-flex items-center px-6 py-3 bg-electric-600 text-white rounded-lg hover:bg-electric-700 transition-colors font-semibold"
            >
              Call (516) 361-4068
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-electric-600 border-2 border-electric-600 rounded-lg hover:bg-electric-50 transition-colors font-semibold"
            >
              Get Free Quote
            </a>
          </div>
          
          {/* Review Links */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-3">Leave us a review:</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.google.com/search?q=berman+electric+ronkonkoma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-3 h-3" />
                Google
              </a>
              <a
                href="https://www.facebook.com/bermanelectric"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-3 h-3" />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;