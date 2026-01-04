import { Link } from "react-router-dom";
import { FileText, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface ElectricalCodesSectionProps {
  town: TownData;
}

const ElectricalCodesSection = ({ town }: ElectricalCodesSectionProps) => {
  if (!town.electricalCodes || town.electricalCodes.length === 0) {
    return null;
  }

  // Determine county for linking
  const isNassauCounty = ['garden-city', 'great-neck', 'manhasset', 'port-washington', 'roslyn', 'oyster-bay', 'glen-cove', 'hempstead', 'freeport', 'long-beach', 'valley-stream', 'mineola', 'westbury', 'new-hyde-park', 'floral-park'].includes(town.slug);

  return (
    <section className="bg-muted rounded-2xl p-8" id="permits">
      <div className="mx-auto max-w-3xl text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {town.name} Electrical Permits & Code Requirements
        </h2>
        <p className="mt-4 text-muted-foreground">
          Understanding local electrical codes is essential for safe, compliant work. 
          Berman Electric handles all permits and inspections for {town.name} projects.
        </p>
      </div>

      {/* Compliance badge */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Licensed & Compliant in {town.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              Berman Electric holds all necessary licenses for {town.name} and stays current with local code amendments. 
              We handle permit applications, inspections, and final sign-offs so your project proceeds without delays.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {town.electricalCodes.map((code, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {code.topic}
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Requirement:
                    </span>
                    <p className="mt-1 text-foreground">{code.requirement}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Details:
                    </span>
                    <p className="mt-1 text-muted-foreground text-sm">{code.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permit CTA */}
      <div className="mt-8 bg-card border border-primary/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Need Help with {town.name} Permits?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We handle the entire permit process—applications, inspections, and final approval.
              </p>
            </div>
          </div>
          <a
            href="tel:+15163614068"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            Call for Permit Help
          </a>
        </div>
      </div>

      {/* Link to county code guide */}
      <div className="mt-6 text-center">
        <Link 
          to={isNassauCounty ? "/blog/nassau-county-electrical-codes-2024" : "/blog/suffolk-county-electrical-codes-guide"}
          className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
        >
          Read our complete {isNassauCounty ? "Nassau" : "Suffolk"} County electrical code guide →
        </Link>
      </div>
    </section>
  );
};

export default ElectricalCodesSection;
