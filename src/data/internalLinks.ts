// Internal linking data for SEO optimization
export interface ServiceLink {
  name: string;
  slug: string;
  keywords: string[];
  description: string;
}

export interface TownLink {
  name: string;
  slug: string;
  county: 'nassau' | 'suffolk';
  keywords: string[];
}

// Core service pages for internal linking
export const serviceLinks: ServiceLink[] = [
  {
    name: "Residential Electrical",
    slug: "/residential",
    keywords: ["home", "house", "residential", "panel upgrade", "outlet", "lighting", "rewiring", "smart home"],
    description: "Home electrical services including panel upgrades, lighting, and smart home wiring"
  },
  {
    name: "Commercial Electrical",
    slug: "/commercial",
    keywords: ["business", "commercial", "office", "retail", "warehouse", "restaurant", "industrial"],
    description: "Commercial electrical services for businesses across Long Island"
  },
  {
    name: "EV Charger Installation",
    slug: "/ev-charger",
    keywords: ["ev charger", "electric vehicle", "tesla", "charging station", "level 2", "chargepoint"],
    description: "Professional EV charger installation for homes and businesses"
  },
  {
    name: "Emergency Electrical",
    slug: "/emergency",
    keywords: ["emergency", "24/7", "power outage", "sparking", "electrical fire", "urgent"],
    description: "24/7 emergency electrical services across Long Island"
  }
];

// Blog post categories and common topics for linking
export const blogTopics = [
  { keyword: "panel upgrade", posts: ["/blog/when-to-upgrade-electrical-panel"] },
  { keyword: "electrical safety", posts: ["/blog/electrical-safety-tips-long-island-homeowners", "/blog/5-electrical-mistakes-homeowners-make-cost-thousands"] },
  { keyword: "ev charger", posts: ["/blog/ev-charger-installation-guide-long-island"] },
  { keyword: "smart home", posts: ["/blog/smart-home-electrical-upgrades"] },
  { keyword: "hurricane", posts: ["/blog/hurricane-electrical-preparedness-long-island"] },
  { keyword: "licensed electrician", posts: ["/blog/licensed-electricians-save-money"] },
  { keyword: "suffolk county codes", posts: ["/blog/suffolk-county-electrical-codes-guide"] },
  { keyword: "nassau county codes", posts: ["/blog/nassau-county-electrical-codes-2024"] }
];

// Find related services based on content keywords
export function findRelatedServices(content: string, currentSlug?: string): ServiceLink[] {
  const lowerContent = content.toLowerCase();
  return serviceLinks
    .filter(service => service.slug !== currentSlug)
    .filter(service => 
      service.keywords.some(keyword => lowerContent.includes(keyword))
    )
    .slice(0, 3);
}

// Find related blog posts based on content keywords
export function findRelatedBlogPosts(content: string, limit = 3): string[] {
  const lowerContent = content.toLowerCase();
  const matches: string[] = [];
  
  for (const topic of blogTopics) {
    if (lowerContent.includes(topic.keyword)) {
      matches.push(...topic.posts);
    }
  }
  
  return [...new Set(matches)].slice(0, limit);
}

// Get nearby towns for a given town
export function getNearbyTowns(
  townSlug: string, 
  county: 'nassau' | 'suffolk',
  allTowns: { name: string; slug: string }[],
  limit = 4
): { name: string; slug: string; url: string }[] {
  // Filter out current town and return random nearby ones
  return allTowns
    .filter(t => t.slug !== townSlug)
    .slice(0, limit)
    .map(t => ({
      name: t.name,
      slug: t.slug,
      url: `/${county}-county/${t.slug}-electrician`
    }));
}

// Generate contextual link text
export function generateLinkText(serviceName: string, townName?: string): string {
  if (townName) {
    return `${serviceName} in ${townName}`;
  }
  return serviceName;
}
