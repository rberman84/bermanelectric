
import Navbar from "@/components/Navbar";
import Hero from "@/components/about/Hero";
import Story from "@/components/about/Story";
import Benefits from "@/components/about/Benefits";
import Services from "@/components/about/Services";
import TeamLocation from "@/components/about/TeamLocation";
import ContactCTA from "@/components/about/ContactCTA";
import ReviewsSection from "@/components/shared/ReviewsSection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";

const About = () => {
  return (
    <>
      <SEO 
        title="About Berman Electric - 20+ Years Licensed Electrician Long Island"
        description="Learn about Berman Electric, your trusted licensed electrician serving Long Island for over 20 years. Family-owned business specializing in residential & commercial electrical services in Suffolk County, Nassau County, and Ronkonkoma NY."
        keywords="about Berman Electric, licensed electrician Long Island, family electrical business Suffolk County, experienced electrician Ronkonkoma NY, electrical contractor Nassau County"
        canonical="https://bermanelectrical.com/about"
      />
      <Navbar />
      <div className="pt-20">
        <Hero 
          title="About Berman Electric"
          subtitle="Trusted Electrical Experts Serving Long Island for Over 20 Years"
        />
        <div className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At Berman Electric, we take pride in delivering top-quality electrical services with 
                a commitment to safety, reliability, and customer satisfaction. As a locally owned 
                and operated company, we've been serving residential and commercial clients across 
                Long Island for over two decades, building a reputation for excellence and trust.
              </p>
            </div>
          </div>
        </div>
        <Story />
        <Benefits />
        <Services />
        <ReviewsSection 
          title="What Our Long Island Customers Say"
          subtitle="Real testimonials from satisfied residential and commercial clients"
        />
        <TeamLocation />
        <ContactCTA />
      </div>
      <Footer />
    </>
  );
};

export default About;
