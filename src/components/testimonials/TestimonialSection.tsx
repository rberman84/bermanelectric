
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  text: string;
  author: string;
  location: string;
}

interface TestimonialSectionProps {
  title: string;
  testimonials: Testimonial[];
}

const TestimonialSection = ({ title, testimonials }: TestimonialSectionProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-electric-600 mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
