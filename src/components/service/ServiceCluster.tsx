import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ClusterLink {
  title: string;
  url: string;
  description?: string;
}

interface ServiceClusterProps {
  title: string;
  description: string;
  links: ClusterLink[];
  blogPosts?: ClusterLink[];
  className?: string;
}

const ServiceCluster = ({
  title,
  description,
  links,
  blogPosts = [],
  className = ""
}: ServiceClusterProps) => {
  return (
    <section className={`py-16 bg-white border-t border-gray-100 ${className}`}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ChevronRight className="w-5 h-5 text-electric-600 mr-1" />
                Related Services
              </h3>
              <div className="space-y-3">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.url}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-electric-50 hover:border-electric-200 border border-gray-200 transition-all group"
                  >
                    <div className="font-medium text-gray-900 group-hover:text-electric-700 mb-1">
                      {link.title}
                    </div>
                    {link.description && (
                      <div className="text-sm text-gray-600">
                        {link.description}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            {blogPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ChevronRight className="w-5 h-5 text-electric-600 mr-1" />
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {blogPosts.map((post, index) => (
                    <Link
                      key={index}
                      to={post.url}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-electric-50 hover:border-electric-200 border border-gray-200 transition-all group"
                    >
                      <div className="font-medium text-gray-900 group-hover:text-electric-700">
                        {post.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCluster;
