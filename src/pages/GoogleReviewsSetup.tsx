import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";

const GoogleReviewsSetup = () => {
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!placeId.trim()) {
      toast.error("Please enter a Place ID");
      return;
    }

    setLoading(true);
    try {
      // Insert or update the Place ID
      const { error } = await supabase
        .from('google_settings')
        .upsert({ 
          place_id: placeId.trim(),
          id: '00000000-0000-0000-0000-000000000001' // Single row
        });

      if (error) throw error;

      toast.success("Place ID saved successfully!");
      
      // Trigger initial sync
      const { error: syncError } = await supabase.functions.invoke('sync-google-reviews');
      if (syncError) {
        console.error('Sync error:', syncError);
        toast.error("Place ID saved but sync failed. Try syncing manually.");
      } else {
        toast.success("Reviews synced successfully!");
      }
    } catch (error) {
      console.error('Error saving Place ID:', error);
      toast.error("Failed to save Place ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Google Reviews Setup</CardTitle>
              <CardDescription>
                Configure your Google Place ID to display reviews on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="placeId">Google Place ID</Label>
                <Input
                  id="placeId"
                  placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                />
                <p className="text-sm text-gray-600">
                  Find your Place ID at{" "}
                  <a
                    href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-600 hover:underline"
                  >
                    Google Place ID Finder
                  </a>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How to find your Place ID:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Go to Google Maps and search for your business</li>
                  <li>Click on your business listing</li>
                  <li>Copy the URL from your browser</li>
                  <li>The Place ID is in the URL after "!1s" or you can use the Place ID Finder tool above</li>
                </ol>
              </div>

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Saving..." : "Save & Sync Reviews"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GoogleReviewsSetup;