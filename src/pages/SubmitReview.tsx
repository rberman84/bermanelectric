import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Upload, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";
import { Checkbox } from "@/components/ui/checkbox";

const SubmitReview = () => {
  const { serviceRequestId } = useParams<{ serviceRequestId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [serviceQuality, setServiceQuality] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).slice(0, 5 - photos.length);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload photos if any
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("review-photos")
          .getPublicUrl(fileName);
        
        photoUrls.push(publicUrl);
      }

      // Submit review
      const { error: reviewError } = await supabase
        .from("customer_reviews")
        .insert({
          service_request_id: serviceRequestId,
          user_id: user.id,
          rating,
          title,
          review_text: reviewText,
          service_quality: serviceQuality || null,
          professionalism: professionalism || null,
          would_recommend: wouldRecommend,
          photo_urls: photoUrls.length > 0 ? photoUrls : null,
          status: "pending",
        });

      if (reviewError) throw reviewError;

      toast({
        title: "Thank you for your review!",
        description: "Your feedback has been submitted and will be reviewed by our team.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (
    value: number,
    hoverValue: number,
    setValue: (v: number) => void,
    setHover: (v: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoverValue || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Submit Review - Berman Electric</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">Share Your Experience</h1>
              <p className="text-lg text-muted-foreground">
                Your feedback helps us improve and helps others make informed decisions. Thank you for taking the time to share your thoughts!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-8 space-y-8">
              {/* Overall Rating */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">
                  Overall Rating <span className="text-destructive">*</span>
                </Label>
                {renderStars(rating, hoverRating, setRating, setHoverRating)}
                <p className="text-sm text-muted-foreground mt-2">
                  {rating === 0 && "Click to rate"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Service Quality & Professionalism */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Service Quality</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setServiceQuality(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= serviceQuality
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Professionalism</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setProfessionalism(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= professionalism
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <Label htmlFor="title" className="text-base font-semibold">
                  Review Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience in one sentence"
                  required
                  maxLength={100}
                  className="mt-2"
                />
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="review" className="text-base font-semibold">
                  Your Review <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience with Berman Electric. What did we do well? What could we improve?"
                  required
                  rows={6}
                  maxLength={2000}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {reviewText.length}/2000 characters
                </p>
              </div>

              {/* Would Recommend */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommend"
                  checked={wouldRecommend}
                  onCheckedChange={(checked) => setWouldRecommend(checked as boolean)}
                />
                <Label htmlFor="recommend" className="text-base font-medium cursor-pointer">
                  I would recommend Berman Electric to others
                </Label>
              </div>

              {/* Photo Upload */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Add Photos (Optional)
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Share photos of the completed work (max 5 photos, 5MB each)
                </p>
                
                {photos.length < 5 && (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload photos
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SubmitReview;