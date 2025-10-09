import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Wrench, FileText, Phone, Mail } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { BookNowStrip } from "@/components/shared/BookNowStrip";
import { useTrackingNumber } from "@/hooks/useAttribution";

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

// Helper functions
function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { display: phoneDisplay, href: phoneHref } = useTrackingNumber();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPortalData();
    }
  }, [user]);

  const fetchPortalData = async () => {
    try {
      setLoadingRequests(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase.functions.invoke("portal-me");
      if (!profileError && profileData) {
        setUserName(profileData.name);
      }

      // Check if user has admin role
      if (user?.id) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .single();
        
        setIsAdmin(!!roleData);
      }

      // Fetch jobs (service requests)
      const { data: jobsData, error: jobsError } = await supabase.functions.invoke("portal-jobs", {
        body: { limit: 50 }
      });
      
      if (jobsError) throw jobsError;

      // Transform back to ServiceRequest format
      if (jobsData) {
        const { data: fullRequests, error } = await supabase
          .from("service_requests")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!error) {
          setRequests(fullRequests || []);
        }
      }
    } catch (error: any) {
      console.error("Error loading portal data:", error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchServiceRequests = fetchPortalData;

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
      membership: formData.get("membership") === "on",
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

      // Send email notification with membership info
      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          type: "service-request",
          customerName: profile?.display_name || "Customer",
          customerEmail: user?.email || "",
          phone: validated.phone,
          serviceType: validated.serviceType,
          description: validated.description,
          address: validated.address,
          preferredDate: validated.preferredDate || undefined,
          membership: data.membership,
        },
      });

      if (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the whole request if email fails
      }

      toast({
        title: "Request submitted!",
        description: data.membership 
          ? "We'll contact you soon to schedule your service and set up your Berman Plus membership."
          : "We'll contact you soon to schedule your service.",
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
    const map: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      scheduled: "bg-blue-100 text-blue-700",
      in_progress: "bg-purple-100 text-purple-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-neutral-100 text-neutral-700";
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  const upcomingRequests = requests.filter(
    (r) => r.status === "scheduled" || r.status === "pending"
  );
  const recentRequests = requests.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <section className="mb-6 rounded-2xl bg-neutral-900 p-6 text-white">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome{userName ? `, ${userName}` : user ? `, ${user.email?.split("@")[0]}` : ""}
                </h1>
                <p className="text-white/80">
                  Manage jobs, book service, and request estimates — all in one place.
                </p>
              </div>
              <div className="text-sm md:text-right">
                <div>
                  Need help now?{" "}
                  <span className="font-semibold">{phoneDisplay}</span>
                </div>
                <div className="text-white/70">
                  Berman Electric • White‑glove local service
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              onClick={() => {
                const form = document.getElementById("service-request-form");
                form?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group block rounded-2xl border border-neutral-200 bg-white p-4 hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Book a Service</div>
                  <div className="text-sm text-neutral-500">
                    Pick a time that works
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                const form = document.getElementById("service-request-form");
                form?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group block rounded-2xl border border-neutral-200 bg-white p-4 hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Request an Estimate</div>
                  <div className="text-sm text-neutral-500">
                    Share details & photos
                  </div>
                </div>
              </div>
            </button>

            <Link
              to="/"
              className="group block rounded-2xl border border-neutral-200 bg-white p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">View Services</div>
                  <div className="text-sm text-neutral-500">
                    Browse our offerings
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Admin Link - only show for admin users */}
          {isAdmin && (
            <section className="mb-8">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition"
              >
                View Admin Submissions →
              </Link>
            </section>
          )}

          {/* Content Grid */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
            {/* Upcoming Appointments */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              </div>
              {loadingRequests ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-1/2 rounded bg-neutral-200" />
                  <div className="h-3 w-2/3 rounded bg-neutral-200" />
                </div>
              ) : upcomingRequests.length ? (
                <ul className="divide-y divide-neutral-100">
                  {upcomingRequests.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <div className="font-medium">{r.service_type}</div>
                        <div className="text-xs text-neutral-500">
                          {r.preferred_date
                            ? formatDate(r.preferred_date)
                            : "Date pending"}
                        </div>
                      </div>
                      <span
                        className={classNames(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                          getStatusColor(r.status)
                        )}
                      >
                        {formatStatus(r.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-neutral-500">
                  <div className="font-medium text-neutral-700">
                    No appointments scheduled
                  </div>
                  <div className="mt-2 text-sm">
                    <button
                      onClick={() => {
                        const form = document.getElementById(
                          "service-request-form"
                        );
                        form?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="underline"
                    >
                      Schedule one now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="mb-3">
                <h2 className="text-lg font-semibold">Need Immediate Help?</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                  <Phone className="h-5 w-5 text-neutral-600" />
                  <div>
                    <div className="text-sm text-neutral-500">Call us</div>
                    <a
                      href={phoneHref}
                      className="font-semibold hover:underline"
                    >
                      {phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                  <Mail className="h-5 w-5 text-neutral-600" />
                  <div>
                    <div className="text-sm text-neutral-500">Email us</div>
                    <a
                      href="mailto:info@bermanelectrical.com"
                      className="font-semibold hover:underline"
                    >
                      info@bermanelectrical.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Jobs</h2>
              </div>
              {loadingRequests ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-1/3 rounded bg-neutral-200" />
                  <div className="h-3 w-2/3 rounded bg-neutral-200" />
                  <div className="h-3 w-1/2 rounded bg-neutral-200" />
                </div>
              ) : recentRequests.length ? (
                <div className="overflow-hidden rounded-xl border border-neutral-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-600">
                      <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Service</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((r) => (
                        <tr key={r.id} className="border-t border-neutral-100">
                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatDate(r.created_at)}
                          </td>
                          <td className="px-3 py-2">{r.service_type}</td>
                          <td className="px-3 py-2">
                            <span
                              className={classNames(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                                getStatusColor(r.status)
                              )}
                            >
                              {formatStatus(r.status)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-neutral-600">
                            {r.address}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-neutral-500">
                  <div className="font-medium text-neutral-700">No jobs yet</div>
                  <div className="mt-2 text-sm">
                    Book a service to get started.
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Service Request Form */}
          <section
            id="service-request-form"
            className="rounded-2xl border border-neutral-200 bg-white p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Submit Service Request</h2>
              <p className="text-neutral-600">
                Tell us about your electrical needs and we'll get back to you
              </p>
            </div>
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type *</Label>
                  <select
                    id="service-type"
                    name="service-type"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="Residential">Residential Electrical</option>
                    <option value="Commercial">Commercial Electrical</option>
                    <option value="Emergency">Emergency Service</option>
                    <option value="EV Charger">EV Charger Installation</option>
                    <option value="Panel Upgrade">Panel Upgrade</option>
                    <option value="Wiring">Wiring/Rewiring</option>
                    <option value="Lighting">Lighting Installation</option>
                    <option value="Inspection">Electrical Inspection</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

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

              <div className="space-y-2">
                <Label htmlFor="preferred-date">Preferred Date</Label>
                <Input
                  id="preferred-date"
                  name="preferred-date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                />
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

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <Label 
                  htmlFor="membership" 
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <Checkbox id="membership" name="membership" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">
                      Add Berman Plus — $19/month
                    </div>
                    <div className="mt-1 text-sm text-neutral-600">
                      Priority scheduling, annual safety check, 10% off service calls
                    </div>
                  </div>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-neutral-800"
                disabled={loading}
              >
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
          </section>

          {/* Footer */}
          <footer className="mt-10 text-center text-xs text-neutral-400">
            © {new Date().getFullYear()} Berman Electric — Licensed & Insured —
            Ronkonkoma, NY
          </footer>
        </div>
      </main>
      <BookNowStrip />
      <Footer />
    </div>
  );
};

export default Dashboard;
