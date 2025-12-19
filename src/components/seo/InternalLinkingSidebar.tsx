import RelatedServicesLinks from "./RelatedServicesLinks";
import NearbyTownsLinks from "./NearbyTownsLinks";
import RelatedBlogLinks from "./RelatedBlogLinks";

interface InternalLinkingSidebarProps {
  currentContent?: string;
  currentSlug?: string;
  townName?: string;
  county?: 'nassau' | 'suffolk';
  nearbyTowns?: { name: string; slug: string; url: string }[];
  blogCategory?: string;
  blogTags?: string[];
  excludeBlogSlug?: string;
  className?: string;
}

const InternalLinkingSidebar = ({
  currentContent,
  currentSlug,
  townName,
  county,
  nearbyTowns,
  blogCategory,
  blogTags,
  excludeBlogSlug,
  className = ""
}: InternalLinkingSidebarProps) => {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Related Services */}
      <RelatedServicesLinks
        currentContent={currentContent}
        currentSlug={currentSlug}
        townName={townName}
      />

      {/* Nearby Towns (only for town pages) */}
      {townName && county && nearbyTowns && nearbyTowns.length > 0 && (
        <NearbyTownsLinks
          currentTown={townName}
          county={county}
          nearbyTowns={nearbyTowns}
        />
      )}

      {/* Related Blog Posts */}
      <RelatedBlogLinks
        currentContent={currentContent}
        category={blogCategory}
        tags={blogTags}
        excludeSlug={excludeBlogSlug}
        limit={3}
      />
    </aside>
  );
};

export default InternalLinkingSidebar;
