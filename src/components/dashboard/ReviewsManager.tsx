import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerReview {
  id: string;
  rating: number;
  title: string;
  review_text: string;
  service_quality: number | null;
  professionalism: number | null;
  would_recommend: boolean | null;
  photo_urls: string[] | null;
  status: string;
  moderation_notes: string | null;
  featured: boolean | null;
  created_at: string;
  service_request_id: string;
  service_requests: {
    service_type: string;
    address: string;
  };
  profiles: {
    display_name: string;
  };
}

export const ReviewsManager = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customer_reviews")
        .select(`
          *,
          service_requests!inner(service_type, address),
          profiles!inner(display_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Error loading reviews",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (review: CustomerReview) => {
    setSelectedReview(review);
    setModerationNotes(review.moderation_notes || "");
    setIsFeatured(review.featured || false);
  };

  const handleModerateReview = async (reviewId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("customer_reviews")
        .update({
          status: newStatus,
          moderation_notes: moderationNotes,
          featured: isFeatured,
          approved_at: newStatus === "approved" ? new Date().toISOString() : null,
          approved_by: newStatus === "approved" ? (await supabase.auth.getUser()).data.user?.id : null,
        })
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: `Review ${newStatus}`,
        description: `The review has been ${newStatus} successfully.`,
      });

      setSelectedReview(null);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Error updating review",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground">Review and moderate customer feedback</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-50">
            {reviews.filter((r) => r.status === "pending").length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {reviews.filter((r) => r.status === "approved").length} Approved
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No customer reviews yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border">
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.title}</h3>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                      {review.featured && (
                        <Badge variant="outline" className="bg-electric-100 text-electric-700">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </span>
                      <span>{review.profiles?.display_name || "Anonymous"}</span>
                      <span>{review.service_requests?.service_type}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewReview(review)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-muted-foreground line-clamp-2 mb-3">
                  {review.review_text}
                </p>

                {review.photo_urls && review.photo_urls.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.photo_urls.slice(0, 3).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Review photo"
                        className="h-16 w-16 object-cover rounded"
                      />
                    ))}
                    {review.photo_urls.length > 3 && (
                      <div className="h-16 w-16 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                        +{review.photo_urls.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {review.status === "pending" && (
                  <div className="flex gap-2 pt-3">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setSelectedReview(review);
                        handleModerateReview(review.id, "approved");
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedReview(review);
                        handleModerateReview(review.id, "rejected");
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review and moderate this customer feedback
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedReview.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{selectedReview.profiles?.display_name || "Anonymous"}</span>
                  <span>{format(new Date(selectedReview.created_at), "MMM d, yyyy")}</span>
                  <span>{selectedReview.service_requests?.service_type}</span>
                </div>
                {renderStars(selectedReview.rating)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Service Quality</p>
                  {selectedReview.service_quality && renderStars(selectedReview.service_quality)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Professionalism</p>
                  {selectedReview.professionalism && renderStars(selectedReview.professionalism)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Would Recommend:</p>
                <Badge variant={selectedReview.would_recommend ? "default" : "secondary"}>
                  {selectedReview.would_recommend ? "Yes" : "No"}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Review:</p>
                <p className="text-muted-foreground">{selectedReview.review_text}</p>
              </div>

              {selectedReview.photo_urls && selectedReview.photo_urls.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Photos:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReview.photo_urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Review photo"
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="moderation_notes">Moderation Notes (Internal)</Label>
                <Textarea
                  id="moderation_notes"
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  placeholder="Add internal notes about this review..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">Feature this review on the website</Label>
              </div>

              {selectedReview.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleModerateReview(selectedReview.id, "approved")}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Review
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleModerateReview(selectedReview.id, "rejected")}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Review
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};