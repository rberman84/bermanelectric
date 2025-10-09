import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Car,
  Zap,
  Shield,
  CheckCircle2,
  Phone,
  Mail,
  Calculator,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// If you have this util, keep the import; otherwise delete the function call below and use a plain alt string.
// import { generateAltText } from "@/lib/utils";

const services = [
  { title: "Residential EV Charger Installation", items: [
      "Level 1 & Level 2 home charging station installations",
      "Electrical panel upgrades for increased power capacity",
      "Dedicated circuits & wiring for safe charging",
      "Smart home integration for automated EV charging",
    ]},
  { title: "Commercial EV Charging Solutions", items: [
      "Multi-unit residential EV charger installations",
      "Workplace & fleet charging station setup",
      "Public EV charger installation for retail, offices & parking lots",
      "Load management & energy-efficient charging solutions",
    ]},
  { title: "Panel Upgrades & Dedicated Circuits", items: [
      "Ensure your home's electrical panel can handle EV charging loads",
      "Upgrade older electrical panels to prevent overloads & power failures",
      "Install dedicated circuits for faster, safer charging",
    ]},
  { title: "Smart & Fast-Charging Solutions", items: [
      "Wi-Fi-enabled EV chargers with mobile app control",
      "Fast-charging Level 2 stations for quicker charge times",
      "Integration with solar power & energy-efficient systems",
    ]},
];

const benefits = [
  "Charge Your Car Overnight – No more waiting at public stations",
  "Save Money – Home charging is more cost-effective than commercial charging stations",
  "Increase Home Value – An EV charger adds resale value to your property",
  "Convenience & Safety – No need to rely on crowded public chargers",
];

const whyChooseUs = [
  "Licensed & Insured Electricians – Certified professionals ensuring safe, code-compliant installations",
  "Over 20 Years of Experience – Trusted electrical contractors serving homes & businesses across Long Island",
  "Custom Charging Solutions – We tailor EV charger setups to match your needs, power capacity & budget",
  "Fast & Hassle-Free Installation – We handle everything from permits to installation & testing",
  "Guaranteed Workmanship & Support – We stand behind our work & offer ongoing support",
];

const ampOptions = [
  { value: "40", label: "40A Level 2 (up to 9.6 kW)" },
  { value: "50", label: "50A Level 2 (up to 12 kW)" },
  { value: "60", label: "60A High Power (up to 14.4 kW)" },
];

const panelOptions = [
  { value: "100", label: "100A or less" },
  { value: "150", label: "150A main" },
  { value: "200", label: "200A or greater" },
];

const loadOptions = [
  { value: "ev", label: "Existing EV charger", demand: 9600 },
  { value: "range", label: "Electric range / oven", demand: 8000 },
  { value: "dryer", label: "Electric dryer", demand: 5000 },
  { value: "ac", label: "Central air conditioning", demand: 6000 },
  { value: "heatpump", label: "Heat pump or electric heat", demand: 9000 },
  { value: "pool", label: "Pool heater / hot tub", demand: 10000 },
];

const timelineOptions = [
  { value: "asap", label: "Ready to install in the next 30 days" },
  { value: "soon", label: "Planning for the next 2-3 months" },
  { value: "exploring", label: "Just researching options" },
];

const EVCharger = () => {
  const [selectedAmp, setSelectedAmp] = useState(ampOptions[0].value);
  const [runLength, setRunLength] = useState("25");
  const [panelCapacity, setPanelCapacity] = useState(panelOptions[1].value);
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const [squareFootage, setSquareFootage] = useState("2200");
  const [selectedLoads, setSelectedLoads] = useState<string[]>([]);
  const [loadResult, setLoadResult] = useState<{
    totalDemand: number;
    recommendedService: string;
    advisory: string;
  } | null>(null);

  const [preQual, setPreQual] = useState({
    homeowner: "yes",
    panelSpace: "unsure",
    timeline: timelineOptions[0].value,
    preferredContact: "phone",
  });
  const [preQualSubmitted, setPreQualSubmitted] = useState(false);

  const estimatedCost = useMemo(() => {
    const baseCostMap: Record<string, number> = { "40": 1200, "50": 1550, "60": 1850 };
    const panelAdderMap: Record<string, number> = { "100": 1800, "150": 900, "200": 0 };

    const run = Math.max(0, Number.isFinite(Number(runLength)) ? Number(runLength) : 0);
    const additionalRunCost = Math.max(0, run - 20) * 18;
    const materialSurcharge = selectedAmp === "60" ? 250 : 0;

    const subtotal =
      (baseCostMap[selectedAmp] ?? 1200) +
      additionalRunCost +
      (panelAdderMap[panelCapacity] ?? 0) +
      materialSurcharge;

    const low = Math.round((subtotal * 0.9) / 50) * 50;
    const high = Math.round((subtotal * 1.15) / 50) * 50;

    return { low, high, subtotal };
  }, [panelCapacity, runLength, selectedAmp]);

  const selectedLoadDemand = useMemo(
    () =>
      selectedLoads.reduce((total, load) => {
        const option = loadOptions.find((item) => item.value === load);
        return total + (option?.demand ?? 0);
      }, 0),
    [selectedLoads]
  );

  const estimatedService = useMemo(() => {
    const sqft = Math.max(0, Number(squareFootage) || 0);
    const baseDemand = sqft * 3.5; // NEC general lighting load approximation
    const totalDemand = baseDemand + selectedLoadDemand + Number(selectedAmp) * 240 * 0.8;
    const calculatedAmps = Math.ceil(totalDemand / 240);

    let recommendedService = "200A Service";
    let advisory = "Your current panel likely has the headroom for a Level 2 charger.";

    if (calculatedAmps > 260) {
      recommendedService = "320A / 400A Service";
      advisory = "A heavy-up to 320A or 400A gives you flexibility for future electrification.";
    } else if (calculatedAmps > 215) {
      recommendedService = "300A Service";
      advisory = "Consider a 300A upgrade to keep large appliances and EV charging running together.";
    } else if (calculatedAmps > 180) {
      recommendedService = "225A Service";
      advisory = "A modest panel upgrade ensures simultaneous EV charging and HVAC operation.";
    }

    return { totalDemand, calculatedAmps, recommendedService, advisory };
  }, [selectedAmp, selectedLoadDemand, squareFootage]);

  const handleEstimatorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEstimate({ low: estimatedCost.low, high: estimatedCost.high });
  };

  const handleLoadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadResult({
      totalDemand: estimatedService.totalDemand,
      recommendedService: estimatedService.recommendedService,
      advisory: estimatedService.advisory,
    });
  };

  const toggleLoad = (value: string) => {
    setSelectedLoads((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleLeadCapture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeadSubmitted(true);
  };

  const handlePreQualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPreQualSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70" aria-hidden="true">
            <img
              src="/lovable-uploads/130c4fb5-1384-416b-a335-4fc8b7562611.png"
              // alt={generateAltText("/lovable-uploads/130c4fb5-1384-416b-a335-4fc8b7562611.png","Background photo of an EV charging port")}
              alt="Background photo of an EV charging port"
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Car className="w-16 h-16 mx-auto mb-6 text-electric-400 drop-shadow-lg" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                EV Charger Installation Services
              </h1>
              <p className="text-xl text-electric-100 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Power Your Electric Vehicle with Confidence
              </p>
              <p className="text-lg text-white mb-8 leading-relaxed bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                As electric vehicles (EVs) become the future of transportation, having a reliable,
                at-home or commercial charging solution is essential. At Berman Electric, we
                specialize in EV charger installations for homes, businesses, and commercial
                properties across Long Island.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="py-24 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Our EV Charger Installation Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-electric-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estimator & Lead Capture */}
        <div className="py-24 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calculator className="w-6 h-6 text-electric-600" />
                    EV Charger Budget Estimator
                  </CardTitle>
                  <CardDescription>
                    Dial in your project scope to see a realistic turnkey budget before we visit your home.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleEstimatorSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="ampacity">Charger amperage</Label>
                      <Select value={selectedAmp} onValueChange={setSelectedAmp}>
                        <SelectTrigger id="ampacity">
                          <SelectValue placeholder="Select amperage" />
                        </SelectTrigger>
                        <SelectContent>
                          {ampOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="run-length">Approximate run length (feet)</Label>
                      <Input
                        id="run-length"
                        type="number"
                        min={0}
                        value={runLength}
                        onChange={(e) => setRunLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panel">Main panel capacity</Label>
                      <Select value={panelCapacity} onValueChange={setPanelCapacity}>
                        <SelectTrigger id="panel">
                          <SelectValue placeholder="Select panel" />
                        </SelectTrigger>
                        <SelectContent>
                          {panelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Calculate Estimated Budget
                    </Button>
                  </form>
                  <div className="mt-6 rounded-lg border border-dashed border-electric-400 bg-electric-50/80 p-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-electric-700">Projected turnkey range</p>
                    <p className="text-3xl font-bold text-electric-900 mt-2">
                      ${estimatedCost.low.toLocaleString()} – ${estimatedCost.high.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Includes materials, permitting, testing and typical Long Island labor. We verify everything during a site visit.
                    </p>
                    {estimate && (
                      <p className="mt-4 text-sm text-gray-700">
                        Your inputs suggest a total project budget around ${estimate.low.toLocaleString()} to ${estimate.high.toLocaleString()}.
                        If panel upgrades are required we will confirm the final scope on-site.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <ClipboardList className="w-6 h-6 text-electric-600" />
                    Reserve Your Spot
                  </CardTitle>
                  <CardDescription>
                    Share a few details and our EV concierge will reach out with a tailored proposal within one business day.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleLeadCapture}>
                    <div className="space-y-2">
                      <Label htmlFor="lead-name">Full name</Label>
                      <Input
                        id="lead-name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-email">Email</Label>
                      <Input
                        id="lead-email"
                        type="email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-phone">Phone</Label>
                      <Input
                        id="lead-phone"
                        type="tel"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-notes">Project notes</Label>
                      <Textarea
                        id="lead-notes"
                        placeholder="Example: Detached garage ~60 ft away, need installation by May."
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, notes: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Request Detailed Quote
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  {leadSubmitted ? (
                    <p className="text-sm text-green-700">
                      Thank you! A master electrician will review your information and reach out shortly.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      We keep your info private and only use it to schedule your consultation.
                    </p>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Load Calculation Mini App */}
        <div className="py-24 bg-gray-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Whole-Home Load Check</CardTitle>
                  <CardDescription>
                    See how your new charger impacts your service size using NEC-style calculations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleLoadSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="square-footage">Home square footage</Label>
                        <Input
                          id="square-footage"
                          type="number"
                          min={0}
                          value={squareFootage}
                          onChange={(e) => setSquareFootage(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-electric-700">
                          Major electric loads
                        </p>
                        <div className="space-y-3">
                          {loadOptions.map((option) => {
                            const id = `load-${option.value}`;
                            const isChecked = selectedLoads.includes(option.value);
                            return (
                              <label key={option.value} htmlFor={id} className="flex items-start gap-3 text-sm text-gray-700">
                                <Checkbox
                                  id={id}
                                  checked={isChecked}
                                  onCheckedChange={() => toggleLoad(option.value)}
                                />
                                <span>
                                  <span className="font-medium text-gray-900">{option.label}</span>
                                  <span className="block text-xs text-gray-500">Adds about {(option.demand / 1000).toFixed(1)} kW</span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="text-sm uppercase tracking-wide text-gray-500">Projected demand</p>
                        <p className="text-3xl font-bold text-electric-700 mt-2">
                          {(estimatedService.totalDemand / 1000).toFixed(1)} kVA
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Includes general lighting load, major appliances and your new {ampOptions.find((i) => i.value === selectedAmp)?.label.toLowerCase()}.
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Calculated service amps</span>
                            <span className="font-semibold text-gray-900">{estimatedService.calculatedAmps}A</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Safety margin</span>
                            <span className="font-semibold text-gray-900">{Math.max(0, 200 - estimatedService.calculatedAmps)}A</span>
                          </div>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Check Service Recommendation
                      </Button>
                      {loadResult && (
                        <div className="rounded-lg border border-electric-200 bg-electric-50/80 p-6">
                          <p className="text-sm font-semibold uppercase tracking-wide text-electric-700">
                            Suggested upgrade path
                          </p>
                          <p className="text-2xl font-bold text-electric-900 mt-2">{loadResult.recommendedService}</p>
                          <p className="text-sm text-gray-700 mt-2">{loadResult.advisory}</p>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="py-24 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calendar className="w-6 h-6 text-electric-600" />
                    Book Your On-Site Assessment
                  </CardTitle>
                  <CardDescription>
                    Answer three quick questions to confirm we’re the right fit and unlock our live scheduling calendar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5" onSubmit={handlePreQualSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="homeowner">Are you the property owner?</Label>
                      <Select
                        value={preQual.homeowner}
                        onValueChange={(value) => setPreQual((prev) => ({ ...prev, homeowner: value }))}
                      >
                        <SelectTrigger id="homeowner">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes, I own the property</SelectItem>
                          <SelectItem value="no">No, I’m renting / representing someone else</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panel-space">Do you have available breaker spaces?</Label>
                      <Select
                        value={preQual.panelSpace}
                        onValueChange={(value) => setPreQual((prev) => ({ ...prev, panelSpace: value }))}
                      >
                        <SelectTrigger id="panel-space">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes, there’s room in the panel</SelectItem>
                          <SelectItem value="unsure">Not sure / need guidance</SelectItem>
                          <SelectItem value="no">No, the panel is full</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">When would you like installation?</Label>
                      <Select
                        value={preQual.timeline}
                        onValueChange={(value) => setPreQual((prev) => ({ ...prev, timeline: value }))}
                      >
                        <SelectTrigger id="timeline">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timelineOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-method">Preferred contact method</Label>
                      <Select
                        value={preQual.preferredContact}
                        onValueChange={(value) => setPreQual((prev) => ({ ...prev, preferredContact: value }))}
                      >
                        <SelectTrigger id="contact-method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone call</SelectItem>
                          <SelectItem value="text">Text message</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Unlock Calendar
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-600">
                    We use your responses to match you with the right electrician and prepare for your visit.
                  </p>
                </CardFooter>
              </Card>
              <div className="space-y-6">
                <div className="rounded-xl border border-electric-200 bg-electric-50/70 p-8">
                  <h3 className="text-2xl font-semibold text-electric-900">What happens next?</h3>
                  <ul className="mt-4 space-y-3 text-gray-700">
                    <li>• Pre-visit phone consult to verify charger location and equipment.</li>
                    <li>• Licensed electrician on-site to confirm load calculations and permit requirements.</li>
                    <li>• Written proposal with fixed pricing and utility rebate guidance.</li>
                  </ul>
                </div>
                {preQualSubmitted ? (
                  <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <iframe
                      title="Berman Electric EV Charger Calendar"
                      src="https://calendly.com/berman-electric/ev-charger-consult?hide_event_type_details=1&hide_gdpr_banner=1"
                      className="h-[500px] w-full"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                    Complete the quick pre-qualification to reveal our live scheduling calendar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">Why Install an EV Charger at Home?</h2>
              <div className="bg-gray-50 rounded-xl shadow-lg p-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                    <Zap className="w-6 h-6 text-electric-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-24 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Berman Electric?</h2>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                    <Shield className="w-6 h-6 text-electric-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-electric-600">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Get Your EV Charger Installed Today!</h2>
              <p className="text-lg text-white/90 mb-8">
                Whether you need a home charging station, commercial fleet setup, or multi-unit
                EV solution, Berman Electric is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 text-electric-700 bg-white rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-300 focus-visible:ring-offset-2 focus-visible:ring-offset-electric-600"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us: (516) 361-4068
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-electric-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request a Free Quote
                </Link>
              </div>
              <p className="text-white/90 mt-8 font-semibold">
                Power Up Your Drive with Berman Electric – Your Trusted EV Charger Installation Experts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EVCharger;
