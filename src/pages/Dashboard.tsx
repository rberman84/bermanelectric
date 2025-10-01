import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, MapPin, Phone, FileText } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";

const serviceRequestSchema = z.object({
  serviceType: z.string().min(1, { message: "Please select a service type" }),
  description: z.string().trim().min(10, { message: "Description must be at least 10 characters" }).max(2000, { message: "Description must be less than 2000 characters" }),
  address: z.string().trim().min(10, { message: "Please provide a complete address" }).max(200, { message: "Address must be less than 200 characters" }),
  phone: z.string().trim().regex(/^[0-9()\-\s+]{10,20}$/, { message: "Please provide a valid phone number" }),
  preferredDate: z.string().optional(),
});

type ServiceRequest = {
  id: string;
  service_type: string;
  description: string;
  status: string;
  address: string;
  preferred_date: string | null;
  phone: string;
  created_at: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchServiceRequests();
    }
  }, [user]);

  const fetchServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      serviceType: formData.get("service-type") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      preferredDate: formData.get("preferred-date") as string,
    };

    try {
      const validated = serviceRequestSchema.parse(data);

      // Insert service request into database
      const { error } = await supabase.from("service_requests").insert({
        user_id: user?.id,
        service_type: validated.serviceType,
        description: validated.description,
        address: validated.address,
        phone: validated.phone,
        preferred_date: validated.preferredDate || null,
      });

      if (error) throw error;

      // Get user's email from their profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user?.id)
        .single();

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke("send-service-request-email", {
        body: {
          customerName: profile?.display_name || "Customer",
          customerEmail: user?.email || "",
          phone: validated.phone,
          serviceType: validated.serviceType,
          description: validated.description,
          address: validated.address,
          preferredDate: validated.preferredDate || undefined,
        },
      });

      if (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the whole request if email fails
      }

      toast({
        title: "Request submitted!",
        description: "We'll contact you soon to schedule your service.",
      });

      e.currentTarget.reset();
      fetchServiceRequests();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "scheduled":
        return "bg-blue-500";
      case "in_progress":
        return "bg-purple-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 bg-gradient-to-br from-background to-muted">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Customer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your service requests and view your history
            </p>
          </div>

          <Tabs defaultValue="new-request" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="new-request">New Request</TabsTrigger>
              <TabsTrigger value="history">Request History</TabsTrigger>
            </TabsList>

            <TabsContent value="new-request">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Service Request</CardTitle>
                  <CardDescription>
                    Tell us about your electrical needs and we'll get back to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRequest} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="service-type">Service Type *</Label>
                      <Select name="service-type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential Electrical</SelectItem>
                          <SelectItem value="Commercial">Commercial Electrical</SelectItem>
                          <SelectItem value="Emergency">Emergency Service</SelectItem>
                          <SelectItem value="EV Charger">EV Charger Installation</SelectItem>
                          <SelectItem value="Panel Upgrade">Panel Upgrade</SelectItem>
                          <SelectItem value="Wiring">Wiring/Rewiring</SelectItem>
                          <SelectItem value="Lighting">Lighting Installation</SelectItem>
                          <SelectItem value="Inspection">Electrical Inspection</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Please describe the work you need done..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Service Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="123 Main St, Town, NY 11111"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Contact Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          pattern="[0-9()\-\s+]+"
                          minLength={10}
                          maxLength={20}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferred-date">Preferred Date</Label>
                        <Input
                          id="preferred-date"
                          name="preferred-date"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Your Service Requests</CardTitle>
                  <CardDescription>
                    View the status of your current and past requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRequests ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No service requests yet</p>
                      <p className="text-sm">Submit your first request to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <Card key={request.id} className="border-l-4" style={{ borderLeftColor: `var(--${getStatusColor(request.status)})` }}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{request.service_type}</CardTitle>
                                <CardDescription className="mt-1">
                                  Submitted {new Date(request.created_at).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusColor(request.status)}>
                                {formatStatus(request.status)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">{request.description}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span>{request.address}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>{request.phone}</span>
                              </div>
                              {request.preferred_date && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  <span>Preferred: {new Date(request.preferred_date).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
