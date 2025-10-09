import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useAttribution } from "@/hooks/useAttribution";

interface NAPProps {
  variant?: 'default' | 'footer' | 'header' | 'contact';
  showHours?: boolean;
  className?: string;
}

const NAP = ({ variant = 'default', showHours = false, className = '' }: NAPProps) => {
  const { trackingNumber } = useAttribution();
  const napData = {
    name: "Berman Electric",
    address: "Ronkonkoma, NY",
    fullAddress: "Long Island, NY - Serving Nassau & Suffolk Counties",
    email: "info@bermanelectrical.com",
    hours: {
      weekdays: "Monday – Friday: 7:00 AM – 7:00 PM",
      weekends: "Saturday – Sunday: Emergency Services Available"
    }
  };

  const phoneDisplay = trackingNumber.display;
  const phoneHref = `tel:${trackingNumber.value}`;

  if (variant === 'footer') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">{napData.name}</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
            <div>
              <p>{napData.address}</p>
              <p className="text-sm">{napData.fullAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <a href={phoneHref} className="hover:text-electric-400 transition-colors">
              {phoneDisplay}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <a href={`mailto:${napData.email}`} className="hover:text-electric-400 transition-colors">
              {napData.email}
            </a>
          </div>
          {showHours && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
              <div className="text-sm">
                <p>{napData.hours.weekdays}</p>
                <p>{napData.hours.weekends}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-6 ${className}`}>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{napData.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4" />
          <a href={phoneHref} className="hover:text-electric-600 transition-colors font-medium">
            {phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'contact') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          <h3 className="text-xl font-semibold mb-4">📍 Visit Us</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 text-electric-600" />
              <div>
                <p className="font-medium">{napData.name}</p>
                <p className="text-gray-600">{napData.address}</p>
                <p className="text-gray-600">{napData.fullAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">📞 Get in Touch</h3>
          <div className="space-y-3">
            <a href={phoneHref} className="flex items-center text-gray-700 hover:text-electric-600 transition-colors">
              <Phone className="w-5 h-5 mr-3" />
              {phoneDisplay}
            </a>
            <a href={`mailto:${napData.email}`} className="flex items-center text-gray-700 hover:text-electric-600 transition-colors">
              <Mail className="w-5 h-5 mr-3" />
              {napData.email}
            </a>
          </div>
        </div>

        {showHours && (
          <div>
            <h3 className="text-xl font-semibold mb-4">🕐 Business Hours</h3>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-1 text-electric-600" />
              <div>
                <p className="text-gray-700">{napData.hours.weekdays}</p>
                <p className="text-gray-700">{napData.hours.weekends}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-electric-600" />
        <span className="text-gray-700">{napData.fullAddress}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-electric-600" />
        <a href={phoneHref} className="text-gray-700 hover:text-electric-600 transition-colors">
          {phoneDisplay}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-electric-600" />
        <a href={`mailto:${napData.email}`} className="text-gray-700 hover:text-electric-600 transition-colors">
          {napData.email}
        </a>
      </div>
    </div>
  );
};

export default NAP;