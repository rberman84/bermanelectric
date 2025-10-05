import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let refresh = false;
    try {
      const body = await req.json();
      refresh = !!body?.refresh;
    } catch (_) {
      // no body provided
    }

    // Load cached reviews
    const { data: cached, error: cacheError } = await supabase
      .from("google_reviews")
      .select("*")
      .order("time", { ascending: false });

    if (cacheError) {
      console.error("Error fetching cached reviews:", cacheError);
      throw cacheError;
    }

    let reviews = cached || [];

    // Decide if we should refresh from Google
    if (refresh || reviews.length === 0) {
      const googleApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
      if (!googleApiKey) {
        console.warn("GOOGLE_PLACES_API_KEY not set; returning cached reviews only");
      } else {
        // Get Place ID
        const { data: settings, error: settingsError } = await supabase
          .from("google_settings")
          .select("place_id")
          .maybeSingle();

        if (settingsError) {
          console.error("Settings fetch error:", settingsError);
        } else if (settings?.place_id) {
          const placeId = settings.place_id as string;
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating&key=${googleApiKey}`;

          console.log("Refreshing from Google Places API...");
          const resp = await fetch(url);
          const json = await resp.json();

          if (json.status === "OK") {
            const list = (json.result?.reviews ?? []) as Array<any>;

            for (const r of list) {
              const row = {
                review_id: String(r.time),
                author_name: r.author_name,
                author_photo_url: r.profile_photo_url ?? null,
                rating: r.rating,
                text: r.text ?? "",
                time: r.time,
              };

              const { error: upsertError } = await supabase
                .from("google_reviews")
                .upsert(row, { onConflict: "review_id" });

              if (upsertError) {
                console.error("Upsert error:", upsertError);
              }
            }

            await supabase
              .from("google_settings")
              .update({ last_synced_at: new Date().toISOString() })
              .eq("place_id", placeId);

            // Reload from DB after upsert to return rows with IDs
            const { data: latest } = await supabase
              .from("google_reviews")
              .select("*")
              .order("time", { ascending: false });
            reviews = latest || reviews;
          } else {
            console.error("Google API error:", json);
          }
        }
      }
    }

    // Get last sync timestamp
    const { data: last } = await supabase
      .from("google_settings")
      .select("last_synced_at")
      .maybeSingle();

    return new Response(
      JSON.stringify({
        reviews,
        lastSynced: last?.last_synced_at || null,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in get-google-reviews:", error);
    return new Response(
      JSON.stringify({ error: error.message, reviews: [], success: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});