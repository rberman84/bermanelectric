import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/shared/Footer';
import BlogSEO from '@/components/blog/BlogSEO';
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
  featured: boolean;
}

// This would typically come from a CMS or API
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 5 Electrical Safety Tips for Long Island Homeowners",
    slug: "electrical-safety-tips-long-island-homeowners",
    excerpt: "Protect your family and home with these essential electrical safety tips every Long Island homeowner should know. From outlet safety to panel maintenance.",
    author: "Rob Berman",
    date: "2024-01-20",
    readTime: "5 min read",
    category: "Safety",
    tags: ["electrical safety", "home maintenance", "Long Island", "prevention"],
    image: "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
    featured: true
  },
  {
    id: "2", 
    title: "How to Know When It's Time to Upgrade Your Electrical Panel",
    slug: "when-to-upgrade-electrical-panel",
    excerpt: "Is your electrical panel outdated? Learn the warning signs that indicate it's time for an upgrade and why it's crucial for your Long Island home's safety.",
    author: "Rob Berman",
    date: "2024-01-18",
    readTime: "7 min read",
    category: "Upgrades",
    tags: ["electrical panel", "home upgrades", "electrical safety", "Suffolk County"],
    image: "/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png",
    featured: true
  },
  {
    id: "3",
    title: "Why Licensed Electricians Save You Money in the Long Run",
    slug: "licensed-electricians-save-money",
    excerpt: "Discover why hiring a licensed electrician is always worth the investment. Avoid costly mistakes and ensure quality work that lasts.",
    author: "Rob Berman", 
    date: "2024-01-15",
    readTime: "6 min read",
    category: "Tips",
    tags: ["licensed electrician", "cost savings", "quality work", "Nassau County"],
    image: "/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png",
    featured: false
  },
  {
    id: "4",
    title: "EV Charger Installation Guide for Long Island Homes",
    slug: "ev-charger-installation-guide-long-island",
    excerpt: "Planning to install an EV charger at home? Here's everything Long Island homeowners need to know about permits, costs, and installation.",
    author: "Rob Berman",
    date: "2024-01-12",
    readTime: "8 min read", 
    category: "EV Charging",
    tags: ["EV charger", "electric vehicle", "home installation", "Ronkonkoma"],
    image: "/lovable-uploads/75ea0479-7d50-48c5-8033-c17332ea08c3.png",
    featured: false
  },
  {
    id: "5",
    title: "Hurricane Season Electrical Preparedness for Long Island",
    slug: "hurricane-electrical-preparedness-long-island",
    excerpt: "Protect your home's electrical system during hurricane season. Essential tips for Long Island residents on generators, surge protection, and safety.",
    author: "Rob Berman",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Emergency Prep",
    tags: ["hurricane preparation", "generator installation", "surge protection", "emergency electrical"],
    image: "/lovable-uploads/9bf575d7-694f-4bc8-943d-7452fc34b82a.png",
    featured: false
  },
  {
    id: "6",
    title: "Smart Home Electrical Upgrades Worth the Investment",
    slug: "smart-home-electrical-upgrades",
    excerpt: "Transform your Long Island home with smart electrical upgrades. From smart switches to automated lighting systems - what's worth the investment?",
    author: "Rob Berman",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Smart Home",
    tags: ["smart home", "home automation", "electrical upgrades", "modern living"],
    image: "/lovable-uploads/c5858c5c-0ce3-4e8d-b5b5-79f91d0563a5.png",
    featured: false
  }
];

const categories = ["Safety", "Upgrades", "Tips", "EV Charging", "Emergency Prep", "Smart Home"];

const BlogCategory = () => {
  const { category } = useParams<{ category: string }>();
  
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
        <div className="py-16 bg-gradient-to-b from-electric-900 to-electric-800 text-white">
          <div className="container">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-electric-200 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Link>
            
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-6 h-6 text-electric-300" />
                <span className="text-electric-200 text-lg">Category</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {actualCategory}
              </h1>
              
              <p className="text-xl text-electric-100 mb-8">
                {categoryDescriptions[actualCategory]}
              </p>
              
              <div className="text-electric-200">
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
                      <ResponsiveImage
                        src={post.image}
                        alt={post.title}
                        wrapperClassName="absolute inset-0"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(min-width: 1024px) 33vw, 100vw"
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