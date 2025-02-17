
import { Star } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  author: string;
  location: string;
}

const TestimonialCard = ({ text, author, location }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex text-yellow-400 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-700 mb-4">"{text}"</blockquote>
      <div className="text-sm">
        <span className="font-semibold text-electric-600">— {author}</span>
        <span className="text-gray-500">, {location}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
