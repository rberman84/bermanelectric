import StructuredData from "../town/StructuredData";

const EVChargerFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does it cost to install an EV charger at home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EV charger installation costs typically range from $800 to $2,500, depending on your home's electrical capacity, distance from the panel, and whether a panel upgrade is needed. We provide free estimates and can assess if your current electrical system can support EV charging."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to upgrade my electrical panel for an EV charger?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not always. Level 2 EV chargers typically require a 240V circuit with 40-50 amps. If your current panel has sufficient capacity and available breaker spaces, an upgrade may not be necessary. We perform a thorough assessment to determine your specific needs."
        }
      },
      {
        "@type": "Question",
        "name": "How long does EV charger installation take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most EV charger installations take 4-8 hours for a standard installation. If a panel upgrade is required, the project may take 1-2 days. We'll provide a detailed timeline during your free consultation and work efficiently to minimize disruption."
        }
      },
      {
        "@type": "Question",
        "name": "What brands of EV chargers do you install?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We install all major EV charger brands including Tesla Wall Connector, ChargePoint, JuiceBox, Grizzl-E, ClipperCreek, and more. We can help you choose the best charger for your electric vehicle and budget."
        }
      },
      {
        "@type": "Question",
        "name": "Do you handle the permits for EV charger installation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we handle all necessary permits and inspections required for EV charger installation in Long Island. This includes obtaining electrical permits and scheduling inspections to ensure your installation meets all local building codes and safety standards."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get tax credits or rebates for EV charger installation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, federal tax credits and local utility rebates are often available for residential EV charger installation. We can provide documentation for your tax filing and help you understand available incentives in your area. Check with PSEG Long Island or your local utility for current rebate programs."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="ev-charger-faq-schema" />;
};

export default EVChargerFAQSchema;
