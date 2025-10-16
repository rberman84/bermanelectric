import StructuredData from "../town/StructuredData";

const TestimonialsFAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are all testimonials verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all testimonials marked as verified are from actual customers who have used our electrical services. We maintain authenticity and transparency in all our reviews."
        }
      },
      {
        "@type": "Question",
        "name": "How can I leave a review for Berman Electric?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can leave a review on Google, Facebook, or directly through our website. We value all feedback and use it to continuously improve our electrical services."
        }
      },
      {
        "@type": "Question",
        "name": "Do you respond to customer reviews?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we read and respond to all customer reviews. Your feedback is important to us, and we're committed to addressing any concerns and celebrating successes with our clients."
        }
      },
      {
        "@type": "Question",
        "name": "Can I contact customers who left reviews?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While we protect customer privacy, we can provide references upon request. Many satisfied customers are happy to share their experiences with prospective clients."
        }
      },
      {
        "@type": "Question",
        "name": "What is your average customer rating?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Berman Electric maintains a 5-star average rating across all platforms. We're proud of our track record and work hard to exceed customer expectations on every electrical project."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer incentives for leaving reviews?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We never incentivize reviews. All testimonials are genuine, unsolicited feedback from customers who chose to share their experience with our electrical services."
        }
      }
    ]
  };

  return <StructuredData data={schema} id="testimonials-faq-schema" />;
};

export default TestimonialsFAQSchema;
