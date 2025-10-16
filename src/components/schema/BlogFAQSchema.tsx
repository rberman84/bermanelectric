import StructuredData from "../town/StructuredData";

const BlogFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How often do you publish new electrical blog posts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We publish new electrical safety tips, guides, and industry updates regularly, typically 2-3 times per month. Subscribe to our newsletter to stay updated on the latest content."
        }
      },
      {
        "@type": "Question",
        "name": "Are your electrical tips safe for DIY homeowners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While we provide educational content about electrical systems, we always recommend hiring a licensed electrician for any electrical work. Our blog focuses on helping you understand when to call a professional and what questions to ask."
        }
      },
      {
        "@type": "Question",
        "name": "What topics do you cover in your electrical blog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our blog covers electrical safety, panel upgrades, EV charger installation, smart home technology, emergency preparedness, and electrical maintenance tips specifically for Long Island homeowners and businesses."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request a specific electrical topic for your blog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We welcome topic suggestions from our community. Contact us with your questions or topics you'd like to see covered, and we'll consider them for future blog posts."
        }
      },
      {
        "@type": "Question",
        "name": "Are your electrical guides specific to Long Island codes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our content is tailored to Long Island, including Suffolk and Nassau County electrical codes, permit requirements, and local considerations like hurricane preparedness and coastal climate factors."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="blog-faq-schema" />;
};

export default BlogFAQSchema;
