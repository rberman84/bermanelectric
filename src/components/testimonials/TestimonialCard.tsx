
import { Star, CheckCircle, Calendar } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  author: string;
  location: string;
  rating?: number;
  date?: string;
  verified?: boolean;
}

const TestimonialCard = ({ 
  text, 
  author, 
  location, 
  rating = 5, 
  date,
  verified = true 
}: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex text-yellow-400">
          {Array(rating).fill(0).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        {verified && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Verified</span>
          </div>
        )}
      </div>
      <blockquote className="text-gray-700 mb-4">"{text}"</blockquote>
      <div className="flex items-start justify-between border-t border-gray-100 pt-4">
        <div className="text-sm">
          <span className="font-semibold text-electric-600">— {author}</span>
          <span className="text-gray-500">, {location}</span>
        </div>
        {date && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</time>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
