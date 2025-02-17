
import { Clock, Shield, HeartHandshake, Lightbulb, Zap } from "lucide-react";

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

const Benefits = () => {
  return (
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
  );
};

export default Benefits;
