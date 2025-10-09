import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import ArticleLayout from "@/components/content/ArticleLayout";
import { getContentBySlug } from "@/lib/content";
import { useLocation, useParams } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();
  const location = useLocation();
  const derivedSlug = slug || location.pathname.split("/").filter(Boolean).pop();
  const entry = getContentBySlug(derivedSlug);

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-20">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Content Not Found</h1>
            <p className="mb-8 text-gray-600">The resource you&apos;re looking for has moved or no longer exists.</p>
            <a
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-electric-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric-700"
            >
              Back to Blog
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return <ArticleLayout entry={entry} />;
};

export default BlogPost;
