import StructuredData from "../town/StructuredData";

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
  category: string;
  keywords: string[];
}

const ArticleSchema = ({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  category,
  keywords
}: ArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": `https://bermanelectrical.com${image}`,
    "author": {
      "@type": "Person",
      "name": author,
      "jobTitle": "Licensed Electrician",
      "affiliation": {
        "@type": "Organization",
        "name": "Berman Electric"
      }
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bermanelectrical.com/logo-optimized.webp",
        "width": 160,
        "height": 160
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bermanelectrical.com${url}`
    },
    "articleSection": category,
    "keywords": keywords.join(", "),
    "inLanguage": "en-US"
  };

  return <StructuredData data={schema} id="article-schema" />;
};

export default ArticleSchema;
