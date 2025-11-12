import { useEffect, useState } from "react";
import { AlertCircle, Clock, DollarSign } from "lucide-react";

const urgencyMessages = [
  {
    icon: <AlertCircle className="w-4 h-4" />,
    text: "⚡ Emergency? We respond in 60 minutes or less",
    bgColor: "bg-red-600",
  },
  {
    icon: <Clock className="w-4 h-4" />,
    text: "🔥 Only 3 slots left this week for panel upgrades",
    bgColor: "bg-orange-600",
  },
  {
    icon: <DollarSign className="w-4 h-4" />,
    text: "💰 Save $150 on EV charger installation this month",
    bgColor: "bg-green-600",
  },
];

const UrgencyBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgencyMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = urgencyMessages[currentIndex];

  return (
    <div className={`${current.bgColor} text-white py-2 px-4 text-center transition-all duration-500`}>
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base font-medium">
        {current.icon}
        <span>{current.text}</span>
      </div>
    </div>
  );
};

export default UrgencyBanner;
