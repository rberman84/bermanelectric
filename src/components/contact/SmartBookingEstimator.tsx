import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CalendarDays, CheckCircle2, Clock, Loader2, Route } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SlotProposal {
  crewId: string;
  crewName: string;
  start: string;
  end: string;
  travelMinutesFromPrev: number;
  travelMinutesToNext: number;
  travelMiles: number;
  bufferBefore: number;
  bufferAfter: number;
}

interface BookingResponse {
  ok: boolean;
  bookingId: string;
  crewName: string;
  start: string;
  end: string;
}

interface Props {
  triageContext?: {
    triageId?: string | null;
    hazardLevel: string;
    urgencyLevel: string;
    summary: string;
    jobLengthMinutes?: number;
    serviceType?: string;
    zipCode: string;
  } | null;
}

const hazardText: Record<string, string> = {
  safe: "Routine",
  watch: "Monitor",
  warning: "Priority",
  critical: "Emergency",
};

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const SmartBookingEstimator: React.FC<Props> = ({ triageContext }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [jobLengthMinutes, setJobLengthMinutes] = useState(90);
  const [earliestStart, setEarliestStart] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [proposal, setProposal] = useState<SlotProposal | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);

  useEffect(() => {
    if (!triageContext) return;

    setZipCode((prev) => (prev ? prev : triageContext.zipCode));
    if (triageContext.serviceType) {
      setServiceType((prev) => (prev ? prev : triageContext.serviceType ?? ""));
    }
    if (triageContext.jobLengthMinutes) {
      setJobLengthMinutes((prev) => (prev !== 90 ? prev : triageContext.jobLengthMinutes ?? 90));
    }
    setNotes((prev) =>
      prev
        ? prev
        : `${triageContext.summary}${triageContext.hazardLevel ? ` | Hazard: ${hazardText[triageContext.hazardLevel] || triageContext.hazardLevel}` : ""}`
    );
  }, [triageContext]);

  const urgencyBadge = useMemo(() => {
    if (!triageContext) return null;
    const tone = triageContext.hazardLevel;
    return (
      <Badge
        className={cn(
          "px-3 py-1",
          tone === "critical" && "bg-red-100 text-red-700",
          tone === "warning" && "bg-orange-100 text-orange-700",
          tone === "watch" && "bg-amber-100 text-amber-700",
          tone === "safe" && "bg-emerald-100 text-emerald-700"
        )}
      >
        {hazardText[tone] || tone}
      </Badge>
    );
  }, [triageContext]);

  const handleEstimate = async () => {
    if (!name || !email || !phone || !zipCode || !serviceType) {
      toast.error("Fill out contact, service, and ZIP to estimate a slot.");
      return;
    }

    setLoading(true);
    setBooking(null);

    try {
      const { data, error } = await supabase.functions.invoke<{ ok: boolean; proposal?: SlotProposal; error?: string }>(
        "smart-booking",
        {
          body: {
            name,
            email,
            phone,
            zipCode,
            serviceType,
            jobLengthMinutes: Number(jobLengthMinutes),
            earliestStart: earliestStart ? new Date(earliestStart).toISOString() : undefined,
            notes: notes || undefined,
            triageId: triageContext?.triageId ?? undefined,
          },
        }
      );

      if (error) {
        console.error("Smart booking estimate error", error);
        toast.error((error as any)?.message || "Unable to compute earliest slot.");
        return;
      }

      if (!data?.ok || !data.proposal) {
        toast.error(data?.error || "No openings in the next two weeks.");
        setProposal(null);
        return;
      }

      setProposal(data.proposal);
      toast.success("Held the earliest open window. Review and confirm.");
    } catch (err: any) {
      console.error("Smart booking failure", err);
      toast.error("We couldn't access the crew calendar. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!proposal) return;
    setBookingLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke<BookingResponse | { error: string; proposal?: SlotProposal }>(
        "smart-booking",
        {
          body: {
            name,
            email,
            phone,
            zipCode,
            serviceType,
            jobLengthMinutes: Number(jobLengthMinutes),
            earliestStart: earliestStart ? new Date(earliestStart).toISOString() : undefined,
            notes: notes || undefined,
            confirm: true,
            triageId: triageContext?.triageId ?? undefined,
            slot: {
              crewId: proposal.crewId,
              start: proposal.start,
            },
          },
        }
      );

      if (error) {
        console.error("Smart booking confirm error", error);
        toast.error((error as any)?.message || "Could not secure that time.");
        return;
      }

      if ((data as any)?.error) {
        const conflict = data as { error: string; proposal?: SlotProposal };
        toast.error(conflict.error || "Slot just filled. Grab the updated slot above.");
        if (conflict.proposal) {
          setProposal(conflict.proposal);
        }
        return;
      }

      const success = data as BookingResponse;
      setBooking(success);
      toast.success("Locked on the calendar. Invites are on the way.");
    } catch (err: any) {
      console.error("Smart booking confirm failure", err);
      toast.error("Booking failed. Call dispatch and we will slot you manually.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Card id="smart-booking" className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <CalendarClock className="h-6 w-6 text-emerald-500" />
          Smart Booking
        </CardTitle>
        <CardDescription>
          We cross-check crew calendars, drive time from {zipCode || "your ZIP"}, and job length to hold the earliest clean window. Confirm to push invites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Homeowner" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Phone</label>
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="516-555-1234" required />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Service ZIP</label>
            <Input value={zipCode} onChange={(event) => setZipCode(event.target.value)} placeholder="11779" maxLength={5} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Service type</label>
            <Input
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              placeholder="Panel diagnostic / breaker tripping"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Job length (minutes)</label>
            <Input
              type="number"
              min={30}
              max={480}
              step={15}
              value={jobLengthMinutes}
              onChange={(event) => setJobLengthMinutes(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Earliest arrival (optional)</label>
            <Input type="datetime-local" value={earliestStart} onChange={(event) => setEarliestStart(event.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Notes for dispatch</label>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Breaker trips if oven + AC. Burning smell noted near top right breaker."
              rows={4}
            />
          </div>
        </div>

        {triageContext && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-semibold">AI triage linked</p>
              <p>{triageContext.summary}</p>
            </div>
            {urgencyBadge}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={handleEstimate} disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
            {loading ? "Checking crews..." : "Estimate earliest slot"}
          </Button>
          <p className="text-sm text-slate-500">
            We pad drive buffers both directions, so you get an honest window.
          </p>
        </div>

        {proposal && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Earliest window held</p>
                <p className="text-xl font-bold text-emerald-900">{formatter.format(new Date(proposal.start))}</p>
                <p className="text-sm text-emerald-700">Crew: {proposal.crewName}</p>
              </div>
              <div className="text-sm text-emerald-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>On-site work: {jobLengthMinutes} min + buffers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  <span>Travel: ~{proposal.travelMinutesFromPrev + proposal.travelMinutesToNext} min ({proposal.travelMiles} mi)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={bookingLoading}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
                {bookingLoading ? "Booking..." : "Book this slot"}
              </Button>
              <p className="text-xs text-emerald-700">
                Confirmation drops invites to you and dispatch with travel buffers baked in.
              </p>
            </div>
          </div>
        )}

        {booking && (
          <div className="rounded-lg border border-emerald-300 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-semibold">Locked in for {formatter.format(new Date(booking.start))}</p>
                <p className="text-sm text-slate-600">
                  Calendar invites sent to {email} and our {booking.crewName} crew.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          <p>
            Dispatch guarantees no overlapping jobs. Buffers cover travel, staging, and paperwork. Need something sooner? Call <a
              href="tel:5163614068"
              className="text-emerald-600 underline"
            >516-361-4068</a> and we'll escalate manually.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
