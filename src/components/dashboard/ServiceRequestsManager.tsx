import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Send, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ServiceRequest {
  id: string;
  service_type: string;
  description: string;
  status: string;
  address: string;
  phone: string;
  preferred_date: string | null;
  created_at: string;
  completed_at: string | null;
  review_requested_at: string | null;
  internal_notes: string | null;
  user_id: string;
  profiles: {
    display_name: string | null;
  } | null;
}

export const ServiceRequestsManager = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReview, setSendingReview] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false});

      if (error) throw error;
      
      // Fetch profiles separately for each request
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", request.user_id)
            .single();
          
          return {
            ...request,
            profiles: profile,
          };
        })
      );
      
      setRequests(requestsWithProfiles as any);
    } catch (error: any) {
      toast({
        title: "Error loading service requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("service_requests")
        .update(updates)
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Service request marked as ${newStatus}`,
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendReviewRequest = async (requestId: string) => {
    try {
      setSendingReview(requestId);

      const { error } = await supabase.functions.invoke("send-review-request", {
        body: { serviceRequestId: requestId },
      });

      if (error) throw error;

      toast({
        title: "Review request sent",
        description: "Customer will receive an email with a link to leave a review",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error sending review request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingReview(null);
    }
  };

  const handleNotesUpdate = async (requestId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ internal_notes: notes })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Notes saved",
        description: "Internal notes have been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error saving notes",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Requests</h2>
          <p className="text-muted-foreground">Manage and track service requests</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-50">
            {requests.filter((r) => r.status === "pending").length} Pending
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            {requests.filter((r) => r.status === "in-progress").length} In Progress
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {requests.filter((r) => r.status === "completed").length} Completed
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No service requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-card rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{request.service_type}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace("-", " ").charAt(0).toUpperCase() + 
                       request.status.replace("-", " ").slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{request.profiles?.display_name || "Unknown"}</span>
                    <span>{request.phone}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(request.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{request.address}</p>
                </div>

                <Select
                  value={request.status}
                  onValueChange={(value) => handleStatusUpdate(request.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/30 p-4 rounded mb-4">
                <p className="text-sm"><strong>Description:</strong> {request.description}</p>
                {request.preferred_date && (
                  <p className="text-sm mt-2">
                    <strong>Preferred Date:</strong> {format(new Date(request.preferred_date), "MMM d, yyyy")}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor={`notes-${request.id}`}>Internal Notes</Label>
                <Textarea
                  id={`notes-${request.id}`}
                  defaultValue={request.internal_notes || ""}
                  onBlur={(e) => handleNotesUpdate(request.id, e.target.value)}
                  placeholder="Add internal notes..."
                  rows={2}
                />
              </div>

              {request.status === "completed" && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {request.review_requested_at ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Review requested on {format(new Date(request.review_requested_at), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Ready for review request
                      </span>
                    )}
                  </div>
                  
                  {!request.review_requested_at && (
                    <Button
                      size="sm"
                      onClick={() => handleSendReviewRequest(request.id)}
                      disabled={sendingReview === request.id}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sendingReview === request.id ? "Sending..." : "Request Review"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};