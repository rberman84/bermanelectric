import { useMemo, useState } from "react";
import { Loader2, MailCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  trackConversionComplete,
  trackConversionStep,
  trackEvent,
  trackHeatmapFriction,
} from "@/lib/analytics";

interface StepOneData {
  problem: string;
  zip: string;
}

interface StepTwoData {
  name: string;
  email: string;
  phone: string;
}

const estimateCopy = [
  { keywords: ["panel", "breaker", "service upgrade"], range: "$680 - $2,100" },
  { keywords: ["outlet", "receptacle", "switch"], range: "$189 - $425" },
  { keywords: ["lighting", "fixture", "recessed"], range: "$245 - $780" },
  { keywords: ["generator"], range: "$950 - $4,800" },
  { keywords: ["ev", "charger"], range: "$525 - $1,600" },
  { keywords: ["emergency", "no power"], range: "$220 - $690" },
];

const sanitizeZip = (value: string) => value.replace(/[^0-9]/g, "");

const getEstimateRange = (problem: string) => {
  const normalized = problem.toLowerCase();
  const match = estimateCopy.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );
  return match?.range ?? "$189 - $525";
};

export const ConversionForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkSending, setIsMagicLinkSending] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [stepOneData, setStepOneData] = useState<StepOneData>({ problem: "", zip: "" });
  const [stepTwoData, setStepTwoData] = useState<StepTwoData>({ name: "", email: "", phone: "" });

  const estimateRange = useMemo(() => getEstimateRange(stepOneData.problem), [stepOneData.problem]);

  const handleProblemChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStepOneData((prev) => ({ ...prev, problem: event.target.value }));
  };

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeZip(event.target.value);
    setStepOneData((prev) => ({ ...prev, zip: sanitized }));
  };

  const handleStepOneSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = stepOneData.problem.trim();
    const zip = sanitizeZip(stepOneData.zip);

    if (!problem) {
      trackHeatmapFriction("missing_problem");
      toast.error("Let us know what needs attention.");
      return;
    }

    if (zip.length !== 5) {
      trackHeatmapFriction("invalid_zip", { zipLength: zip.length });
      toast.error("Please enter a 5 digit ZIP code.");
      return;
    }

    const range = getEstimateRange(problem);
    setStepOneData({ problem, zip });
    setStep(2);
    trackConversionStep(1, { problem, zip });
    trackEvent("conversion_pre_quote", { estimateRange: range });
  };

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStepTwoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepTwoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: StepTwoData = {
      name: stepTwoData.name.trim(),
      email: stepTwoData.email.trim(),
      phone: stepTwoData.phone.trim(),
    };

    if (!payload.name || !payload.email) {
      trackHeatmapFriction("missing_contact");
      toast.error("Name and email help us lock in your quote.");
      return;
    }

    setStepTwoData(payload);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("portal-estimate", {
        body: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: stepOneData.zip,
          projectType: stepOneData.problem,
          notes: `Pre-quote range shared online: ${estimateRange}`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("All set — we’ll confirm your visit shortly.");
      trackConversionStep(2, { ...payload, zip: stepOneData.zip });
      trackConversionComplete({ ...payload, ...stepOneData, estimateRange });
      setStep(1);
      setStepOneData({ problem: "", zip: "" });
      setStepTwoData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Conversion form submit error", error);
      toast.error("Something went wrong. Please call 516-361-4068.");
      trackHeatmapFriction("submission_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async () => {
    const email = magicEmail.trim();
    if (!email) {
      trackHeatmapFriction("magic_link_missing_email");
      toast.error("Enter an email to send the magic link.");
      return;
    }

    setIsMagicLinkSending(true);
    try {
      await supabase.functions.invoke("send-email", {
        body: {
          type: "contact",
          name: payloadNameForMagicLink(stepOneData.problem),
          email,
          phone: "",
          service: "Magic Link",
          message: `Customer requested a magic link to finish booking. Problem: ${stepOneData.problem || "N/A"}. ZIP: ${stepOneData.zip || ""}.`,
        },
      });
      trackEvent("conversion_magic_link", { email, ...stepOneData });
      toast.success("Check your inbox for the magic link.");
      setMagicEmail("");
    } catch (error) {
      console.error("Magic link send error", error);
      toast.error("Couldn't send the magic link. Try again.");
      trackHeatmapFriction("magic_link_error");
    } finally {
      setIsMagicLinkSending(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-lg border border-white/60">
      <div className="flex items-center gap-2 text-sm font-semibold text-electric-600 uppercase tracking-wider">
        <Sparkles className="h-4 w-4" />
        <span>Instant Pre-Quote</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Two quick steps — we’ll text or email you a real appointment window.
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 uppercase">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-electric-600" : "bg-gray-200"}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-electric-600" : "bg-gray-200"}`} />
      </div>

      {step === 1 ? (
        <form className="mt-6 space-y-5" onSubmit={handleStepOneSubmit}>
          <div>
            <label htmlFor="problem" className="text-sm font-medium text-gray-700">What’s going on?</label>
            <textarea
              id="problem"
              name="problem"
              rows={3}
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
              placeholder="Breaker tripping, no power in kitchen, adding recessed lights…"
              value={stepOneData.problem}
              onChange={handleProblemChange}
            />
          </div>
          <div>
            <label htmlFor="zip" className="text-sm font-medium text-gray-700">ZIP code</label>
            <input
              id="zip"
              name="zip"
              inputMode="numeric"
              maxLength={5}
              minLength={5}
              pattern="[0-9]{5}"
              required
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
              placeholder="11779"
              value={stepOneData.zip}
              onChange={handleZipChange}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-electric-600 py-3 text-white font-semibold shadow-lg shadow-electric-600/30 hover:bg-electric-700 transition"
          >
            See my pre-quote
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-electric-100 bg-electric-50 px-4 py-3 text-sm text-electric-800">
            <p className="font-semibold">Most jobs like yours run {estimateRange}.</p>
            <p className="mt-1 text-electric-700">
              We’ll confirm with a licensed electrician before anything is locked in.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleStepTwoSubmit}>
            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
                  placeholder="Full name"
                  value={stepTwoData.name}
                  onChange={handleContactChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
                  placeholder="name@email.com"
                  value={stepTwoData.email}
                  onChange={handleContactChange}
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
                  placeholder="(516) 361-4068"
                  value={stepTwoData.phone}
                  onChange={handleContactChange}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-electric-600 py-3 text-white font-semibold shadow-lg shadow-electric-600/30 hover:bg-electric-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking…
                </span>
              ) : (
                "Confirm my visit"
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Go back
            </button>
          </form>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MailCheck className="h-4 w-4 text-electric-600" />
            Finish later? We’ll send a magic link.
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={magicEmail}
              onChange={(event) => setMagicEmail(event.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
            />
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isMagicLinkSending}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-electric-600 shadow-sm ring-1 ring-electric-200 hover:bg-electric-50 disabled:opacity-60"
            >
              {isMagicLinkSending ? "Sending…" : "Send magic link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const payloadNameForMagicLink = (problem: string) => {
  if (problem) {
    return `Magic Link Lead – ${problem.slice(0, 40)}`;
  }
  return "Magic Link Lead";
};

export default ConversionForm;
