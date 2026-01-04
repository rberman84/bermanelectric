import { Star } from "lucide-react";

interface SocialProofInlineProps {
  rating?: number;
  reviewCount?: number;
}

const SocialProofInline = ({ rating = 4.9, reviewCount = 127 }: SocialProofInlineProps) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-gray-200">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
          return (
            <div key={i} className="relative w-4 h-4">
              {/* Background star (empty) */}
              <Star className="absolute inset-0 w-4 h-4 text-gray-300" />
              {/* Filled star with clip */}
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          );
        })}
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
