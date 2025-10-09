import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import { getBlogs } from "@/lib/content";

const toTitleCase = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const BlogCategory = () => {
  const { category } = useParams();
  const posts = getBlogs().filter(
    (post) => post.frontmatter.category.toLowerCase().replace(/\s+/g, "-") === (category || "").toLowerCase()
  );
  const readableCategory = category ? toTitleCase(category) : "All";

  return (
    <>
      <BlogSEO
        title={`${readableCategory} Electrical Articles | Berman Electric`}
        description={`Browse detailed electrical guidance focused on ${readableCategory} from Berman Electric.`}
        canonical={`https://bermanelectrical.com/blog/category/${category}`}
      />
      <Navbar />
      <main className="bg-gradient-to-b from-slate-50 via-white to-white pt-24">
        <div className="container pb-20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-electric-700 shadow-sm transition hover:-translate-y-0.5 hover:text-electric-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mt-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-electric-600">Category</p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">{readableCategory}</h1>
            <p className="mt-4 text-gray-600">
              {posts.length > 0
                ? `Expert answers and project notes focused on ${readableCategory.toLowerCase()} from Long Island licensed electricians.`
                : "We&apos;re crafting new resources for this topic. Check back soon or explore other categories."}
            </p>
          </header>

          <section className="mt-12 grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.slug} className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
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
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.frontmatter.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                    <Link to={post.url} className="hover:text-electric-600">
                      {post.frontmatter.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-gray-600">{post.excerpt}</p>
                  <Link
                    to={post.url}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 hover:text-electric-700"
                  >
                    Read article
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {posts.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-electric-200 bg-white/70 p-12 text-center">
              <p className="text-lg font-semibold text-electric-700">New guides for {readableCategory} are on the way.</p>
              <p className="mt-2 text-sm text-gray-600">
                In the meantime, explore our latest electrical safety articles or contact us for a tailored consultation.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="rounded-full bg-electric-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric-700"
                >
                  Book a consultation
                </Link>
                <Link
                  to="/blog"
                  className="rounded-full bg-electric-100 px-4 py-2 text-sm font-semibold text-electric-700 hover:bg-electric-200"
                >
                  View all articles
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogCategory;
