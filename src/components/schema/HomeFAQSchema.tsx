import StructuredData from "../town/StructuredData";

const HomeFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What areas does Berman Electric serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Berman Electric serves all of Long Island including Suffolk County and Nassau County. Our service areas include Ronkonkoma, Huntington, Massapequa, Smithtown, Babylon, Bay Shore, Commack, Deer Park, East Islip, Farmingdale, and surrounding communities."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer 24/7 emergency electrical services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Berman Electric provides 24/7 emergency electrical services across Long Island. We understand that electrical emergencies can happen at any time, and we're available around the clock to handle urgent electrical issues safely and efficiently."
        }
      },
      {
        "@type": "Question",
        "name": "Are your electricians licensed and insured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. All of our electricians are fully licensed by New York State (License #ME-44927) and carry comprehensive insurance coverage. We maintain all required certifications and stay current with the latest electrical codes and safety standards."
        }
      },
      {
        "@type": "Question",
        "name": "What types of electrical services do you provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Berman Electric offers comprehensive electrical services including residential and commercial electrical work, emergency repairs, panel upgrades, lighting installation, EV charger installation, generator installation, electrical inspections, smart home automation, and more. We handle projects of all sizes from simple repairs to complex installations."
        }
      },
      {
        "@type": "Question",
        "name": "How much do electrical services cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Electrical service costs vary depending on the project scope and complexity. We provide free, upfront estimates with transparent pricing and no hidden fees. Contact us at (516) 361-4068 for a free quote on your specific electrical needs."
        }
      },
      {
        "@type": "Question",
        "name": "Do you install EV chargers for electric vehicles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in EV charger installation for all major electric vehicle brands. Our service includes electrical assessment, permit acquisition, panel upgrades if needed, and professional installation of Level 2 charging stations at your home or business."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="faq-schema" />;
};

export default HomeFAQSchema;
