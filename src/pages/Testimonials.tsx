import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialSection from "@/components/testimonials/TestimonialSection";
import TrustReasons from "@/components/testimonials/TrustReasons";
import ReviewCTA from "@/components/testimonials/ReviewCTA";
import Footer from "@/components/shared/Footer";
import ReviewSchema from "@/components/schema/ReviewSchema";
import AggregateRatingSchema from "@/components/schema/AggregateRatingSchema";
import type { ReviewData } from "@/components/schema/ReviewSchema";
import Breadcrumb from "@/components/shared/Breadcrumb";

const residentialTestimonials = [
  {
    text: "Berman Electric installed recessed lighting throughout our home, and the results were amazing! The team was professional, on time, and kept everything clean. I highly recommend them for any electrical work!",
    author: "Emily R.",
    location: "Huntington, NY",
    rating: 5,
    date: "2024-09-15",
    verified: true
  },
  {
    text: "I needed an EV charger installed, and Berman Electric handled everything from start to finish. They upgraded my panel and installed the charger seamlessly. The process was smooth, and the pricing was fair!",
    author: "David M.",
    location: "Massapequa, NY",
    rating: 5,
    date: "2024-08-22",
    verified: true
  },
  {
    text: "After a major storm, we lost power, and our panel was damaged. Berman Electric arrived quickly, assessed the situation, and restored our power the same day. They were absolute lifesavers!",
    author: "Lisa T.",
    location: "Babylon, NY",
    rating: 5,
    date: "2024-10-03",
    verified: true
  }
];

const commercialTestimonials = [
  {
    text: "We hired Berman Electric for a complete electrical fit-out in our retail store. They handled everything, from lighting design to wiring, and did an incredible job. They are now our go-to electricians!",
    author: "Michael K.",
    location: "Smithtown, NY",
    rating: 5,
    date: "2024-07-10",
    verified: true
  },
  {
    text: "We needed a generator installed for our medical facility, and Berman Electric ensured everything was up to code. Their knowledge and professionalism gave us complete confidence in their work.",
    author: "Dr. Steven L.",
    location: "Ronkonkoma, NY",
    rating: 5,
    date: "2024-09-05",
    verified: true
  },
  {
    text: "Berman Electric upgraded the electrical system in our warehouse, and the difference is night and day. The lighting is more energy-efficient, and everything runs smoothly now. Great work!",
    author: "John P.",
    location: "Long Island, NY",
    rating: 5,
    date: "2024-06-18",
    verified: true
  }
];

const Testimonials = () => {
  const allTestimonials = [...residentialTestimonials, ...commercialTestimonials];
  const totalReviews = allTestimonials.length;
  const averageRating = allTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / totalReviews;

  const reviewData: ReviewData[] = allTestimonials.map(t => ({
    author: t.author,
    reviewRating: t.rating || 5,
    reviewBody: t.text,
    datePublished: t.date || new Date().toISOString().split('T')[0],
    location: t.location
  }));

  return (
    <>
      <Helmet>
        <title>Customer Reviews & Testimonials | Berman Electric</title>
        <meta 
          name="description" 
          content="Read verified customer testimonials and reviews from residential and commercial clients across Long Island. See why Berman Electric is the trusted choice for electrical services." 
        />
        <link rel="canonical" href="https://www.bermanelectric.com/testimonials" />
        <meta property="og:title" content="Customer Reviews & Testimonials | Berman Electric" />
        <meta property="og:description" content="Read verified customer testimonials and reviews from residential and commercial clients across Long Island." />
        <meta property="og:url" content="https://www.bermanelectric.com/testimonials" />
        <meta property="og:type" content="website" />
      </Helmet>

      <AggregateRatingSchema ratingValue={averageRating} reviewCount={totalReviews} />
      <ReviewSchema reviews={reviewData} />

      <Navbar />
      <Breadcrumb items={[{ label: "Client Reviews" }]} />
      <div className="pt-20">
        <Hero 
          title="Customer Testimonials"
          subtitle="What Our Clients Say About Berman Electric"
          description="At Berman Electric, we take pride in delivering top-quality electrical services with a commitment to safety, reliability, and customer satisfaction. But don't just take our word for it—hear what our clients have to say!"
        />
        <div className="py-16 bg-white">
          <div className="container">
            <TestimonialSection 
              title="Residential Testimonials" 
              testimonials={residentialTestimonials} 
            />
            <TestimonialSection 
              title="Commercial Testimonials" 
              testimonials={commercialTestimonials} 
            />
          </div>
        </div>
        <TrustReasons />
        <ReviewCTA />
      </div>
      <Footer />
    </>
  );
};

export default Testimonials;
