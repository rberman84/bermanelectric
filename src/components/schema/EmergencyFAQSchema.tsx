import StructuredData from "../town/StructuredData";

const EmergencyFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What constitutes an electrical emergency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Electrical emergencies include complete power loss, burning smells or smoke from outlets/panels, sparking outlets or switches, exposed wiring, electrical shocks, flooding near electrical equipment, storm damage to electrical systems, and any situation where you feel unsafe due to electrical issues."
        }
      },
      {
        "@type": "Question",
        "name": "How fast can you respond to an emergency call?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We aim to respond to emergency calls within 1-2 hours across Long Island. Our 24/7 emergency service means we're always available, including nights, weekends, and holidays. Call (516) 361-4068 immediately for emergency assistance."
        }
      },
      {
        "@type": "Question",
        "name": "Do you charge extra for emergency electrical services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Emergency service rates may include after-hours fees for nights, weekends, and holidays. However, we always provide upfront pricing before starting work so there are no surprises. Your safety is our priority, and we believe in fair, transparent pricing even during emergencies."
        }
      },
      {
        "@type": "Question",
        "name": "Should I turn off my main breaker during an electrical emergency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you smell burning, see sparks, or suspect an immediate fire hazard, yes - shut off your main breaker if you can safely access it. However, do not put yourself at risk. If the situation is dangerous, evacuate immediately and call 911, then call us for emergency electrical repair."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you cover for emergency electrical services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide 24/7 emergency electrical services throughout Long Island including all of Suffolk County and Nassau County. Our service areas include Ronkonkoma, Huntington, Smithtown, Babylon, Massapequa, and surrounding communities."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="emergency-faq-schema" />;
};

export default EmergencyFAQSchema;
