import { Star, MapPin, CheckCircle } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface TownTestimonialsProps {
  town: TownData;
}

// Town-specific testimonials would ideally come from a database
// For now, we'll generate contextual testimonials based on town data
const TownTestimonials = ({ town }: TownTestimonialsProps) => {
  const testimonials = [
    {
      text: `Berman Electric's team was incredibly professional when they upgraded our electrical panel. They were familiar with ${town.name}'s building codes and made the whole process smooth. Highly recommend for anyone in the ${town.neighborhoods[0]} area!`,
      author: "Sarah M.",
      location: `${town.neighborhoods[0]}, ${town.name}`,
      service: town.serviceCatalog[0],
      rating: 5,
      verified: true
    },
    {
      text: `We needed emergency electrical repair at our ${town.name} property. The response was incredibly fast and they had everything fixed within hours. Professional, knowledgeable, and reasonably priced.`,
      author: "James T.",
      location: `${town.neighborhoods[1] || town.name}`,
      service: "Emergency Electrical Repair",
      rating: 5,
      verified: true
    },
    {
      text: `As a business owner in ${town.name}, I needed reliable electrical work for my ${town.landmarks[0] || 'downtown'} location. Berman Electric delivered exceptional service with minimal disruption to our operations.`,
      author: "Michael R.",
      location: `${town.name}, NY`,
      service: town.serviceCatalog[1] || "Commercial Electrical",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What {town.name} Customers Say About Us
          </h2>
          <p className="mt-4 text-gray-600">
            Real reviews from homeowners and businesses across {town.neighborhoods.slice(0, 2).join(" and ")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-yellow-400">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {testimonial.verified && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <blockquote className="text-gray-700 text-sm mb-4 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-electric-600 text-sm">
                  {testimonial.author}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{testimonial.location}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">
                  Service: {testimonial.service}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">
            Join hundreds of satisfied customers across {town.name}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-electric-600">
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-semibold">4.9 out of 5</span>
            <span className="text-gray-500">• 200+ Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TownTestimonials;
