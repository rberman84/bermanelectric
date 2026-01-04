import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { allTowns, buildTownPath } from "@/lib/townContent";

interface ServiceTownLinksProps {
  serviceName: string;
  maxTowns?: number;
}

/**
 * ServiceTownLinks - Provides internal links from service pages to town pages
 * Implements the SEO requirement: "Every service page must link to 8–12 town pages"
 */
const ServiceTownLinks = ({ serviceName, maxTowns = 12 }: ServiceTownLinksProps) => {
  // Get a mix of Suffolk and Nassau towns
  const suffolkTowns = allTowns.filter(t => 
    !['garden-city', 'great-neck', 'manhasset', 'port-washington', 'roslyn', 'oyster-bay', 'glen-cove', 'hempstead', 'freeport', 'long-beach', 'valley-stream', 'mineola', 'westbury', 'new-hyde-park', 'floral-park'].includes(t.slug)
  );
  const nassauTowns = allTowns.filter(t => 
    ['garden-city', 'great-neck', 'manhasset', 'port-washington', 'roslyn', 'oyster-bay', 'glen-cove', 'hempstead', 'freeport', 'long-beach', 'valley-stream', 'mineola', 'westbury', 'new-hyde-park', 'floral-park'].includes(t.slug)
  );

  // Take half from each county
  const halfMax = Math.ceil(maxTowns / 2);
  const selectedTowns = [
    ...suffolkTowns.slice(0, halfMax),
    ...nassauTowns.slice(0, halfMax)
  ].slice(0, maxTowns);

  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {serviceName} Across Long Island
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide {serviceName.toLowerCase()} in every community across Nassau County and Suffolk County. 
            Click your town below for local service information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {selectedTowns.map((town) => (
            <Link
              key={town.slug}
              to={buildTownPath(town.slug)}
              className="group flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary hover:shadow-md transition-all"
            >
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors block truncate">
                  {town.name} Electrician
                </span>
                <span className="text-xs text-muted-foreground">
                  {serviceName}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/locations"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <MapPin className="w-5 h-5" />
            View All {allTowns.length}+ Service Areas
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceTownLinks;
