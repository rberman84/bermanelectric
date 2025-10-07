import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Loader2 } from "lucide-react";

const GooglePlaceConfig = () => {
  const [placeId, setPlaceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchPlaceId();
  }, []);

  const fetchPlaceId = async () => {
    try {
      const { data, error } = await supabase
        .from('google_settings')
        .select('place_id, last_synced_at')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPlaceId(data.place_id);
      }
    } catch (error) {
      console.error('Error fetching Place ID:', error);
      toast({
        title: "Error",
        description: "Failed to load Google Place ID configuration.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    if (!placeId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Google Place ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if settings exist
      const { data: existing } = await supabase
        .from('google_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('google_settings')
          .update({ place_id: placeId.trim() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('google_settings')
          .insert({ place_id: placeId.trim() });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Google Place ID saved successfully! You can now sync reviews.",
      });
    } catch (error) {
      console.error('Error saving Place ID:', error);
      toast({
        title: "Error",
        description: "Failed to save Google Place ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2">Google Reviews Configuration</h2>
      <p className="text-gray-600 mb-6">
        Configure your Google Place ID to automatically sync reviews from Google.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="placeId">Google Place ID</Label>
          <Input
            id="placeId"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="ChIJ..."
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-2">
            Your Google Place ID (starts with "ChIJ" or similar)
          </p>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full mb-4">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Place ID"
        )}
      </Button>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">How to find your Google Place ID:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Go to Google Maps and search for "Berman Electric Ronkonkoma"</li>
          <li>Click on your business listing</li>
          <li>Look at the URL - the Place ID is in the URL after "place/"</li>
          <li>Or use the Place ID Finder tool below</li>
        </ol>
        <a
          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-4"
        >
          <ExternalLink className="w-4 h-4" />
          Learn more about Place IDs
        </a>
      </div>
    </Card>
  );
};

export default GooglePlaceConfig;
