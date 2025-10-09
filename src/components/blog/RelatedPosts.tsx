import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { ContentEntry } from '@/lib/content';

interface RelatedPostsProps {
  currentEntry: ContentEntry;
  allEntries: ContentEntry[];
}

const RelatedPosts = ({ currentEntry, allEntries }: RelatedPostsProps) => {
  const currentTags = new Set(currentEntry.frontmatter.tags || []);

  const relatedPosts = allEntries
    .filter((entry) => entry.slug !== currentEntry.slug && entry.type === currentEntry.type)
    .map((entry) => {
      let score = 0;
      if (entry.frontmatter.category === currentEntry.frontmatter.category) score += 3;
      entry.frontmatter.tags?.forEach((tag) => {
        if (currentTags.has(tag)) score += 1;
      });
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.entry);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t">
      <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={post.frontmatter.image || '/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png'}
                alt={post.frontmatter.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.frontmatter.date).toLocaleDateString()}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-3 hover:text-electric-600 transition-colors line-clamp-2">
                <Link to={post.url}>
                  {post.frontmatter.title}
                </Link>
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {post.frontmatter.category}
                </span>
                <Link
                  to={post.url}
                  className="inline-flex items-center gap-1 text-electric-600 hover:text-electric-700 text-sm font-semibold"
                >
                  Read More <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;