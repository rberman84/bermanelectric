import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export const GoogleBusinessProfile = () => {
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaceId = async () => {
      const { data } = await supabase
        .from('google_settings')
        .select('place_id')
        .maybeSingle();
      
      if (data?.place_id) {
        setPlaceId(data.place_id);
      }
      setLoading(false);
    };

    fetchPlaceId();
  }, []);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-pulse text-muted-foreground">Loading business profile...</div>
      </div>
    );
  }

  if (!placeId) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Our Google Business Profile</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See our latest reviews, photos, and business information on Google
          </p>
        </div>
        
        <Card className="overflow-hidden max-w-4xl mx-auto shadow-lg">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:${placeId}&zoom=15`}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Berman Electric Google Business Profile"
          />
        </Card>

        <div className="text-center mt-8">
          <a
            href={`https://search.google.com/local/writereview?placeid=${placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Leave a Google Review
          </a>
        </div>
      </div>
    </section>
  );
};
