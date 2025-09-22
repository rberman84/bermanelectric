import { MapPin, ExternalLink } from "lucide-react";

interface GoogleMapProps {
  className?: string;
  showDirectionsLink?: boolean;
}

const GoogleMap = ({ className = '', showDirectionsLink = true }: GoogleMapProps) => {
  // Ronkonkoma, NY coordinates
  const latitude = 40.8134;
  const longitude = -73.1123;
  const businessName = "Berman Electric";
  const address = "Ronkonkoma, NY";
  
  // Google Maps embed URL
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.8!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e82c4e6f6a6a6a%3A0x6f6a6a6a6a6a6a6a!2sRonkonkoma%2C%20NY!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus`;
  
  // Directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&destination_place_id=ChIJK6A6A6A6aIkR6A6A6A6A6A6A`;

  return (
    <div className={`relative ${className}`}>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        {/* Map Header */}
        <div className="bg-electric-600 text-white p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">{businessName}</h3>
              <p className="text-electric-100 text-sm">{address}</p>
            </div>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="relative h-64 md:h-80">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${businessName} in ${address}`}
            className="absolute inset-0"
          />
        </div>

        {/* Map Footer with Directions */}
        {showDirectionsLink && (
          <div className="bg-white border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">Serving Long Island</p>
                <p>Nassau & Suffolk Counties</p>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-electric-600 text-white rounded-lg hover:bg-electric-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Service Area Info */}
      <div className="mt-4 p-4 bg-electric-50 rounded-lg">
        <h4 className="font-semibold text-electric-900 mb-2">Service Area Coverage</h4>
        <p className="text-sm text-electric-700">
          Based in Ronkonkoma, we provide electrical services throughout Long Island including:
        </p>
        <div className="mt-2 text-sm text-electric-600">
          <span className="inline-block mr-4">• Nassau County</span>
          <span className="inline-block mr-4">• Suffolk County</span>
          <span className="inline-block">• All surrounding areas</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;