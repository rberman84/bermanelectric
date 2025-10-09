import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import { getBlogs } from "@/lib/content";

const Blog = () => {
  const posts = getBlogs();
  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.frontmatter.category)))];
  const featuredPosts = posts.filter((post) => post.frontmatter.featured);
  const regularPosts = posts.filter((post) => !post.frontmatter.featured);

  return (
    <>
      <BlogSEO
        title="Electrical Tips & Guides Blog - Berman Electric Long Island"
        description="Expert electrical tips, safety guides, and project case studies from Long Island&apos;s trusted electricians."
        keywords="electrical blog Long Island, electrical safety tips, panel upgrade guide, EV charger installation, licensed electrician advice"
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
        <section className="bg-gradient-to-b from-electric-900 to-electric-700 py-16 text-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-electric-100">Insights & Case Studies</p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">Electrical Expertise for Long Island Homes</h1>
              <p className="mt-4 text-lg text-electric-100">
                Explore maintenance tips, project walk-throughs, and EV charger guidance curated for Suffolk and Nassau County homeowners.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  category === "All" ? (
                    <span
                      key={category}
                      className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {category}
                    </span>
                  ) : (
                    <Link
                      key={category}
                      to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      {category}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container">
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold">Featured Articles</h2>
                  <p className="mt-2 text-lg text-gray-600">High-impact electrical advice and recent project spotlights</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <article key={post.slug} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <Link to={post.url} className="block">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={post.frontmatter.image || "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"}
                            alt={post.frontmatter.title}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>{new Date(post.frontmatter.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                          <span>•</span>
                          <span>{post.frontmatter.category}</span>
                        </div>
                        <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                          <Link to={post.url} className="hover:text-electric-600">
                            {post.frontmatter.title}
                          </Link>
                        </h3>
                        <p className="mt-3 text-sm text-gray-600">{post.excerpt}</p>
                        <Link
                          to={post.url}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 hover:text-electric-700"
                        >
                          Read the story <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold">Latest Posts</h2>
                <p className="mt-2 text-lg text-gray-600">Fresh guidance for keeping your electrical system safe and efficient</p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {regularPosts.map((post) => (
                  <article key={post.slug} className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <Link to={post.url} className="relative block h-48 overflow-hidden">
                      <img
                        src={post.frontmatter.image || "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"}
                        alt={post.frontmatter.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{new Date(post.frontmatter.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-gray-900">
                        <Link to={post.url} className="hover:text-electric-600">
                          {post.frontmatter.title}
                        </Link>
                      </h3>
                      <p className="mt-3 flex-1 text-sm text-gray-600">{post.excerpt}</p>
                      <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                        <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                          {post.frontmatter.category}
                        </span>
                        <Link to={post.url} className="inline-flex items-center gap-1 font-semibold text-electric-600 hover:text-electric-700">
                          Read <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
