import { Star, Quote } from "lucide-react";

const ReviewBadge = () => {
  return (
    <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>
        <span className="text-lg font-bold text-gray-900">5.0</span>
      </div>
      
      {/* Divider */}
      <div className="w-px h-8 bg-gray-300"></div>
      
      {/* Testimonial snippet */}
      <div className="flex items-start gap-2 max-w-xs">
        <Quote className="w-4 h-4 text-[hsl(15,100%,60%)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-gray-700 leading-tight">
            "Professional, reliable, and excellent work"
          </p>
          <p className="text-xs text-gray-500 mt-1">200+ verified reviews</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewBadge;
