import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GoogleReview {
  id: string;
  review_id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  text: string;
  time: number;
  created_at: string;
  updated_at: string;
}

export const useGoogleReviews = () => {
  return useQuery({
    queryKey: ['google-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .order('time', { ascending: false });

      if (error) {
        throw error;
      }

      return data as GoogleReview[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useSyncGoogleReviews = () => {
  const syncReviews = async () => {
    const { data, error } = await supabase.functions.invoke('sync-google-reviews');
    
    if (error) {
      throw error;
    }
    
    return data;
  };

  return { syncReviews };
};
