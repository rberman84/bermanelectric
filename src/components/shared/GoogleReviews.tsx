import { useEffect, useState } from "react";
import { Star, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ScrollReveal from "./ScrollReveal";
import StaggerChildren from "./StaggerChildren";

interface GoogleReview {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  text: string;
  time: number;
}

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const { isAdmin } = useIsAdmin();

  const fetchReviews = async () => {
    try {
      console.log('Fetching Google reviews...');
      const { data, error } = await supabase.functions.invoke('get-google-reviews');
      
      if (error) throw error;
      
      setReviews(data.reviews || []);
      setLastSynced(data.lastSynced);
      console.log(`Loaded ${data.reviews?.length || 0} reviews`);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const syncReviews = async () => {
    setSyncing(true);
    try {
      console.log('Syncing Google reviews...');
      const { data, error } = await supabase.functions.invoke('get-google-reviews', {
        body: { refresh: true }
      });
      
      if (error) throw error;
      
      setReviews(data.reviews || []);
      setLastSynced(data.lastSynced || null);
      toast.success(`Synced ${data.reviews?.length || 0} reviews successfully`);
    } catch (error: any) {
      console.error('Error syncing reviews:', error);
      toast.error(error?.message || 'Failed to sync reviews');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-electric-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 mb-6">Real reviews from Google</p>
            
            {isAdmin && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={syncReviews}
                  disabled={syncing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Reviews'}
                </Button>
                {lastSynced && (
                  <span className="text-sm text-gray-500">
                    Last synced: {new Date(lastSynced).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </ScrollReveal>

          {reviews.length === 0 ? (
            <ScrollReveal animation="fade">
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-600">No reviews yet. Click "Sync Reviews" to fetch from Google.</p>
              </div>
            </ScrollReveal>
          ) : (
            <StaggerChildren staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {review.author_photo_url && (
                      <img
                        src={review.author_photo_url}
                        alt={review.author_name}
                        width="48"
                        height="48"
                        loading="lazy"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{review.author_name}</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-current' : 'stroke-current fill-none'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                    {review.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(review.time * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </StaggerChildren>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleReviews;