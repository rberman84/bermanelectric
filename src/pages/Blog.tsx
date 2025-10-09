import { Calendar, User, ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import ResponsiveImage from "@/components/media/ResponsiveImage";
import { generateAltText } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Electrical Mistakes Homeowners Make That Could Cost Thousands",
    slug: "5-electrical-mistakes-homeowners-make-cost-thousands",
    excerpt: "Ever flipped a breaker and thought something's weird? Learn the 5 most common electrical mistakes homeowners make and how to avoid costly repairs.",
    content: "",
    author: "Rob Berman",
    date: "2024-02-10",
    readTime: "6 min read",
    category: "Safety",
    tags: ["electrical safety", "home maintenance", "DIY tips", "cost savings", "preventive maintenance"],
    image: "/lovable-uploads/5-electrical-mistakes-hero.png",
    featured: true
  },
  {
    id: "2",
    title: "Top 5 Electrical Safety Tips for Long Island Homeowners",
    slug: "electrical-safety-tips-long-island-homeowners",
    excerpt: "Protect your family and home with these essential electrical safety tips every Long Island homeowner should know. From outlet safety to panel maintenance.",
    content: "",
    author: "Rob Berman",
    date: "2024-01-20",
    readTime: "5 min read",
    category: "Safety",
    tags: ["electrical safety", "home maintenance", "Long Island", "prevention"],
    image: "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png",
    featured: true
  },
  {
    id: "3", 
    title: "How to Know When It's Time to Upgrade Your Electrical Panel",
    slug: "when-to-upgrade-electrical-panel",
    excerpt: "Is your electrical panel outdated? Learn the warning signs that indicate it's time for an upgrade and why it's crucial for your Long Island home's safety.",
    content: "",
    author: "Rob Berman",
    date: "2024-01-18",
    readTime: "7 min read",
    category: "Upgrades",
    tags: ["electrical panel", "home upgrades", "electrical safety", "Suffolk County"],
    image: "/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png",
    featured: true
  },
  {
    id: "4",
    title: "Why Licensed Electricians Save You Money in the Long Run",
    slug: "licensed-electricians-save-money",
    excerpt: "Discover why hiring a licensed electrician is always worth the investment. Avoid costly mistakes and ensure quality work that lasts.",
    content: "",
    author: "Rob Berman", 
    date: "2024-01-15",
    readTime: "6 min read",
    category: "Tips",
    tags: ["licensed electrician", "cost savings", "quality work", "Nassau County"],
    image: "/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png",
    featured: false
  },
  {
    id: "5",
    title: "EV Charger Installation Guide for Long Island Homes",
    slug: "ev-charger-installation-guide-long-island",
    excerpt: "Planning to install an EV charger at home? Here's everything Long Island homeowners need to know about permits, costs, and installation.",
    content: "",
    author: "Rob Berman",
    date: "2024-01-12",
    readTime: "8 min read", 
    category: "EV Charging",
    tags: ["EV charger", "electric vehicle", "home installation", "Ronkonkoma"],
    image: "/lovable-uploads/75ea0479-7d50-48c5-8033-c17332ea08c3.png",
    featured: false
  },
  {
    id: "6",
    title: "Hurricane Season Electrical Preparedness for Long Island",
    slug: "hurricane-electrical-preparedness-long-island",
    excerpt: "Protect your home's electrical system during hurricane season. Essential tips for Long Island residents on generators, surge protection, and safety.",
    content: "",
    author: "Rob Berman",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Emergency Prep",
    tags: ["hurricane preparation", "generator installation", "surge protection", "emergency electrical"],
    image: "/lovable-uploads/9bf575d7-694f-4bc8-943d-7452fc34b82a.png",
    featured: false
  },
  {
    id: "7",
    title: "Smart Home Electrical Upgrades Worth the Investment",
    slug: "smart-home-electrical-upgrades",
    excerpt: "Transform your Long Island home with smart electrical upgrades. From smart switches to automated lighting systems - what's worth the investment?",
    content: "",
    author: "Rob Berman",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Smart Home",
    tags: ["smart home", "home automation", "electrical upgrades", "modern living"],
    image: "/lovable-uploads/c5858c5c-0ce3-4e8d-b5b5-79f91d0563a5.png",
    featured: false
  }
];

const categories = ["All", "Safety", "Upgrades", "Tips", "EV Charging", "Emergency Prep", "Smart Home"];

const Blog = () => {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <BlogSEO 
        title="Electrical Tips & Guides Blog - Berman Electric Long Island"
        description="Expert electrical tips, safety guides, and home improvement advice from Long Island's trusted electrician. Learn about electrical safety, panel upgrades, EV chargers, and more from licensed professionals."
        keywords="electrical blog Long Island, electrical safety tips, panel upgrade guide, EV charger installation, licensed electrician advice, electrical maintenance tips"
        canonical="https://bermanelectrical.com/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Berman Electric Blog",
          "description": "Expert electrical advice and safety tips for Long Island homeowners",
          "url": "https://bermanelectrical.com/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Berman Electric"
          }
        }}
      />
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="py-16 bg-gradient-to-b from-electric-900 to-electric-800 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Electrical Tips & Expert Guidance
              </h1>
              <p className="text-xl text-electric-100 mb-8">
                Professional electrical advice from Long Island's trusted licensed electrician. 
                Learn how to keep your home safe, efficient, and up to code.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  category === "All" ? (
                    <span 
                      key={category}
                      className="px-4 py-2 bg-electric-700 text-electric-100 rounded-full text-sm hover:bg-electric-600 transition-colors cursor-pointer"
                    >
                      {category}
                    </span>
                  ) : (
                    <Link
                      key={category}
                      to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-electric-700 text-electric-100 rounded-full text-sm hover:bg-electric-600 transition-colors"
                    >
                      {category}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-4">Featured Articles</h2>
              <p className="text-lg text-gray-600 text-center">
                Essential electrical knowledge for Long Island homeowners and businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <ResponsiveImage
                      src={post.image}
                      alt={post.title}
                      wrapperClassName="absolute inset-0"
                    <img
                      src={post.image}
                      alt={generateAltText(post.image, `${post.title} feature image`)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-electric-600 text-white text-sm font-semibold rounded-full">
                        Featured
                      </span>
                    </div>
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
                    
                    <h3 className="text-xl font-bold mb-3 hover:text-electric-600 transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-electric-600" />
                        <span className="text-sm bg-electric-50 text-electric-700 px-2 py-1 rounded">
                          {post.category}
                        </span>
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
          </div>
        </div>

        {/* Regular Posts */}
        <div className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Recent Articles</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <ResponsiveImage
                      src={post.image}
                      alt={post.title}
                      wrapperClassName="absolute inset-0"
                    <img
                      src={post.image}
                      alt={generateAltText(post.image, `${post.title} article image`)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-3 hover:text-electric-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-electric-600 hover:text-electric-700 text-sm font-semibold"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-16 bg-electric-600 text-white">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
              <p className="text-xl text-electric-100 mb-8">
                Get the latest electrical safety tips and home improvement advice delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                />
                <button className="px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-800 transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
              <p className="text-electric-200 text-sm mt-4">
                No spam, unsubscribe anytime. Your email stays private.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;