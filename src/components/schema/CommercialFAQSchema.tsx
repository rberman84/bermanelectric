import StructuredData from "../town/StructuredData";

const CommercialFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of commercial properties do you service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We service all types of commercial properties including offices, retail stores, restaurants, warehouses, medical facilities, schools, hotels, and multi-unit residential buildings. Our team has over 20 years of experience with commercial electrical systems of all sizes."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer preventative maintenance contracts for businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer customized preventative maintenance contracts for commercial clients. Regular maintenance helps prevent costly downtime, extends equipment life, and ensures your electrical systems remain code-compliant. Contact us for a custom quote."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can you respond to commercial electrical emergencies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer 24/7 emergency electrical services for commercial clients across Long Island. Our typical response time is within 1-2 hours for emergencies. We understand that downtime costs your business money, so we prioritize rapid response."
        }
      },
      {
        "@type": "Question",
        "name": "Are your commercial electricians licensed and insured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our electricians are fully licensed by New York State and carry comprehensive commercial liability insurance and workers' compensation coverage. We maintain all required certifications for commercial electrical work."
        }
      },
      {
        "@type": "Question",
        "name": "Can you handle large-scale commercial projects?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We have extensive experience with large commercial projects including complete building fit-outs, warehouse electrical systems, retail chain installations, and multi-phase construction projects. We can scale our team to meet project deadlines."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="commercial-faq-schema" />;
};

export default CommercialFAQSchema;
