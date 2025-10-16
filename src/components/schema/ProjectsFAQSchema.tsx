import StructuredData from "../town/StructuredData";

const ProjectsFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of electrical projects do you handle?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We handle residential electrical upgrades, commercial installations, EV charger installations, panel upgrades, smart home automation, emergency generator installations, and storm damage repairs throughout Long Island."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide free project estimates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide free, detailed estimates for all electrical projects. We'll assess your needs, explain the scope of work, and provide transparent pricing with no hidden fees."
        }
      },
      {
        "@type": "Question",
        "name": "How long do typical electrical projects take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Project timelines vary based on scope. Simple installations may take a few hours, panel upgrades typically 1-2 days, and larger commercial projects may take several days to weeks. We provide detailed timelines during the estimate."
        }
      },
      {
        "@type": "Question",
        "name": "Are your electrical projects covered by warranty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our electrical work is fully guaranteed. We stand behind our craftsmanship with comprehensive warranties on both labor and materials, giving you peace of mind."
        }
      },
      {
        "@type": "Question",
        "name": "Do you handle permits and inspections for electrical projects?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We handle all necessary permits, ensure code compliance, and coordinate required inspections for your electrical project. This ensures your work is legal, safe, and insurable."
        }
      },
      {
        "@type": "Question",
        "name": "Can you show me examples of similar projects you've completed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our portfolio showcases completed residential, commercial, and emergency electrical projects across Long Island. We're happy to discuss similar projects and provide references upon request."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="projects-faq-schema" />;
};

export default ProjectsFAQSchema;
