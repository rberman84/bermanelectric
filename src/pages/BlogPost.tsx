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

// This would typically come from a CMS or API
const getBlogPost = (slug: string) => {
  const posts: Record<string, any> = {
    "electrical-safety-tips-long-island-homeowners": {
      title: "Top 5 Electrical Safety Tips for Long Island Homeowners",
      content: `
        <p>As a licensed electrician serving Long Island for over 20 years, I've seen countless electrical hazards that could have been easily prevented. Your family's safety is paramount, and following these essential electrical safety tips can help protect your Long Island home.</p>

        <h2>1. Regular Electrical Panel Inspections</h2>
        <p>Your electrical panel is the heart of your home's electrical system. Schedule annual inspections with a licensed electrician to check for:</p>
        <ul>
          <li>Corrosion or rust on breakers</li>
          <li>Burning smells or scorch marks</li>
          <li>Frequently tripping breakers</li>
          <li>Outdated panels (especially Federal Pacific or Zinsco brands)</li>
        </ul>

        <h2>2. GFCI Protection in Wet Areas</h2>
        <p>Ground Fault Circuit Interrupter (GFCI) outlets are crucial in bathrooms, kitchens, garages, and outdoor areas. They detect electrical imbalances and shut off power to prevent electrical shock. Test your GFCI outlets monthly by pressing the "test" and "reset" buttons.</p>

        <h2>3. Avoid Overloading Circuits</h2>
        <p>Long Island homes, especially older ones, weren't designed for today's electrical demands. Signs of overloaded circuits include:</p>
        <ul>
          <li>Flickering lights when appliances turn on</li>
          <li>Warm outlet covers or switch plates</li>
          <li>Frequent breaker trips</li>
          <li>Extension cords used as permanent solutions</li>
        </ul>

        <h2>4. Professional Installation for Major Appliances</h2>
        <p>DIY electrical work might seem cost-effective, but it can be deadly. Always hire a licensed electrician for:</p>
        <ul>
          <li>EV charger installations</li>
          <li>Hot tub or pool electrical work</li>
          <li>Whole-house generators</li>
          <li>Major appliance installations</li>
        </ul>

        <h2>5. Hurricane and Storm Preparedness</h2>
        <p>Living on Long Island means preparing for severe weather. Protect your electrical system by:</p>
        <ul>
          <li>Installing whole-house surge protection</li>
          <li>Having a licensed electrician inspect your home after storms</li>
          <li>Never touching downed power lines</li>
          <li>Keeping a licensed electrician's number handy for emergencies</li>
        </ul>

        <h2>When to Call Berman Electric</h2>
        <p>Don't wait for an emergency. Call us immediately if you notice:</p>
        <ul>
          <li>Burning smells from outlets or panels</li>
          <li>Sparks when plugging in appliances</li>
          <li>Frequent electrical shocks</li>
          <li>Lights dimming throughout the house</li>
        </ul>

        <p>Remember, electrical work in Long Island requires proper permits and licensed professionals. Protect your investment and your family by choosing Berman Electric for all your electrical safety needs.</p>
      `,
      author: "Rob Berman",
      date: "2024-01-20",
      readTime: "5 min read",
      category: "Safety",
      tags: ["electrical safety", "home maintenance", "Long Island", "prevention"],
      image: "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"
    },
    "when-to-upgrade-electrical-panel": {
      title: "How to Know When It's Time to Upgrade Your Electrical Panel",
      content: `
        <p>Your electrical panel is the central hub that distributes electricity throughout your Long Island home. As your trusted local electrician, I frequently encounter homeowners who are unsure whether their electrical panel needs upgrading. Here's how to determine if it's time for an upgrade.</p>

        <h2>Age of Your Electrical Panel</h2>
        <p>Most electrical panels last 25-40 years, but Long Island's coastal environment can accelerate wear. If your panel was installed before 1990, it's time to consider an upgrade. Panels from the 1960s-1980s, particularly Federal Pacific and Zinsco brands, pose serious safety risks and should be replaced immediately.</p>

        <h2>Warning Signs Your Panel Needs Upgrading</h2>
        
        <h3>Frequent Breaker Trips</h3>
        <p>If breakers trip regularly, your panel may not be handling your home's electrical load. Modern Long Island homes use significantly more electricity than older panels were designed to handle.</p>

        <h3>Insufficient Amperage</h3>
        <p>Many older Long Island homes have 60-100 amp panels, but today's homes typically need 200 amps or more. Signs you need more amperage:</p>
        <ul>
          <li>Lights dim when major appliances start</li>
          <li>You can't run multiple appliances simultaneously</li>
          <li>You rely heavily on extension cords</li>
        </ul>

        <h3>Physical Signs of Deterioration</h3>
        <ul>
          <li>Rust, corrosion, or water damage</li>
          <li>Burning smell near the panel</li>
          <li>Scorch marks around breakers</li>
          <li>Warm panel cover</li>
          <li>Buzzing or crackling sounds</li>
        </ul>

        <h2>Benefits of Upgrading Your Electrical Panel</h2>
        
        <h3>Enhanced Safety</h3>
        <p>Modern panels include advanced safety features like AFCI (Arc Fault Circuit Interrupter) breakers that detect dangerous electrical arcs and prevent fires.</p>

        <h3>Increased Home Value</h3>
        <p>An updated electrical panel increases your Long Island home's value and makes it more attractive to potential buyers.</p>

        <h3>Support for Modern Appliances</h3>
        <p>New panels can handle:</p>
        <ul>
          <li>EV charger installations</li>
          <li>Central air conditioning systems</li>
          <li>Smart home technology</li>
          <li>High-end kitchen appliances</li>
        </ul>

        <h2>The Panel Upgrade Process</h2>
        <p>As your licensed Long Island electrician, here's what the upgrade process involves:</p>
        <ol>
          <li><strong>Inspection:</strong> We assess your current panel and electrical needs</li>
          <li><strong>Permits:</strong> We handle all necessary Suffolk/Nassau County permits</li>
          <li><strong>PSEG Coordination:</strong> We coordinate with your utility company</li>
          <li><strong>Installation:</strong> Professional installation with minimal disruption</li>
          <li><strong>Inspection:</strong> Final inspection ensures code compliance</li>
        </ol>

        <h2>Cost Considerations</h2>
        <p>While panel upgrades require an investment, the cost of not upgrading can be much higher:</p>
        <ul>
          <li>Fire damage from faulty panels</li>
          <li>Insurance claims denial for outdated systems</li>
          <li>Inability to install modern amenities</li>
          <li>Higher energy costs from inefficient systems</li>
        </ul>

        <h2>Why Choose Berman Electric</h2>
        <p>With over 20 years serving Long Island, we understand local codes, permit requirements, and the unique challenges of coastal electrical work. We're licensed, insured, and committed to your safety.</p>

        <p>Don't wait for an electrical emergency. If you're experiencing any of these warning signs, contact Berman Electric today for a professional assessment of your electrical panel.</p>
      `,
      author: "Rob Berman",
      date: "2024-01-18",
      readTime: "7 min read",
      category: "Upgrades",
      tags: ["electrical panel", "home upgrades", "electrical safety", "Suffolk County"],
      image: "/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png"
    },
    "licensed-electricians-save-money": {
      title: "Why Licensed Electricians Save You Money in the Long Run",
      content: `
        <p>As a licensed electrician serving Long Island for over two decades, I've witnessed countless situations where homeowners initially tried to save money with unlicensed electrical work, only to spend significantly more fixing problems later. Here's why choosing a licensed electrician is always the smarter financial decision.</p>

        <h2>The True Cost of Unlicensed Electrical Work</h2>
        
        <h3>Code Violations and Fines</h3>
        <p>Suffolk and Nassau Counties require permits for most electrical work. Unlicensed electricians often skip permits, leading to:</p>
        <ul>
          <li>Stop-work orders during home sales</li>
          <li>Expensive re-work to meet code</li>
          <li>Municipal fines and penalties</li>
          <li>Insurance claim denials</li>
        </ul>

        <h3>Safety Hazards and Property Damage</h3>
        <p>Poor electrical work can result in:</p>
        <ul>
          <li>House fires (electrical fires cause $1.3 billion in property damage annually)</li>
          <li>Electrocution injuries</li>
          <li>Damaged appliances and electronics</li>
          <li>Complete system failures</li>
        </ul>

        <h2>How Licensed Electricians Save You Money</h2>

        <h3>First-Time Quality Work</h3>
        <p>Licensed electricians have the training and experience to do the job right the first time. This means:</p>
        <ul>
          <li>No costly callbacks or re-work</li>
          <li>Proper installations that last decades</li>
          <li>Efficient solutions that reduce energy costs</li>
        </ul>

        <h3>Proper Permits and Inspections</h3>
        <p>We handle all permitting and ensure work passes inspection, protecting you from:</p>
        <ul>
          <li>Sale delays due to unpermitted work</li>
          <li>Insurance complications</li>
          <li>Municipal violations</li>
        </ul>

        <h3>Warranty Protection</h3>
        <p>Licensed electricians provide warranties on their work, giving you:</p>
        <ul>
          <li>Free repairs if issues arise</li>
          <li>Peace of mind about quality</li>
          <li>Protection against defective materials</li>
        </ul>

        <h2>Real-World Examples from Long Island</h2>

        <h3>Case Study 1: The DIY Panel Upgrade</h3>
        <p>A Huntington homeowner attempted to upgrade their electrical panel to save money. The result:</p>
        <ul>
          <li>Failed inspection requiring complete re-work: $3,500</li>
          <li>Municipal fines: $500</li>
          <li>Delayed home sale: $2,000 in carrying costs</li>
          <li>Professional re-installation: $2,800</li>
          <li><strong>Total cost: $8,800 (vs. $2,800 for licensed work)</strong></li>
        </ul>

        <h3>Case Study 2: The Unlicensed EV Charger Installation</h3>
        <p>A Massapequa resident hired an unlicensed handyman to install an EV charger:</p>
        <ul>
          <li>Improper installation caused a house fire</li>
          <li>Insurance denied claim due to unlicensed work</li>
          <li>Out-of-pocket repairs: $45,000</li>
          <li>Legal fees: $8,000</li>
          <li><strong>Total cost: $53,000 (vs. $1,200 for proper installation)</strong></li>
        </ul>

        <h2>What to Look for in a Licensed Electrician</h2>

        <h3>Proper Licensing</h3>
        <p>In New York, electrical contractors must be licensed. Verify licenses through the Department of State website.</p>

        <h3>Insurance Coverage</h3>
        <p>Ensure your electrician carries:</p>
        <ul>
          <li>General liability insurance</li>
          <li>Workers' compensation</li>
          <li>Bonding (for larger projects)</li>
        </ul>

        <h3>Local Knowledge</h3>
        <p>Long Island electricians understand:</p>
        <ul>
          <li>Local building codes</li>
          <li>Permit requirements</li>
          <li>Utility company procedures</li>
          <li>Coastal electrical challenges</li>
        </ul>

        <h2>The Berman Electric Advantage</h2>
        <p>When you choose Berman Electric, you get:</p>
        <ul>
          <li>Over 20 years of Long Island experience</li>
          <li>Full licensing and insurance</li>
          <li>Warranty on all work</li>
          <li>Upfront, honest pricing</li>
          <li>Expertise in local codes and permits</li>
        </ul>

        <h2>Making the Smart Choice</h2>
        <p>While licensed electrical work may seem more expensive upfront, it's always the more economical choice long-term. The peace of mind, quality assurance, and protection from costly mistakes make it an investment in your home's safety and value.</p>

        <p>Don't gamble with your family's safety or your financial security. Choose Berman Electric for all your Long Island electrical needs and experience the difference that professional, licensed service makes.</p>
      `,
      author: "Rob Berman",
      date: "2024-01-15",
      readTime: "6 min read",
      category: "Tips",
      tags: ["licensed electrician", "cost savings", "quality work", "Nassau County"],
      image: "/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png"
    }
  };

  return posts[slug] || null;
};

// All blog posts for related posts functionality
const allBlogPosts = [
  {
    id: "1",
    title: "Top 5 Electrical Safety Tips for Long Island Homeowners",
    slug: "electrical-safety-tips-long-island-homeowners",
    excerpt: "Protect your family and home with these essential electrical safety tips every Long Island homeowner should know.",
    author: "Rob Berman",
    date: "2024-01-20",
    readTime: "5 min read",
    category: "Safety",
    tags: ["electrical safety", "home maintenance", "Long Island", "prevention"],
    image: "/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"
  },
  {
    id: "2",
    title: "How to Know When It's Time to Upgrade Your Electrical Panel",
    slug: "when-to-upgrade-electrical-panel",
    excerpt: "Is your electrical panel outdated? Learn the warning signs that indicate it's time for an upgrade.",
    author: "Rob Berman",
    date: "2024-01-18",
    readTime: "7 min read",
    category: "Upgrades",
    tags: ["electrical panel", "home upgrades", "electrical safety", "Suffolk County"],
    image: "/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png"
  },
  {
    id: "3",
    title: "Why Licensed Electricians Save You Money in the Long Run",
    slug: "licensed-electricians-save-money",
    excerpt: "Discover why hiring a licensed electrician is always worth the investment.",
    author: "Rob Berman",
    date: "2024-01-15",
    readTime: "6 min read",
    category: "Tips",
    tags: ["licensed electrician", "cost savings", "quality work", "Nassau County"],
    image: "/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png"
  }
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : null;
  const currentPost = allBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  const cleanDescription = post.content.substring(0, 160).replace(/<[^>]*>/g, '').trim() + "...";
  const currentUrl = `https://bermanelectrical.com/blog/${slug}`;

  return (
    <>
      <ReadingProgress />
      <BlogSEO 
        title={`${post.title} - Berman Electric Blog`}
        description={cleanDescription}
        keywords={post.tags.join(", ")}
        canonical={currentUrl}
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
              "url": "https://bermanelectrical.com/lovable-uploads/1d26535a-cfea-4674-b170-5bdf526c88a6.png"
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
      <div className="pt-20">
        {/* Header */}
        <div className="py-8 bg-gray-50">
          <div className="container">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-electric-600 hover:text-electric-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="bg-electric-100 text-electric-700 px-3 py-1 rounded-full font-medium">
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
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-electric-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">By {post.author}</p>
                    <p className="text-sm text-gray-500">Licensed Electrician</p>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-electric-600 text-white rounded-lg hover:bg-electric-700 transition-colors">
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
            alt={post.title}
            className="w-full h-full object-cover"
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
              {currentPost && (
                <RelatedPosts 
                  currentPost={currentPost} 
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