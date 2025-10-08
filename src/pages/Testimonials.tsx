
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialSection from "@/components/testimonials/TestimonialSection";
import TrustReasons from "@/components/testimonials/TrustReasons";
import ReviewCTA from "@/components/testimonials/ReviewCTA";
import Footer from "@/components/shared/Footer";

const residentialTestimonials = [
  {
    text: "Berman Electric installed recessed lighting throughout our home, and the results were amazing! The team was professional, on time, and kept everything clean. I highly recommend them for any electrical work!",
    author: "Emily R.",
    location: "Huntington, NY"
  },
  {
    text: "I needed an EV charger installed, and Berman Electric handled everything from start to finish. They upgraded my panel and installed the charger seamlessly. The process was smooth, and the pricing was fair!",
    author: "David M.",
    location: "Massapequa, NY"
  },
  {
    text: "After a major storm, we lost power, and our panel was damaged. Berman Electric arrived quickly, assessed the situation, and restored our power the same day. They were absolute lifesavers!",
    author: "Lisa T.",
    location: "Babylon, NY"
  }
];

const commercialTestimonials = [
  {
    text: "We hired Berman Electric for a complete electrical fit-out in our retail store. They handled everything, from lighting design to wiring, and did an incredible job. They are now our go-to electricians!",
    author: "Michael K.",
    location: "Smithtown, NY"
  },
  {
    text: "We needed a generator installed for our medical facility, and Berman Electric ensured everything was up to code. Their knowledge and professionalism gave us complete confidence in their work.",
    author: "Dr. Steven L.",
    location: "Ronkonkoma, NY"
  },
  {
    text: "Berman Electric upgraded the electrical system in our warehouse, and the difference is night and day. The lighting is more energy-efficient, and everything runs smoothly now. Great work!",
    author: "John P.",
    location: "Long Island, NY"
  }
];

const Testimonials = () => {
  return (
    <>
      <Navbar />
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
