import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useBlogPosts, BlogPost } from "@/hooks/useBlogPosts";

interface RelatedBlogLinksProps {
  currentContent?: string;
  category?: string;
  tags?: string[];
  excludeSlug?: string;
  limit?: number;
  className?: string;
}

const RelatedBlogLinks = ({ 
  currentContent = "",
  category,
  tags = [],
  excludeSlug,
  limit = 3,
  className = ""
}: RelatedBlogLinksProps) => {
  const { posts: allPosts } = useBlogPosts();

  // Find related posts based on content, category, or tags
  const relatedPosts = allPosts
    ?.filter((post: BlogPost) => post.slug !== excludeSlug)
    ?.filter((post: BlogPost) => {
      // Match by category
      if (category && post.category === category) return true;
      // Match by tags
      if (tags.some((tag: string) => post.tags.includes(tag))) return true;
      // Match by content keywords
      const contentKeywords = currentContent.toLowerCase();
      return post.tags.some((tag: string) => contentKeywords.includes(tag.toLowerCase()));
    })
    ?.slice(0, limit);

  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <div className={`bg-background border border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Related Articles
        </h3>
      </div>
      <div className="space-y-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {post.readTime}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
          </Link>
        ))}
      </div>
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
      >
        View all articles
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};

export default RelatedBlogLinks;
