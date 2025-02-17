
import Navbar from "@/components/Navbar";
import Hero from "@/components/about/Hero";
import Story from "@/components/about/Story";
import Benefits from "@/components/about/Benefits";
import Services from "@/components/about/Services";
import TeamLocation from "@/components/about/TeamLocation";
import ContactCTA from "@/components/about/ContactCTA";

const About = () => {
  return (
    <>
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
        <TeamLocation />
        <ContactCTA />
      </div>
    </>
  );
};

export default About;
