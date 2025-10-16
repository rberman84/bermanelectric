import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import StructuredData from "../town/StructuredData";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bermanelectrical.com/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://bermanelectrical.com${item.href}` })
      }))
    ]
  };

  return (
    <>
      <StructuredData data={structuredData} id="breadcrumb-schema" />
      <nav aria-label="Breadcrumb" className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="container">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link 
                to="/" 
                className="flex items-center gap-1 text-gray-600 hover:text-electric-600 transition-colors"
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {item.href && index < items.length - 1 ? (
                  <Link 
                    to={item.href}
                    className="text-gray-600 hover:text-electric-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumb;
