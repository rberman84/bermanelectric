import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/shared/Footer';
import BlogSEO from '@/components/blog/BlogSEO';
import { generateAltText } from '@/lib/utils';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const categories = ["Safety", "Upgrades", "Tips", "EV Charging", "Emergency Prep", "Smart Home"];

const BlogCategory = () => {
  const { category } = useParams<{ category: string }>();
  const { posts: blogPosts } = useBlogPosts();
  
  // Transform URL parameter back to proper category name
  const getCategoryName = (urlCategory: string) => {
    const categoryMap: Record<string, string> = {
      "safety": "Safety",
      "upgrades": "Upgrades", 
      "tips": "Tips",
      "ev-charging": "EV Charging",
      "emergency-prep": "Emergency Prep",
      "smart-home": "Smart Home"
    };
    return categoryMap[urlCategory] || urlCategory;
  };
  
  const actualCategory = getCategoryName(category || "");
  
  if (!category || !categories.includes(actualCategory)) {
    return <div>Category not found</div>;
  }

  const categoryPosts = blogPosts.filter(post => post.category === actualCategory);
  const categoryDescriptions: Record<string, string> = {
    "Safety": "Essential electrical safety tips and guidelines to protect your Long Island home and family from electrical hazards.",
    "Upgrades": "Expert guidance on electrical system upgrades, panel modernization, and home electrical improvements.",
    "Tips": "Professional electrical advice and money-saving tips from Long Island's trusted licensed electrician.",
    "EV Charging": "Complete guides for electric vehicle charger installation and electrical requirements for Long Island homes.",
    "Emergency Prep": "Hurricane preparedness, backup power solutions, and emergency electrical safety for Long Island residents.",
    "Smart Home": "Modern electrical upgrades and smart home automation solutions for contemporary Long Island living."
  };

  const categoryKeywords: Record<string, string> = {
    "Safety": "electrical safety Long Island, home electrical safety, electrical hazard prevention, safe electrical practices",
    "Upgrades": "electrical panel upgrade Long Island, electrical system modernization, home electrical improvements",
    "Tips": "electrician tips Long Island, electrical advice, electrical maintenance tips, electrical cost savings",
    "EV Charging": "EV charger installation Long Island, electric vehicle charging, home EV charging station",
    "Emergency Prep": "hurricane electrical preparedness Long Island, backup power, emergency electrical safety",
    "Smart Home": "smart home electrical Long Island, home automation, smart electrical upgrades"
  };

  return (
    <>
      <BlogSEO
        title={`${actualCategory} - Electrical Articles & Guides`}
        description={categoryDescriptions[actualCategory]}
        keywords={categoryKeywords[actualCategory]}
        canonical={`https://bermanelectrical.com/blog/category/${category}`}
      />
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-16">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-foreground mb-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Link>
            
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-6 h-6 text-foreground" />
                <span className="text-gray-600 text-lg font-medium">Category</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                {actualCategory}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                {categoryDescriptions[actualCategory]}
              </p>
              
              <div className="text-gray-500 font-medium">
                {categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''} in this category
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="py-16 bg-white">
          <div className="container">
            {categoryPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No articles found in this category yet.</p>
                <Link 
                  to="/blog"
                  className="inline-flex items-center gap-2 mt-4 text-electric-600 hover:text-electric-700 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse All Articles
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={generateAltText(post.image, `${post.title} category image`)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-electric-600 text-white text-sm font-semibold rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-3 hover:text-electric-600 transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-electric-600 hover:text-electric-700 font-semibold"
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogCategory;