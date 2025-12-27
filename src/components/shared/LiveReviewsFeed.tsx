import { useEffect, useState } from "react";
import { Star, Quote, RefreshCw } from "lucide-react";
import { useGoogleReviews, GoogleReview } from "@/hooks/useGoogleReviews";
import { supabase } from "@/integrations/supabase/client";

const LiveReviewsFeed = () => {
  const { data: reviews, isLoading, refetch } = useGoogleReviews();
  const [displayedReviews, setDisplayedReviews] = useState<GoogleReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('google-reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'google_reviews'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Update displayed reviews when data changes
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setDisplayedReviews(reviews.slice(0, 6));
    }
  }, [reviews]);

  // Auto-rotate reviews
  useEffect(() => {
    if (displayedReviews.length <= 3) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, displayedReviews.length - 2));
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayedReviews.length]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading reviews...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!displayedReviews.length) {
    return null;
  }

  const visibleReviews = displayedReviews.slice(currentIndex, currentIndex + 3);
  // Pad with first reviews if needed for wrap-around
  while (visibleReviews.length < 3 && displayedReviews.length >= 3) {
    visibleReviews.push(displayedReviews[visibleReviews.length - currentIndex]);
  }

  const averageRating = reviews 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="py-16 bg-gradient-to-br from-[hsl(45,100%,97%)] to-[hsl(35,100%,95%)]">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-bold text-gray-900">{averageRating}</span>
              <span className="text-sm text-muted-foreground">
                from {reviews?.length || 0} Google reviews
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">Real reviews from real customers, updated in real-time</p>
          </div>

          {/* Reviews Grid */}
          <div className={`grid md:grid-cols-3 gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {visibleReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Quote className="w-8 h-8 text-electric-200 mb-4" />
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < review.rating 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-200"
                      }`} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-4 text-sm leading-relaxed">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {review.author_photo_url ? (
                    <img 
                      src={review.author_photo_url.replace('=s128', '=s40')} 
                      alt={review.author_name}
                      width="40"
                      height="40"
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-electric-100 flex items-center justify-center">
                      <span className="text-electric-600 font-semibold">
                        {review.author_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.author_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.time * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          {displayedReviews.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.max(1, displayedReviews.length - 2) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? "bg-electric-600 w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to review set ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Live indicator */}
          <div className="text-center mt-6">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live from Google Reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveReviewsFeed;