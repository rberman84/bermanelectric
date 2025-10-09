import { FormEvent, useMemo, useState } from "react";
import { BeforeAfterSlider } from "@/components/quote/BeforeAfterSlider";
import { DynamicPhone } from "@/components/shared/DynamicPhone";
import { useTrackingNumber } from "@/hooks/useTrackingNumber";
import { sendAnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number;
  description: string;
}

const ADD_ONS = [
  {
    id: "surge_protection",
    label: "Whole-home surge protection",
    description: "Protect every circuit and appliance from surges and lightning events.",
  },
  {
    id: "generator_inlet",
    label: "Generator inlet & interlock",
    description: "30A generator inlet, interlock kit, and safe changeover labeling.",
  },
  {
    id: "ev_ready",
    label: "EV charger ready",
    description: "Run a dedicated 60A circuit so you can plug a Level 2 charger in anytime.",
  },
  {
    id: "smart_panel",
    label: "Smart load monitoring",
    description: "Sense or Span-ready meter to see real-time usage and alerts from your phone.",
  },
] as const;

const AMPS_OPTIONS = [100, 150, 200, 225, 300];

interface EstimateResponse {
  priceBands: PriceBand[];
  recommendedCta: string;
  addOns: { id: string; label: string; cost: number }[];
  priceLow: number;
  priceHigh: number;
}

export function QuoteEngine() {
  const { tel, trackingId, sessionId, utmSource, utmMedium, utmCampaign, sourcePage } = useTrackingNumber();
  const [amps, setAmps] = useState(200);
  const [runLength, setRunLength] = useState(35);
  const [panelCapacity, setPanelCapacity] = useState(40);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  const endpoint = useMemo(() => import.meta.env.VITE_ESTIMATE_ENDPOINT ?? "/api/estimate", []);

  const selectedAddOnLabels = useMemo(
    () => ADD_ONS.filter((addOn) => selectedAddOns.includes(addOn.id)).map((addOn) => addOn.label),
    [selectedAddOns],
  );

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((addOn) => addOn !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        amps,
        runLength,
        panelCapacity,
        addOns: selectedAddOns,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tracking: {
          sessionId,
          sourcePage,
          utmSource,
          utmMedium,
          utmCampaign,
          trackingNumber: tel,
          trackingId,
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to calculate estimate");
      }

      const data = (await response.json()) as EstimateResponse;
      setResult(data);
      sendAnalyticsEvent("quote_generated", {
        amps,
        run_length: runLength,
        panel_capacity: panelCapacity,
        add_on_count: selectedAddOns.length,
        session_id: sessionId,
        tracking_id: trackingId,
        price_low: data.priceLow,
        price_high: data.priceHigh,
      });
    } catch (err) {
      console.error(err);
      setError("We couldn't create the estimate. Please call or try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="p-8 lg:p-12 bg-gray-50">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-electric-100 text-electric-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Instant pricing preview
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Build your service upgrade estimate in under a minute
            </h2>
            <p className="mt-3 text-gray-600">
              Adjust the sliders, choose any add-ons, and lock in a tailored price band. Every request alerts our master electrician and triggers a follow-up plan.
            </p>
          </div>
          <BeforeAfterSlider
            beforeImage="/lovable-uploads/1e22ee11-5f94-4f6d-88c2-ec9c5f3e25fd.png"
            afterImage="/lovable-uploads/5d74baaf-103d-46f5-ae25-f4f2cc5a1ecc.png"
            className="mb-8"
          />
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-electric-500" />
              <p>Typical quote turnaround: under 5 minutes. Response times are tracked inside our CRM so nothing falls through.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-electric-500" />
              <p>Prefer to talk it out? <DynamicPhone prefix={<span>Call </span>} /></p>
            </div>
          </div>
        </div>
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {AMPS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAmps(option)}
                  className={cn(
                    "rounded-xl border px-4 py-3 font-semibold transition-all",
                    amps === option
                      ? "border-electric-600 bg-electric-50 text-electric-700 shadow-sm"
                      : "border-gray-200 hover:border-electric-400 hover:text-electric-600",
                  )}
                >
                  {option}A Service
                </button>
              ))}
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                Conduit run length
                <span className="font-normal text-gray-500">{runLength} ft</span>
              </label>
              <input
                type="range"
                min={10}
                max={120}
                value={runLength}
                onChange={(event) => setRunLength(Number(event.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                Panel spaces required
                <span className="font-normal text-gray-500">{panelCapacity} circuits</span>
              </label>
              <input
                type="range"
                min={12}
                max={60}
                value={panelCapacity}
                onChange={(event) => setPanelCapacity(Number(event.target.value))}
                className="w-full"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-gray-700">Add-ons</legend>
              {ADD_ONS.map((addOn) => (
                <label key={addOn.id} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 hover:border-electric-400 transition-all">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{addOn.label}</p>
                    <p className="text-sm text-gray-600">{addOn.description}</p>
                  </div>
                </label>
              ))}
            </fieldset>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="quote-name">
                  Name
                </label>
                <input
                  id="quote-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-electric-600 focus:outline-none"
                  placeholder="Jane Homeowner"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="quote-email">
                  Email <span className="text-electric-600">*</span>
                </label>
                <input
                  id="quote-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-electric-600 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="quote-phone">
                  Mobile
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-electric-600 focus:outline-none"
                  placeholder="(516) 555-0123"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-electric-600 text-white font-semibold py-3 hover:bg-electric-700 transition-colors disabled:opacity-60"
            >
              {submitting ? "Calculating..." : "Get my price bands"}
            </button>
          </form>

          {result && (
            <div className="mt-10 space-y-6">
              <div className="rounded-2xl border border-electric-100 bg-electric-50 p-6">
                <p className="text-sm font-semibold text-electric-700 uppercase tracking-wide">Recommended next step</p>
                <p className="mt-2 text-lg font-bold text-gray-900">{result.recommendedCta}</p>
                <p className="mt-2 text-sm text-gray-600">
                  A confirmation email is on the way. You can also reply “YES” to our text to lock in a walkthrough.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {result.priceBands.map((band) => (
                  <div key={band.id} className="rounded-2xl border border-gray-200 p-5">
                    <p className="text-sm font-semibold text-electric-700 uppercase tracking-wide">{band.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      ${band.min.toLocaleString()} - ${band.max.toLocaleString()}
                    </p>
                    <p className="mt-3 text-sm text-gray-600">{band.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Have questions?</p>
                  <p className="text-gray-600 text-sm">
                    Your inputs are logged to our CRM with tracking ID <span className="font-semibold">{trackingId}</span> and {selectedAddOnLabels.length ? selectedAddOnLabels.join(", ") : "no add-ons"} selected.
                  </p>
                </div>
                <DynamicPhone className="justify-center" prefix={<span>Call </span>} suffix={<span className="sr-only"> for immediate scheduling</span>} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
