import { 
  Clock, 
  Shield, 
  HeartHandshake, 
  Lightbulb, 
  Zap,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Users,
  Award,
  Building
} from "lucide-react";
import Navbar from "@/components/Navbar";

const About = () => {
  const benefits = [
    {
      title: "Over 20 Years of Experience",
      description: "With decades of industry experience, we have the knowledge and skills to handle even the most complex electrical projects.",
      icon: <Clock className="w-8 h-8 text-electric-600" />
    },
    {
      title: "Licensed & Insured Professionals",
      description: "We are fully licensed and insured, ensuring that every project meets the highest safety and compliance standards.",
      icon: <Shield className="w-8 h-8 text-electric-600" />
    },
    {
      title: "Customer-First Approach",
      description: "Our goal is simple: your complete satisfaction. We provide clear communication, upfront pricing, and a hassle-free experience from start to finish.",
      icon: <HeartHandshake className="w-8 h-8 text-electric-600" />
    },
    {
      title: "Cutting-Edge Solutions",
      description: "We stay ahead of industry trends, offering the latest in energy-efficient lighting, smart home automation, and EV charging solutions.",
      icon: <Lightbulb className="w-8 h-8 text-electric-600" />
    },
    {
      title: "Fast & Reliable Service",
      description: "Whether you need a routine installation or an emergency repair, our team is always ready to respond quickly and efficiently.",
      icon: <Zap className="w-8 h-8 text-electric-600" />
    }
  ];

  const services = [
    "Electrical Installations & Upgrades",
    "Lighting & Smart Home Solutions",
    "Emergency Electrical Repairs (24/7 Service)",
    "Commercial & Industrial Electrical Services",
    "EV Charger & Generator Installations"
  ];

  return (
    <>
      <Navbar />
      <div className="pt-20">
        {/* Hero Section with Image */}
        <div className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="absolute inset-0 z-0 opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
              alt="Professional electrician at work"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About Berman Electric
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Trusted Electrical Experts Serving Long Island for Over 20 Years
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
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

        {/* Our Story */}
        <div className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Story</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Berman Electric was founded with a clear mission: to provide expert electrical 
                solutions with integrity, precision, and professionalism. Over the years, we've 
                grown into a leading electrical contractor known for:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
                  <span className="text-lg text-gray-700">
                    High-quality workmanship backed by industry expertise
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
                  <span className="text-lg text-gray-700">
                    Exceptional customer service with a personal touch
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
                  <span className="text-lg text-gray-700">
                    Innovative solutions tailored to modern electrical needs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-electric-600 mt-1" />
                  <span className="text-lg text-gray-700">
                    Strict adherence to safety standards & local electrical codes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Berman Electric?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {benefit.icon}
                    <h3 className="text-xl font-semibold mt-4 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Services */}
        <div className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ul className="space-y-4">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-electric-600 flex-shrink-0" />
                      <span className="text-lg text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Location */}
        <div className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Users className="w-12 h-12 text-electric-600" />
                  <h3 className="text-2xl font-bold">Meet Our Team</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our team consists of highly skilled electricians who are passionate about 
                    delivering top-tier electrical solutions with a focus on quality, efficiency, 
                    and customer satisfaction.
                  </p>
                </div>
                <div className="space-y-4">
                  <MapPin className="w-12 h-12 text-electric-600" />
                  <h3 className="text-2xl font-bold">Committed to Long Island</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As a Long Island-based company, we take pride in serving our local communities. 
                    We're more than just an electrical contractor—we're your neighbors, problem-solvers, 
                    and trusted partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-electric-600">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                Get in Touch
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Looking for a reliable, experienced electrician? Berman Electric is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="tel:+15163614068"
                  className="inline-flex items-center px-6 py-3 text-electric-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us: (516) 361-4068
                </a>
                <a 
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request a Quote Online
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
