import { useState } from "react";
import { Calculator, ChevronRight, DollarSign, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  maxPrice: number;
  unit: string;
  description: string;
  factors: string[];
}

const services: ServiceOption[] = [
  {
    id: "outlet",
    name: "Outlet Installation",
    basePrice: 150,
    maxPrice: 350,
    unit: "per outlet",
    description: "Standard 120V outlet installation",
    factors: ["Location accessibility", "Wire run distance", "Existing wiring condition"]
  },
  {
    id: "panel-upgrade",
    name: "Panel Upgrade",
    basePrice: 1500,
    maxPrice: 4500,
    unit: "total",
    description: "Upgrade to 200A electrical panel",
    factors: ["Current panel size", "Permit requirements", "Meter base upgrade"]
  },
  {
    id: "ev-charger",
    name: "EV Charger Installation",
    basePrice: 800,
    maxPrice: 2500,
    unit: "total",
    description: "Level 2 EV charger installation",
    factors: ["Panel capacity", "Distance from panel", "Charger type"]
  },
  {
    id: "lighting",
    name: "Recessed Lighting",
    basePrice: 150,
    maxPrice: 300,
    unit: "per light",
    description: "LED recessed light installation",
    factors: ["Ceiling type", "Insulation", "Switch configuration"]
  },
  {
    id: "ceiling-fan",
    name: "Ceiling Fan Installation",
    basePrice: 175,
    maxPrice: 400,
    unit: "per fan",
    description: "Ceiling fan with light kit",
    factors: ["Existing box type", "Height of ceiling", "Wiring condition"]
  },
  {
    id: "generator",
    name: "Generator Installation",
    basePrice: 3000,
    maxPrice: 15000,
    unit: "total",
    description: "Whole-home standby generator",
    factors: ["Generator size", "Transfer switch type", "Gas line requirements"]
  }
];

const CostEstimator = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [quantity, setQuantity] = useState<number[]>([1]);
  const [complexity, setComplexity] = useState<"simple" | "moderate" | "complex">("moderate");
  const [isOpen, setIsOpen] = useState(false);

  const service = services.find(s => s.id === selectedService);
  
  const calculateEstimate = () => {
    if (!service) return { low: 0, high: 0 };
    
    const complexityMultiplier = {
      simple: 0.8,
      moderate: 1,
      complex: 1.3
    };
    
    const multiplier = complexityMultiplier[complexity];
    const qty = service.unit === "total" ? 1 : quantity[0];
    
    const low = Math.round(service.basePrice * multiplier * qty);
    const high = Math.round(service.maxPrice * multiplier * qty);
    
    return { low, high };
  };

  const estimate = calculateEstimate();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-electric-200 hover:bg-electric-50 hover:border-electric-400"
        >
          <Calculator className="w-4 h-4" />
          Get Instant Estimate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calculator className="w-5 h-5 text-electric-600" />
            Cost Estimator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Service</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {service && (
            <>
              {/* Service Description */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>

              {/* Quantity (if applicable) */}
              {service.unit !== "total" && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Quantity</label>
                    <span className="text-sm font-semibold text-electric-600">{quantity[0]} {service.unit.replace("per ", "")}{quantity[0] > 1 ? "s" : ""}</span>
                  </div>
                  <Slider
                    value={quantity}
                    onValueChange={setQuantity}
                    min={1}
                    max={10}
                    step={1}
                    className="py-2"
                  />
                </div>
              )}

              {/* Complexity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Job Complexity</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Complexity factors include: {service.factors.join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["simple", "moderate", "complex"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setComplexity(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        complexity === level
                          ? "bg-electric-600 text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimate Result */}
              <div className="bg-gradient-to-br from-electric-50 to-electric-100 rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Estimated Cost</p>
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-electric-700">
                  <DollarSign className="w-6 h-6" />
                  <span>{estimate.low.toLocaleString()}</span>
                  <span className="text-muted-foreground">-</span>
                  <span>${estimate.high.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  *Final price may vary based on site inspection
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gap-2">
                    Get Exact Quote
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="tel:+15163614068">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call for Immediate Quote
                  </Button>
                </a>
              </div>
            </>
          )}

          {!service && (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Select a service to see estimated costs</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CostEstimator;