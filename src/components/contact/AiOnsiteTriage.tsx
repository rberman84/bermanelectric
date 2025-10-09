import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, Clock, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HazardPill {
  label: string;
  tone: "neutral" | "caution" | "danger" | "critical";
  message: string;
}

const hazardMeta: Record<string, HazardPill> = {
  safe: { label: "Looks Stable", tone: "neutral", message: "No obvious hazard detected, but monitor conditions." },
  watch: { label: "Monitor Closely", tone: "caution", message: "Keep an eye on this area and schedule a checkup." },
  warning: { label: "Needs Attention", tone: "danger", message: "Recommended on-site visit within 24 hours." },
  critical: { label: "High Risk", tone: "critical", message: "Treat as an urgent safety issue." },
};

const urgencyCopy: Record<string, string> = {
  schedule: "Routine scheduling is acceptable.",
  next_24_hours: "Aim to dispatch within the next 24 hours.",
  same_day: "Prioritize same-day dispatch if possible.",
};

interface AnalysisResult {
  hazardLevel: keyof typeof hazardMeta;
  hazardSummary: string;
  likelyCause: string;
  urgencyLevel: keyof typeof urgencyCopy;
  urgencyMinutes?: number;
  nextSteps: string[];
  estimatedJobLengthMinutes?: number;
  recommendedServiceType?: string;
  confidence?: string;
}

interface Props {
  onRecommendation?: (payload: {
    triageId?: string | null;
    hazardLevel: string;
    urgencyLevel: string;
    summary: string;
    jobLengthMinutes?: number;
    serviceType?: string;
    zipCode: string;
  }) => void;
}

export const AiOnsiteTriage: React.FC<Props> = ({ onRecommendation }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const hazard = useMemo(() => {
    if (!analysis) return null;
    return hazardMeta[analysis.hazardLevel] || hazardMeta.warning;
  }, [analysis]);

  const toBase64 = useCallback(
    (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    []
  );

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!selected.type.startsWith("image/")) {
      toast.error("Please upload an image file (jpg, png, heic).");
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!file) {
        toast.error("Add a panel or wiring photo to triage.");
        return;
      }

      if (!zipCode) {
        toast.error("ZIP code helps us estimate travel time.");
        return;
      }

      setIsSubmitting(true);

      try {
        const base64 = await toBase64(file);
        const payload = {
          imageBase64: base64,
          fileName: file.name,
          mimeType: file.type,
          consentToStore: consent,
          zipCode,
          description,
          clientName: clientName || undefined,
          clientEmail: clientEmail || undefined,
          clientPhone: clientPhone || undefined,
        };

        const { data, error } = await supabase.functions.invoke<{
          ok: boolean;
          analysis: AnalysisResult;
          latencyMs: number;
          consentStored: boolean;
          triageId?: string | null;
        }>("ai-onsite-triage", { body: payload });

        if (error) {
          console.error("AI triage error", error);
          toast.error((error as any)?.message || "Vision model timed out. Try again.");
          return;
        }

        if (!data?.ok) {
          toast.error("We couldn't classify that photo. Please try a clearer image.");
          return;
        }

        setAnalysis(data.analysis);
        setLatencyMs(data.latencyMs);
        toast.success("Triage complete. Review the safety call below.");

        onRecommendation?.({
          triageId: data.triageId,
          hazardLevel: data.analysis.hazardLevel,
          urgencyLevel: data.analysis.urgencyLevel,
          summary: data.analysis.hazardSummary,
          jobLengthMinutes: data.analysis.estimatedJobLengthMinutes,
          serviceType: data.analysis.recommendedServiceType,
          zipCode,
        });
      } catch (err: any) {
        console.error("Unexpected triage failure", err);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [file, zipCode, consent, description, clientName, clientEmail, clientPhone, toBase64, onRecommendation]
  );

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <ShieldAlert className="h-6 w-6 text-amber-500" />
          AI On-Site Safety Check
        </CardTitle>
        <CardDescription>
          Snap a clear panel or wiring photo. Our licensed-electrician tuned model flags hazards, urgency, and next steps in ~2 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label
              htmlFor="triage-photo"
              className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-electric-500 hover:bg-electric-50"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <>
                  <Camera className="h-8 w-8 text-slate-400 transition group-hover:text-electric-500" />
                  <div className="space-y-1">
                    <p className="font-semibold">Drop panel photo</p>
                    <p className="text-sm text-slate-500">JPG / PNG / HEIC • Max 10MB</p>
                  </div>
                </>
              )}
              <input
                id="triage-photo"
                name="triage-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Service ZIP Code</label>
                <Input
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value)}
                  placeholder="e.g. 11779"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">What's happening?</label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Breaker keeps tripping when oven and AC run. Slight burning smell."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Name (optional)</label>
              <Input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Jane Homeowner" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email for follow-up</label>
              <Input
                type="email"
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Phone</label>
              <Input value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} placeholder="516-555-1234" />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>
                I consent to Berman Electric securely storing this photo for training and visit prep.
              </span>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="h-4 w-4" />
              Consent to save photo
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={isSubmitting} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              {isSubmitting ? "Analyzing..." : "Run safety check"}
            </Button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>Inference target &lt; 2 seconds. Indoor photos only.</span>
            </div>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-semibold">Legal reminder</p>
            <p>
              AI triage is advisory only. Do not touch exposed conductors. Call 911 for active fire, smoke, or arcing.
              Booking links you with a licensed electrician for on-site verification.
            </p>
          </div>

          {analysis && hazard && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={cn(
                        "px-3 py-1 text-sm",
                        hazard.tone === "neutral" && "bg-emerald-100 text-emerald-700",
                        hazard.tone === "caution" && "bg-amber-100 text-amber-700",
                        hazard.tone === "danger" && "bg-orange-100 text-orange-700",
                        hazard.tone === "critical" && "bg-red-100 text-red-700"
                      )}
                    >
                      {hazard.label}
                    </Badge>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {analysis.confidence ? `Confidence: ${analysis.confidence}` : ""}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">{analysis.hazardSummary}</h3>
                  <p className="mt-2 text-sm text-slate-600">Likely cause: {analysis.likelyCause}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  {latencyMs !== null && <p>Model runtime: {latencyMs} ms</p>}
                  <p>Urgency: {urgencyCopy[analysis.urgencyLevel]}</p>
                  {analysis.estimatedJobLengthMinutes && (
                    <p>Est. on-site work: {analysis.estimatedJobLengthMinutes} minutes</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-semibold text-slate-700">Next steps</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {analysis.nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <AlertTriangle className="h-4 w-4" />
                  <span>We recommend an in-person diagnosis to verify.</span>
                </div>
                <Button asChild variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                  <a href="#smart-booking">Book this visit</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
