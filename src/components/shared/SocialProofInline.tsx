import { Star } from "lucide-react";

interface SocialProofInlineProps {
  rating?: number;
  reviewCount?: number;
}

const SocialProofInline = ({ rating = 4.9, reviewCount = 127 }: SocialProofInlineProps) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-gray-200">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-900">
        {rating}/5
      </span>
      <span className="text-sm text-gray-600">
        ({reviewCount}+ reviews)
      </span>
    </div>
  );
};

export default SocialProofInline;
