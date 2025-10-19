import { Calendar, User, Clock, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import CTASection from "@/components/shared/CTASection";
import BlogSEO from "@/components/blog/BlogSEO";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import SocialShare from "@/components/blog/SocialShare";
import AuthorBio from "@/components/blog/AuthorBio";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { generateAltText } from "@/lib/utils";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ArticleSchema from "@/components/schema/ArticleSchema";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = useBlogPost(slug);
  const { posts: allBlogPosts } = useBlogPosts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-electric-600 hover:underline">
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  const cleanDescription = post.content.substring(0, 160).replace(/<[^>]*>/g, '').trim() + "...";
  const currentUrl = `https://bermanelectrical.com/blog/${slug}`;
  
  // Social media hashtags for sharing
  const socialHashtags = [
    'ElectricalSafety',
    'HomeDIY',
    'CommercialElectric',
    'SmartBuildings',
    'DIYProjects',
    'PowerUpSafely',
    'BermanElectric',
    'SafeWiring',
    'ElectricalTips',
    'HomeOwners',
    'BusinessOwners'
  ];

  return (
    <>
      <ReadingProgress />
      <BlogSEO 
        title={`${post.title} - Berman Electric Blog`}
        description={cleanDescription}
        keywords={post.tags.join(", ")}
        canonical={currentUrl}
        socialHashtags={socialHashtags}
        article={{
          publishedTime: new Date(post.date).toISOString(),
          author: post.author,
          section: post.category,
          tags: post.tags
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": cleanDescription,
          "image": {
            "@type": "ImageObject",
            "url": `https://bermanelectrical.com${post.image}`,
            "width": 1200,
            "height": 630
          },
          "author": {
            "@type": "Person",
            "name": post.author,
            "jobTitle": "Licensed Electrician"
          },
          "datePublished": new Date(post.date).toISOString(),
          "dateModified": new Date(post.date).toISOString(),
          "publisher": {
            "@type": "Organization",
            "name": "Berman Electric",
            "logo": {
              "@type": "ImageObject",
              "url": "https://bermanelectrical.com/logo-optimized.webp"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          },
          "wordCount": post.content.replace(/<[^>]*>/g, '').split(' ').length,
          "articleSection": post.category,
          "keywords": post.tags.join(", ")
        }}
      />
      <Navbar />
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <ArticleSchema
        title={post.title}
        description={cleanDescription}
        author={post.author}
        datePublished={new Date(post.date).toISOString()}
        image={post.image}
        url={`/blog/${slug}`}
        category={post.category}
        keywords={post.tags}
      />
      <div className="pt-20">
        {/* Header */}
        <div className="relative py-16 overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-30 blur-3xl" />
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-30 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
          </div>

          <div className="container relative">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-foreground mb-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-foreground mb-8 leading-[0.95] tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-medium">By {post.author}</p>
                    <p className="text-sm text-gray-500">Licensed Electrician</p>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity font-medium">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={generateAltText(post.image, `${post.title} hero image`)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Table of Contents */}
              <TableOfContents content={post.content} />
              
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-headings:scroll-mt-16"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Social Share */}
              <div className="mt-12">
                <SocialShare 
                  title={post.title}
                  url={currentUrl}
                  description={cleanDescription}
                  hashtags={socialHashtags}
                />
              </div>
              
              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500 mr-2">Tags:</span>
                  {post.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-electric-50 hover:text-electric-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <AuthorBio author={post.author} />

              {/* Related Posts */}
              {post && allBlogPosts.length > 0 && (
                <RelatedPosts 
                  currentPost={post} 
                  allPosts={allBlogPosts} 
                />
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <CTASection 
          variant="service"
          title="Need Professional Electrical Service?"
          subtitle="Get expert electrical service from Long Island's trusted licensed electrician"
          showTrustSignals={true}
        />
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;