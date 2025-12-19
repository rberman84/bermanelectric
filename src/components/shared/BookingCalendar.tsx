import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, CheckCircle2, Loader2, Zap, ArrowRight, User, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

const serviceTypes = [
  { value: "panel-upgrade", label: "Panel Upgrade", duration: 240 },
  { value: "outlet-install", label: "Outlet Installation", duration: 60 },
  { value: "lighting", label: "Lighting Installation", duration: 90 },
  { value: "ev-charger", label: "EV Charger Install", duration: 180 },
  { value: "inspection", label: "Electrical Inspection", duration: 60 },
  { value: "repair", label: "General Repair", duration: 90 },
  { value: "generator", label: "Generator Install", duration: 300 },
  { value: "smart-home", label: "Smart Home Setup", duration: 120 },
  { value: "other", label: "Other Service", duration: 90 },
];

type BookingStep = "service" | "datetime" | "contact" | "confirm" | "success";

interface SlotProposal {
  crewId: string;
  crewName: string;
  start: string;
  end: string;
  travelMinutesFromPrev: number;
  travelMinutesToNext: number;
}

export default function BookingCalendar() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<BookingStep>("service");
  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState<SlotProposal | null>(null);

  const [formData, setFormData] = useState({
    serviceType: "",
    date: undefined as Date | undefined,
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    notes: "",
  });

  const selectedService = serviceTypes.find(s => s.value === formData.serviceType);

  const resetForm = () => {
    setStep("service");
    setProposal(null);
    setFormData({
      serviceType: "",
      date: undefined,
      name: "",
      email: "",
      phone: "",
      zipCode: "",
      notes: "",
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForm, 300);
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.serviceType || !formData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-booking", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode,
          serviceType: selectedService?.label || formData.serviceType,
          jobLengthMinutes: selectedService?.duration || 90,
          earliestStart: formData.date.toISOString(),
          notes: formData.notes,
          confirm: false,
        },
      });

      if (error) throw error;

      if (data?.ok && data?.proposal) {
        setProposal(data.proposal);
        setStep("confirm");
      } else {
        toast.error(data?.error || "No available slots found");
      }
    } catch (error: any) {
      console.error("Availability check failed:", error);
      toast.error("Failed to check availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBooking = async () => {
    if (!proposal) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-booking", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode,
          serviceType: selectedService?.label || formData.serviceType,
          jobLengthMinutes: selectedService?.duration || 90,
          earliestStart: formData.date?.toISOString(),
          notes: formData.notes,
          confirm: true,
          slot: {
            crewId: proposal.crewId,
            start: proposal.start,
          },
        },
      });

      if (error) throw error;

      if (data?.ok) {
        setStep("success");
        toast.success("Appointment booked successfully!");
      } else {
        toast.error(data?.error || "Failed to confirm booking");
      }
    } catch (error: any) {
      console.error("Booking confirmation failed:", error);
      toast.error("Failed to confirm booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "service":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">What service do you need?</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label} (~{Math.round(service.duration / 60)}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Estimated duration: <strong>{Math.round(selectedService.duration / 60)} hours</strong></span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full h-12"
              onClick={() => setStep("datetime")}
              disabled={!formData.serviceType}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "datetime":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Select your preferred date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData({ ...formData, date })}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="zipCode" className="text-base font-medium">Your ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="11779"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                maxLength={5}
                className="h-12"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("service")} className="flex-1 h-12">
                Back
              </Button>
              <Button
                className="flex-1 h-12"
                onClick={() => setStep("contact")}
                disabled={!formData.date || !formData.zipCode || formData.zipCode.length !== 5}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(516) 555-1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base font-medium">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any details about your electrical needs..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("datetime")} className="flex-1 h-12">
                Back
              </Button>
              <Button
                className="flex-1 h-12"
                onClick={checkAvailability}
                disabled={isLoading || !formData.name || !formData.email || !formData.phone}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>Find Available Slot <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        );

      case "confirm":
        return proposal ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <CalendarDays className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Slot Available!</h3>
              <p className="text-muted-foreground mt-1">Here's your proposed appointment</p>
            </div>

            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{format(new Date(proposal.start), "EEEE, MMMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(proposal.start), "h:mm a")} - {format(new Date(proposal.end), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{selectedService?.label}</p>
                    <p className="text-sm text-muted-foreground">~{Math.round((selectedService?.duration || 90) / 60)} hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Service Location</p>
                    <p className="text-sm text-muted-foreground">ZIP: {formData.zipCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("contact")} className="flex-1 h-12">
                Back
              </Button>
              <Button
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                onClick={confirmBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null;

      case "success":
        return (
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground">You're All Set!</h3>
              <p className="text-muted-foreground mt-2">
                We've sent a confirmation email to <strong>{formData.email}</strong>
              </p>
            </div>

            {proposal && (
              <Card className="border-primary/20 bg-primary/5 text-left">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold">{selectedService?.label}</p>
                  <p className="text-sm">{format(new Date(proposal.start), "EEEE, MMMM d, yyyy 'at' h:mm a")}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Need to reschedule? Call us at <a href="tel:5163614068" className="font-medium text-primary">(516) 361-4068</a>
              </p>
              <Button onClick={handleClose} className="w-full h-12">
                Done
              </Button>
            </div>
          </div>
        );
    }
  };

  const stepIndicator = () => {
    if (step === "success") return null;
    const steps = ["service", "datetime", "contact", "confirm"];
    const currentIndex = steps.indexOf(step);

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= currentIndex ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => o ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg">
          <CalendarDays className="h-5 w-5" />
          Book Online
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === "success" ? "Booking Confirmed" : "Schedule Your Service"}
          </DialogTitle>
          <DialogDescription>
            {step === "success" 
              ? "Your appointment has been scheduled" 
              : "Book your electrical service appointment online"
            }
          </DialogDescription>
        </DialogHeader>
        {stepIndicator()}
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
