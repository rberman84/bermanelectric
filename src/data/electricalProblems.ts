export interface ElectricalProblem {
  slug: string;
  name: string;
  urgency: "emergency" | "urgent" | "routine";
  description: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  preventionTips: string[];
  estimatedCost: string;
  timeToFix: string;
  safetyWarning?: string;
}

export const electricalProblems: ElectricalProblem[] = [
  {
    slug: "power-outage",
    name: "Power Outage",
    urgency: "emergency",
    description: "Complete loss of electrical power affecting part or all of your property",
    symptoms: [
      "No lights or appliances working",
      "Digital clocks are reset",
      "GFCI outlets tripped",
      "Main breaker switched off"
    ],
    causes: [
      "Tripped circuit breaker",
      "Blown fuse",
      "Utility company outage",
      "Overloaded circuit",
      "Faulty electrical panel"
    ],
    solutions: [
      "Check main breaker panel",
      "Reset tripped breakers",
      "Call utility company to verify service",
      "Professional electrical inspection",
      "Panel upgrade if needed"
    ],
    preventionTips: [
      "Regular electrical inspections",
      "Avoid overloading circuits",
      "Upgrade outdated electrical panels",
      "Install whole-house surge protection"
    ],
    estimatedCost: "$150 - $500",
    timeToFix: "1-3 hours",
    safetyWarning: "Do not attempt repairs if you smell burning or see sparks. Evacuate and call 911 immediately."
  },
  {
    slug: "flickering-lights",
    name: "Flickering Lights",
    urgency: "urgent",
    description: "Lights that flicker, dim, or brighten unexpectedly",
    symptoms: [
      "Lights dim when appliances turn on",
      "Bulbs flicker intermittently",
      "Lights brighten and dim randomly",
      "Multiple lights affected simultaneously"
    ],
    causes: [
      "Loose wiring connections",
      "Overloaded circuit",
      "Faulty light fixture",
      "Voltage fluctuations",
      "Outdated electrical panel"
    ],
    solutions: [
      "Tighten wire connections",
      "Replace faulty switches",
      "Redistribute electrical load",
      "Upgrade electrical service",
      "Install voltage stabilizer"
    ],
    preventionTips: [
      "Schedule annual electrical inspections",
      "Avoid daisy-chaining power strips",
      "Consider dedicated circuits for high-power appliances",
      "Upgrade to LED bulbs for better stability"
    ],
    estimatedCost: "$100 - $400",
    timeToFix: "30 minutes - 2 hours"
  },
  {
    slug: "circuit-breaker-tripping",
    name: "Circuit Breaker Keeps Tripping",
    urgency: "urgent",
    description: "Circuit breaker repeatedly trips, cutting power to specific areas",
    symptoms: [
      "Breaker switches to OFF position frequently",
      "Power loss to specific rooms",
      "Breaker feels hot to touch",
      "Multiple appliances cause tripping"
    ],
    causes: [
      "Circuit overload",
      "Short circuit in wiring",
      "Ground fault",
      "Faulty breaker",
      "Damaged appliance cord"
    ],
    solutions: [
      "Reduce electrical load on circuit",
      "Replace faulty circuit breaker",
      "Repair or replace damaged wiring",
      "Add additional circuits",
      "Upgrade electrical panel capacity"
    ],
    preventionTips: [
      "Don't use multiple high-wattage devices on same circuit",
      "Install AFCI breakers for added protection",
      "Regular inspection of appliance cords",
      "Consider whole-home electrical upgrade"
    ],
    estimatedCost: "$150 - $600",
    timeToFix: "1-4 hours",
    safetyWarning: "Never bypass or disable a circuit breaker. This is a serious fire hazard."
  },
  {
    slug: "burning-smell",
    name: "Burning Smell from Outlets",
    urgency: "emergency",
    description: "Acrid burning odor coming from electrical outlets, switches, or panel",
    symptoms: [
      "Burning plastic smell",
      "Discolored or melted outlet covers",
      "Smoke visible from outlet",
      "Warm or hot outlet plates",
      "Buzzing or crackling sounds"
    ],
    causes: [
      "Overheated wiring",
      "Loose connections",
      "Overloaded circuit",
      "Faulty outlet",
      "Arcing electrical current"
    ],
    solutions: [
      "Immediately turn off power at breaker",
      "Emergency electrical inspection",
      "Replace damaged outlets and wiring",
      "Repair loose connections",
      "Install arc-fault circuit interrupters"
    ],
    preventionTips: [
      "Never ignore burning smells",
      "Avoid overloading outlets",
      "Replace outlets over 15 years old",
      "Schedule professional electrical inspections"
    ],
    estimatedCost: "$200 - $800",
    timeToFix: "2-6 hours",
    safetyWarning: "EMERGENCY SITUATION: Turn off power immediately. Do not use affected outlets. Call emergency electrician."
  },
  {
    slug: "no-power-to-outlet",
    name: "Outlet Not Working",
    urgency: "routine",
    description: "Electrical outlet has no power or only works intermittently",
    symptoms: [
      "No power to plugged-in devices",
      "Outlet only works sometimes",
      "Visible damage to outlet",
      "Loose outlet in wall",
      "GFCI outlet won't reset"
    ],
    causes: [
      "Tripped GFCI outlet",
      "Loose wire connection",
      "Faulty outlet",
      "Circuit breaker issue",
      "Damaged wiring behind outlet"
    ],
    solutions: [
      "Test and reset GFCI outlets",
      "Replace faulty outlet",
      "Tighten loose connections",
      "Repair damaged wiring",
      "Install new outlet if needed"
    ],
    preventionTips: [
      "Test GFCI outlets monthly",
      "Don't overload outlets",
      "Replace cracked or damaged outlets immediately",
      "Use surge protectors for sensitive electronics"
    ],
    estimatedCost: "$75 - $250",
    timeToFix: "30 minutes - 1.5 hours"
  },
  {
    slug: "sparking-outlet",
    name: "Sparking Electrical Outlet",
    urgency: "emergency",
    description: "Visible sparks coming from electrical outlets when plugging in devices",
    symptoms: [
      "Sparks when plugging in appliances",
      "Burnt marks around outlet",
      "Smell of ozone or burning",
      "Popping or crackling sounds",
      "Outlet feels hot"
    ],
    causes: [
      "Short circuit in wiring",
      "Damaged outlet",
      "Loose wire connections",
      "Water damage to outlet",
      "Improper installation"
    ],
    solutions: [
      "Stop using outlet immediately",
      "Turn off circuit breaker",
      "Professional electrical inspection",
      "Replace damaged outlet and wiring",
      "Install tamper-resistant outlets"
    ],
    preventionTips: [
      "Keep outlets dry",
      "Use GFCI outlets in wet areas",
      "Don't force plugs into outlets",
      "Replace damaged cords immediately"
    ],
    estimatedCost: "$150 - $500",
    timeToFix: "1-3 hours",
    safetyWarning: "FIRE HAZARD: Do not use sparking outlets. Turn off power and call emergency electrician immediately."
  },
  {
    slug: "electrical-shock",
    name: "Getting Shocked by Appliances",
    urgency: "emergency",
    description: "Experiencing electrical shocks when touching appliances or fixtures",
    symptoms: [
      "Tingling sensation when touching appliances",
      "Shock when touching metal fixtures",
      "Static-like shocks from outlets",
      "Buzzing sensation from switches"
    ],
    causes: [
      "Faulty ground connection",
      "Damaged appliance wiring",
      "Improper electrical grounding",
      "Reversed polarity in outlet",
      "Water intrusion in electrical system"
    ],
    solutions: [
      "Stop using affected appliances",
      "Professional electrical safety inspection",
      "Repair or replace faulty grounding",
      "Test all outlets for proper wiring",
      "Install GFCI protection"
    ],
    preventionTips: [
      "Ensure proper grounding system",
      "Use three-prong grounded outlets",
      "Install GFCI outlets in wet areas",
      "Regular electrical safety inspections"
    ],
    estimatedCost: "$200 - $800",
    timeToFix: "2-6 hours",
    safetyWarning: "SERIOUS SAFETY HAZARD: Electrical shocks can be fatal. Do not use affected appliances. Seek immediate professional help."
  },
  {
    slug: "high-electric-bill",
    name: "Unusually High Electric Bill",
    urgency: "routine",
    description: "Sudden unexplained increase in monthly electricity costs",
    symptoms: [
      "Bill 25%+ higher than normal",
      "Usage increased without explanation",
      "Meter spinning faster than usual",
      "Warm electrical panel"
    ],
    causes: [
      "Electrical system inefficiency",
      "Phantom power drain",
      "Faulty appliances",
      "Poor insulation causing HVAC overwork",
      "Outdated electrical system"
    ],
    solutions: [
      "Electrical energy audit",
      "Replace inefficient appliances",
      "Repair electrical leaks",
      "Upgrade to energy-efficient lighting",
      "Install smart power management"
    ],
    preventionTips: [
      "Use energy monitoring devices",
      "Unplug unused appliances",
      "Regular HVAC maintenance",
      "Upgrade to LED lighting throughout"
    ],
    estimatedCost: "$150 - $500 (for audit and minor repairs)",
    timeToFix: "2-4 hours"
  },
  {
    slug: "buzzing-sound",
    name: "Buzzing Electrical Sound",
    urgency: "urgent",
    description: "Audible buzzing, humming, or crackling from outlets, switches, or panel",
    symptoms: [
      "Buzzing from light switches",
      "Humming from electrical panel",
      "Crackling sound from outlets",
      "Vibrating electrical fixtures"
    ],
    causes: [
      "Loose wire connections",
      "Overloaded circuit",
      "Faulty dimmer switch",
      "Arcing electricity",
      "Transformer issues"
    ],
    solutions: [
      "Tighten all electrical connections",
      "Replace faulty switches",
      "Redistribute electrical load",
      "Install proper dimmer switches",
      "Professional wiring inspection"
    ],
    preventionTips: [
      "Use LED-compatible dimmers",
      "Avoid overloading circuits",
      "Regular electrical maintenance",
      "Replace old wiring"
    ],
    estimatedCost: "$100 - $450",
    timeToFix: "1-3 hours",
    safetyWarning: "Buzzing can indicate dangerous arcing. Do not ignore this warning sign."
  },
  {
    slug: "aluminum-wiring",
    name: "Aluminum Wiring Concerns",
    urgency: "urgent",
    description: "Homes with aluminum wiring (common 1960s-1970s) present fire hazards",
    symptoms: [
      "Home built between 1965-1975",
      "Aluminum visible in electrical panel",
      "Outlets feel warm",
      "Flickering lights",
      "Insurance company concerns"
    ],
    causes: [
      "Aluminum wire oxidation",
      "Loose connections at terminals",
      "Incompatible devices",
      "Wire expansion/contraction cycles"
    ],
    solutions: [
      "Professional aluminum wiring assessment",
      "COPALUM crimping connections",
      "AlumiConn connectors installation",
      "Complete copper rewiring (best solution)",
      "Specialized outlet/switch installation"
    ],
    preventionTips: [
      "Regular inspections by aluminum wiring specialist",
      "Never DIY aluminum wiring repairs",
      "Use only AL-rated devices",
      "Consider full rewiring for safety"
    ],
    estimatedCost: "$1,500 - $15,000+ (depending on solution)",
    timeToFix: "1 day - 2 weeks",
    safetyWarning: "Aluminum wiring is a serious fire hazard. Only qualified electricians should work on it."
  }
];

// Service mapping for URL structure
export const serviceKeywords: Record<string, string[]> = {
  "residential": ["electrician", "electrical-repair", "wiring-repair"],
  "emergency": ["emergency-electrician", "24-hour-electrician"],
  "panel-upgrades": ["panel-upgrade", "electrical-panel-repair", "breaker-panel"],
  "ev-charger": ["ev-charger-installation", "electric-vehicle-charging"],
  "lighting": ["lighting-installation", "light-fixture-repair"],
  "commercial": ["commercial-electrician", "commercial-electrical"],
};

export const getProblemsForService = (serviceSlug: string): ElectricalProblem[] => {
  // Return most relevant problems based on service
  switch (serviceSlug) {
    case "emergency":
      return electricalProblems.filter(p => p.urgency === "emergency");
    case "panel-upgrades":
      return electricalProblems.filter(p => 
        ["circuit-breaker-tripping", "power-outage", "aluminum-wiring", "high-electric-bill"].includes(p.slug)
      );
    case "residential":
      return electricalProblems.filter(p => 
        p.urgency !== "emergency" || p.slug === "power-outage"
      );
    default:
      return electricalProblems;
  }
};