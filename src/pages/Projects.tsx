
import Navbar from "@/components/Navbar";
import Hero from "@/components/projects/Hero";
import ProjectCategory from "@/components/projects/ProjectCategory";
import WhyChooseUs from "@/components/projects/WhyChooseUs";
import ProjectsCTA from "@/components/projects/ProjectsCTA";
import ReviewsSection from "@/components/shared/ReviewsSection";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/shared/Breadcrumb";

const residentialProjects = [
  {
    title: "Custom Home Lighting & Smart Automation",
    location: "Huntington, NY",
    features: [
      "Designed and installed energy-efficient LED lighting throughout a newly renovated home",
      "Integrated smart home controls for lighting, security, and HVAC systems",
      "Installed a whole-home surge protection system for added safety"
    ]
  },
  {
    title: "EV Charger Installation",
    location: "Massapequa, NY",
    features: [
      "Installed a Level 2 home charging station for a Tesla Model Y",
      "Upgraded the electrical panel to handle the increased power demand",
      "Ensured full compliance with safety regulations and NEC codes"
    ]
  }
];

const commercialProjects = [
  {
    title: "Retail Store Electrical Fit-Out",
    location: "Long Island, NY",
    features: [
      "Full electrical installation for a new retail space, including LED display lighting",
      "Installed dedicated circuits for high-power equipment and POS systems",
      "Integrated emergency backup lighting for code compliance"
    ]
  },
  {
    title: "Warehouse & Industrial Power Upgrade",
    location: "Ronkonkoma, NY",
    features: [
      "Upgraded electrical systems to support high-powered industrial machinery",
      "Installed energy-efficient lighting throughout a 10,000 sq. ft. facility",
      "Implemented a backup generator system to ensure uninterrupted operations"
    ]
  }
];

const emergencyProjects = [
  {
    title: "Storm Damage Emergency Repair",
    location: "Babylon, NY",
    features: [
      "Responded to an emergency power outage due to storm damage",
      "Repaired damaged electrical panels, circuits, and wiring within 24 hours",
      "Installed a whole-house generator to prevent future disruptions"
    ]
  },
  {
    title: "Commercial Standby Generator Installation",
    location: "Smithtown, NY",
    features: [
      "Installed a 100kW standby generator for a medical facility",
      "Integrated an automatic transfer switch (ATS) for seamless power restoration",
      "Ensured compliance with NFPA and NEC safety standards"
    ]
  }
];

const Projects = () => {
  return (
    <>
      <SEO 
        title="Our Electrical Projects - Berman Electric Long Island Portfolio"
        description="View completed electrical projects on Long Island. Residential upgrades, commercial work, emergency repairs & EV installations. Licensed electrician Ronkonkoma."
        keywords="electrical projects Long Island, electrician portfolio Suffolk County, electrical installations Nassau County, electrical upgrades Ronkonkoma NY, commercial electrical projects"
        canonical="https://bermanelectrical.com/projects"
      />
      <Navbar />
      <Breadcrumb items={[{ label: "Our Work" }]} />
      <div className="pt-20">
        <Hero 
          title="Our Projects"
          subtitle="Powering Long Island with Excellence & Precision"
          description="At Berman Electric, we take pride in every project we complete. From residential upgrades to large-scale commercial installations, our work reflects our commitment to quality, safety, and innovation."
        />
        <div className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
            <ProjectCategory title="Residential Electrical Upgrades" projects={residentialProjects} />
            <ProjectCategory title="Commercial & Industrial Projects" projects={commercialProjects} />
            <ProjectCategory title="Emergency Electrical Repairs & Generator Installations" projects={emergencyProjects} />
          </div>
        </div>
        <WhyChooseUs />
        <ReviewsSection 
          title="Featured Project Reviews"
          subtitle="See what customers say about our completed electrical projects"
        />
        <ProjectsCTA />
      </div>
      <Footer />
    </>
  );
};

export default Projects;
