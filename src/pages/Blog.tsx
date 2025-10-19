import { Calendar, User, ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import { generateAltText } from "@/lib/utils";
import Breadcrumb from "@/components/shared/Breadcrumb";
import BlogFAQSchema from "@/components/schema/BlogFAQSchema";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const categories = ["All", "Safety", "Upgrades", "Tips", "EV Charging", "Emergency Prep", "Smart Home"];

const Blog = () => {
  const { posts: blogPosts, loading } = useBlogPosts();
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <BlogFAQSchema />
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
      <Breadcrumb items={[{ label: "Blog" }]} />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
                Electrical Tips & Expert Guidance
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal mb-8 max-w-3xl mx-auto leading-relaxed">
                Professional electrical advice from Long Island's trusted licensed electrician. Learn how to keep your home safe, efficient, and up to code.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  category === "All" ? (
                    <span 
                      key={category}
                      className="px-4 py-2 bg-foreground text-background rounded-full text-sm hover:opacity-90 transition-opacity cursor-pointer font-medium"
                    >
                      {category}
                    </span>
                  ) : (
                    <Link
                      key={category}
                      to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors font-medium"
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

            {loading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : featuredPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No featured posts yet</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={generateAltText(post.image, `${post.title} feature image`)}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            )}
          </div>
        </div>

        {/* Regular Posts */}
        <div className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Recent Articles</h2>
            
            {loading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : regularPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No posts yet</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={post.image}
                      alt={generateAltText(post.image, `${post.title} article image`)}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            )}
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