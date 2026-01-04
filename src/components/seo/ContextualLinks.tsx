import { Link } from "react-router-dom";
import { serviceLinks, findRelatedServices, findRelatedBlogPosts } from "@/data/internalLinks";

interface ContextualLinksProps {
  content: string;
  currentSlug?: string;
  showServices?: boolean;
  showBlogPosts?: boolean;
  className?: string;
  maxLinks?: number;
}

/**
 * ContextualLinks - Automatically generates relevant internal links based on content
 * Implements topic clustering for improved SEO authority
 */
const ContextualLinks = ({
  content,
  currentSlug,
  showServices = true,
  showBlogPosts = true,
  className = '',
  maxLinks = 4
}: ContextualLinksProps) => {
  const relatedServices = showServices ? findRelatedServices(content, currentSlug) : [];
  const relatedBlogPosts = showBlogPosts ? findRelatedBlogPosts(content, maxLinks) : [];

  if (relatedServices.length === 0 && relatedBlogPosts.length === 0) {
    return null;
  }

  return (
    <aside className={`bg-secondary/50 rounded-xl p-6 ${className}`} aria-label="Related content">
      <h3 className="text-lg font-semibold text-foreground mb-4">Related Resources</h3>
      
      {relatedServices.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Our Services</h4>
          <ul className="space-y-2">
            {relatedServices.map(service => (
              <li key={service.slug}>
                <Link
                  to={service.slug}
                  className="text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  {service.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {relatedBlogPosts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Helpful Articles</h4>
          <ul className="space-y-2">
            {relatedBlogPosts.map(postSlug => (
              <li key={postSlug}>
                <Link
                  to={postSlug}
                  className="text-primary hover:text-primary/80 hover:underline transition-colors text-sm"
                >
                  {formatBlogTitle(postSlug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

// Helper to format blog slug to readable title
function formatBlogTitle(slug: string): string {
  return slug
    .replace('/blog/', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export { ContextualLinks, serviceLinks };
export default ContextualLinks;
