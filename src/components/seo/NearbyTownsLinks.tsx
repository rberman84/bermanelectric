import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

interface NearbyTown {
  name: string;
  slug: string;
  url: string;
}

interface NearbyTownsLinksProps {
  currentTown: string;
  county: 'nassau' | 'suffolk';
  nearbyTowns: NearbyTown[];
  className?: string;
}

const NearbyTownsLinks = ({ 
  currentTown, 
  county,
  nearbyTowns,
  className = ""
}: NearbyTownsLinksProps) => {
  if (nearbyTowns.length === 0) return null;

  const countyName = county === 'nassau' ? 'Nassau County' : 'Suffolk County';

  return (
    <div className={`bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Electricians Near {currentTown}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        We also serve these {countyName} communities:
      </p>
      <div className="flex flex-wrap gap-2">
        {nearbyTowns.map((town) => (
          <Link
            key={town.slug}
            to={town.url}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-full border border-border/50 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all group"
          >
            {town.name}
            <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        ))}
      </div>
      <Link
        to={`/${county}-county`}
        className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
      >
        View all {countyName} service areas
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};

export default NearbyTownsLinks;
