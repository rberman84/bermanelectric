import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BreadcrumbSchema = ({ items, className = "" }: BreadcrumbSchemaProps) => {
  // Always include Home as first item
  const fullItems = [{ name: "Home", url: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `https://bermanelectrical.com${item.url}` : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <nav className={`container py-4 ${className}`} aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            {fullItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.url ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.url} className="flex items-center gap-1">
                        {index === 0 && <Home className="w-3.5 h-3.5" />}
                        {item.name}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </>
  );
};

export default BreadcrumbSchema;
