import { Phone, MessageSquare } from "lucide-react";

const MobileStickyBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t-2 border-electric-600 shadow-lg">
      <div className="grid grid-cols-2 gap-2 p-2">
        <a
          href="tel:+15163614068"
          className="flex items-center justify-center gap-2 py-3 bg-electric-600 text-white rounded-lg font-semibold text-sm hover:bg-electric-700 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href="sms:+15163614068"
          className="flex items-center justify-center gap-2 py-3 bg-white text-electric-600 border-2 border-electric-600 rounded-lg font-semibold text-sm hover:bg-electric-50 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Text Us
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
