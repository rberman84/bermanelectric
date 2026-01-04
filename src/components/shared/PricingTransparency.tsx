import { Check, Shield, Clock, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const PricingTransparency = () => {
  const pricingTiers = [
    {
      name: "Service Call",
      price: "$99",
      priceNote: "starting at",
      description: "Diagnostic & repair visits for quick fixes",
      popular: false,
      features: [
        "Same-day availability",
        "Expert troubleshooting",
        "Upfront pricing before work",
        "Licensed & insured technician",
        "1-year workmanship warranty",
      ],
    },
    {
      name: "Panel Upgrade",
      price: "$1,200",
      priceNote: "from",
      description: "Complete electrical panel replacement",
      popular: true,
      features: [
        "200-amp capacity upgrade",
        "Code-compliant installation",
        "All permits included",
        "Whole-home surge protection",
        "10-year parts warranty",
        "Priority scheduling",
      ],
    },
    {
      name: "Full Rewire",
      price: "Custom",
      priceNote: "quote",
      description: "Comprehensive whole-home rewiring",
      popular: false,
      features: [
        "Complete electrical assessment",
        "Modern wiring throughout",
        "Smart home ready",
        "All permits & inspections",
        "Lifetime workmanship warranty",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background via-cream-50 to-cream-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-electric-100 text-electric-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            No Hidden Fees Guarantee
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Transparent <span className="text-electric-600">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Know what you're paying before we start. Every project includes a detailed written estimate.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02]",
                tier.popular
                  ? "bg-foreground text-white shadow-2xl shadow-foreground/20 ring-4 ring-electric-500/50 lg:-my-4 lg:py-12"
                  : "bg-white border-2 border-gray-200 hover:border-electric-400 hover:shadow-xl"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-electric-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  tier.popular ? "text-white" : "text-foreground"
                )}>
                  {tier.name}
                </h3>
                <p className={cn(
                  "text-sm",
                  tier.popular ? "text-gray-300" : "text-muted-foreground"
                )}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={cn(
                  "text-xs uppercase tracking-wide",
                  tier.popular ? "text-gray-400" : "text-muted-foreground"
                )}>
                  {tier.priceNote}
                </span>
                <div className={cn(
                  "text-5xl font-bold",
                  tier.popular ? "text-electric-400" : "text-electric-600"
                )}>
                  {tier.price}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                      tier.popular ? "bg-electric-500" : "bg-electric-100"
                    )}>
                      <Check className={cn(
                        "w-3 h-3",
                        tier.popular ? "text-white" : "text-electric-600"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm",
                      tier.popular ? "text-gray-200" : "text-gray-600"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={cn(
                  "block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all",
                  tier.popular
                    ? "bg-electric-500 text-white hover:bg-electric-400 shadow-lg shadow-electric-500/30"
                    : "bg-foreground text-white hover:bg-foreground/90"
                )}
              >
                Get Free Quote
              </Link>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-electric-600" />
            <span>Free estimates within 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-electric-600" />
            <span>Price-match guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-electric-600" />
            <span>Financing available</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTransparency;
