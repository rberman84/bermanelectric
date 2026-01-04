import { AlertTriangle, Wrench, FileCheck, DollarSign, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface LongIslandIssue {
  title: string;
  description: string;
  solution: string;
}

interface ServiceLongIslandSectionProps {
  serviceType: "residential" | "commercial";
  issues: LongIslandIssue[];
}

/**
 * ServiceLongIslandSection - Long Island specific content for service pages
 * Addresses: "Common issues in Long Island homes" and "Code/inspection process"
 */
const ServiceLongIslandSection = ({ serviceType, issues }: ServiceLongIslandSectionProps) => {
  const isResidential = serviceType === "residential";

  return (
    <section className="py-16 bg-card">
      <div className="container">
        {/* Common Issues */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Common {isResidential ? "Home" : "Business"} Electrical Issues on Long Island
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isResidential 
                ? "Long Island homes face unique electrical challenges due to aging infrastructure, coastal conditions, and increasing power demands."
                : "Long Island businesses encounter specific electrical challenges from older commercial buildings, high-demand equipment, and code requirements."
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue, index) => (
              <div key={index} className="bg-background rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-foreground">{issue.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                <div className="flex items-start gap-2 text-sm">
                  <Wrench className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{issue.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code & Inspection Process */}
        <div className="bg-muted rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <FileCheck className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Long Island Electrical Codes & Inspection Process
              </h2>
              <p className="text-muted-foreground mt-2">
                {isResidential 
                  ? "Nassau and Suffolk County have specific permit requirements for residential electrical work. Understanding the process ensures your project is safe and compliant."
                  : "Commercial electrical projects in Nassau and Suffolk County require permits, inspections, and code compliance. Our team handles the entire process."
                }
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg text-foreground mb-3">Nassau County</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Permits required for panel upgrades, new circuits, service changes</li>
                <li>• Inspections at rough-in and final stages</li>
                <li>• NEC 2020 adopted with local amendments</li>
                <li>• Licensed electrician required for all permitted work</li>
              </ul>
              <Link 
                to="/blog/nassau-county-electrical-codes-2024" 
                className="inline-block mt-4 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Nassau County Code Guide →
              </Link>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg text-foreground mb-3">Suffolk County</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Town-level permit requirements vary by municipality</li>
                <li>• PSEG Long Island coordination for service upgrades</li>
                <li>• Fire marshal approval for commercial installations</li>
                <li>• Special requirements for waterfront properties</li>
              </ul>
              <Link 
                to="/blog/suffolk-county-electrical-codes-guide" 
                className="inline-block mt-4 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Suffolk County Code Guide →
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              <strong>Berman Electric handles all permits and inspections</strong>—we submit applications, schedule inspections, and ensure your project passes on the first try.
            </p>
          </div>
        </div>

        {/* Cost Drivers */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <DollarSign className="w-6 h-6" />
              <span className="font-semibold uppercase tracking-wide text-sm">Transparent Pricing</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              What Affects {isResidential ? "Residential" : "Commercial"} Electrical Costs?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide upfront pricing with no hidden fees. Here's what typically affects your project cost:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Scope of Work", desc: "Number of outlets, circuits, or fixtures needed" },
              { title: "Panel Capacity", desc: "Whether your panel needs an upgrade to handle new loads" },
              { title: "Access & Location", desc: "Ease of access to wiring routes and electrical components" },
              { title: "Permits Required", desc: "Permit fees and inspection coordination for your municipality" }
            ].map((item, index) => (
              <div key={index} className="bg-muted rounded-xl p-5 text-center">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              Get Free Estimate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceLongIslandSection;
