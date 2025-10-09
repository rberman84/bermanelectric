import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import ResponsiveImage from '@/components/media/ResponsiveImage';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
}

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

const RelatedPosts = ({ currentPost, allPosts }: RelatedPostsProps) => {
  // Find related posts based on tags and category
  const getRelatedPosts = () => {
    const currentTags = new Set(currentPost.tags);
    
    return allPosts
      .filter(post => post.id !== currentPost.id)
      .map(post => {
        let score = 0;
        
        // Same category gets higher score
        if (post.category === currentPost.category) score += 3;
        
        // Shared tags get points
        post.tags.forEach(tag => {
          if (currentTags.has(tag)) score += 1;
        });
        
        return { post, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.post);
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t">
      <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
          >
            <div className="relative h-40 overflow-hidden">
              <ResponsiveImage
                src={post.image}
                alt={post.title}
                wrapperClassName="absolute inset-0"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-3 hover:text-electric-600 transition-colors line-clamp-2">
                <Link to={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {post.category}
                </span>
                <Link 
                  to={`/blog/${post.slug}`}
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