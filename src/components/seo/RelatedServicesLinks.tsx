import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { serviceLinks, findRelatedServices } from "@/data/internalLinks";

interface RelatedServicesLinksProps {
  currentContent?: string;
  currentSlug?: string;
  townName?: string;
  className?: string;
}

const RelatedServicesLinks = ({ 
  currentContent = "", 
  currentSlug,
  townName,
  className = ""
}: RelatedServicesLinksProps) => {
  // Find related services based on page content
  const relatedServices = currentContent 
    ? findRelatedServices(currentContent, currentSlug)
    : serviceLinks.filter(s => s.slug !== currentSlug).slice(0, 3);

  if (relatedServices.length === 0) return null;

  return (
    <div className={`bg-muted/30 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        {townName ? `Our Services in ${townName}` : "Related Services"}
      </h3>
      <div className="grid gap-3">
        {relatedServices.map((service) => (
          <Link
            key={service.slug}
            to={service.slug}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <div>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {townName ? `${service.name} in ${townName}` : service.name}
              </span>
              <p className="text-sm text-muted-foreground mt-0.5">
                {service.description}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedServicesLinks;
