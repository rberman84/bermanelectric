import { Shield, Clock, DollarSign, Award } from "lucide-react";

const RiskReversalBadges = () => {
  const badges = [
    {
      icon: <Award className="w-5 h-5" />,
      text: "100% Satisfaction Guaranteed",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Licensed & Insured",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Same-Day Service Available",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      text: "Upfront Pricing - No Hidden Fees",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex-shrink-0 text-electric-600">{badge.icon}</div>
          <span className="text-sm font-medium text-gray-900 leading-tight">
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RiskReversalBadges;
