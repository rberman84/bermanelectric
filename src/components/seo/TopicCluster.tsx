import { Link } from "react-router-dom";

interface TopicClusterLink {
  title: string;
  url: string;
  description?: string;
  isPillar?: boolean;
}

interface TopicClusterProps {
  pillarPage: TopicClusterLink;
  clusterPages: TopicClusterLink[];
  currentUrl?: string;
  className?: string;
}

/**
 * TopicCluster - Implements hub-and-spoke content architecture
 * Creates strong topical authority signals for SEO
 */
const TopicCluster = ({
  pillarPage,
  clusterPages,
  currentUrl,
  className = ''
}: TopicClusterProps) => {
  const isCurrentPage = (url: string) => currentUrl === url;

  return (
    <nav className={`bg-card border border-border rounded-xl p-6 ${className}`} aria-label="Topic cluster navigation">
      {/* Pillar Page Link */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Main Topic
        </span>
        {isCurrentPage(pillarPage.url) ? (
          <h2 className="text-xl font-bold text-foreground mt-1">
            {pillarPage.title}
          </h2>
        ) : (
          <Link
            to={pillarPage.url}
            className="block text-xl font-bold text-primary hover:text-primary/80 transition-colors mt-1"
          >
            {pillarPage.title}
          </Link>
        )}
        {pillarPage.description && (
          <p className="text-sm text-muted-foreground mt-1">{pillarPage.description}</p>
        )}
      </div>

      {/* Cluster Pages */}
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Related Topics
        </span>
        <ul className="mt-3 space-y-3">
          {clusterPages.map((page, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {isCurrentPage(page.url) ? (
                <span className="text-foreground font-medium">{page.title}</span>
              ) : (
                <Link
                  to={page.url}
                  className="text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  {page.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Pre-defined topic clusters for the site
export const electricalTopicClusters = {
  residential: {
    pillarPage: {
      title: "Residential Electrical Services",
      url: "/residential",
      description: "Complete guide to home electrical services on Long Island"
    },
    clusterPages: [
      { title: "Panel Upgrades", url: "/residential#panel-upgrades" },
      { title: "Lighting Installation", url: "/residential#lighting" },
      { title: "Smart Home Wiring", url: "/blog/smart-home-electrical-upgrades" },
      { title: "Electrical Safety Tips", url: "/blog/electrical-safety-tips-long-island-homeowners" },
      { title: "When to Upgrade Your Panel", url: "/blog/when-to-upgrade-electrical-panel" }
    ]
  },
  evCharger: {
    pillarPage: {
      title: "EV Charger Installation",
      url: "/ev-charger",
      description: "Everything you need to know about EV charging at home"
    },
    clusterPages: [
      { title: "EV Charger Installation Guide", url: "/blog/ev-charger-installation-guide-long-island" },
      { title: "Level 2 vs Level 1 Chargers", url: "/ev-charger#comparison" },
      { title: "Electrical Panel Requirements", url: "/ev-charger#panel-requirements" },
      { title: "Tesla Wall Connector", url: "/ev-charger#tesla" },
      { title: "NY Incentives & Rebates", url: "/ev-charger#incentives" }
    ]
  },
  emergency: {
    pillarPage: {
      title: "24/7 Emergency Electrical Services",
      url: "/emergency",
      description: "Fast response electrical emergency services on Long Island"
    },
    clusterPages: [
      { title: "Power Outage Help", url: "/emergency#power-outage" },
      { title: "Hurricane Preparedness", url: "/blog/hurricane-electrical-preparedness-long-island" },
      { title: "Electrical Fire Safety", url: "/emergency#fire-safety" },
      { title: "Generator Installation", url: "/emergency#generators" }
    ]
  },
  commercial: {
    pillarPage: {
      title: "Commercial Electrical Services",
      url: "/commercial",
      description: "Professional electrical services for Long Island businesses"
    },
    clusterPages: [
      { title: "Office Electrical", url: "/commercial#office" },
      { title: "Retail & Restaurant", url: "/commercial#retail" },
      { title: "Industrial Electrical", url: "/commercial#industrial" },
      { title: "Commercial Lighting", url: "/commercial#lighting" },
      { title: "Code Compliance", url: "/blog/suffolk-county-electrical-codes-guide" }
    ]
  }
};

export default TopicCluster;
