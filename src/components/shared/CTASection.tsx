import { Phone, Mail, Calendar, MessageCircle, ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  variant?: 'default' | 'emergency' | 'service' | 'footer';
  title?: string;
  subtitle?: string;
  primaryText?: string;
  secondaryText?: string;
  showTrustSignals?: boolean;
  showUrgency?: boolean;
  backgroundColor?: string;
  className?: string;
}

const CTASection = ({
  variant = 'default',
  title,
  subtitle,
  primaryText = "Call (516) 361-4068",
  secondaryText = "Get Free Quote",
  showTrustSignals = true,
  showUrgency = false,
  backgroundColor = 'bg-electric-600',
  className = ''
}: CTASectionProps) => {
  
  const trustSignals = [
    { icon: <Shield className="w-4 h-4" />, text: "Licensed & Insured" },
    { icon: <Clock className="w-4 h-4" />, text: "24/7 Emergency Service" },
    { icon: <CheckCircle className="w-4 h-4" />, text: "20+ Years Experience" }
  ];

  if (variant === 'emergency') {
    return (
      <div className={`py-12 bg-red-600 text-white ${className}`}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 animate-pulse">
              {title || "Electrical Emergency? We're Here 24/7!"}
            </h2>
            <p className="text-xl text-red-100 mb-6">
              {subtitle || "Don't wait - electrical emergencies require immediate attention for your safety"}
            </p>
            {showUrgency && (
              <div className="bg-red-700 p-4 rounded-lg mb-6">
                <p className="text-red-100 font-semibold">⚠️ Call immediately for:</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <span>• Sparking outlets</span>
                  <span>• Power outages</span>
                  <span>• Electrical fires</span>
                  <span>• Storm damage</span>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15163614068"
                className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg animate-pulse"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency: (516) 361-4068
              </a>
              <Link
                to="/emergency"
                className="inline-flex items-center px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Emergency Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'service') {
    return (
      <div className={`py-16 ${backgroundColor} text-white ${className}`}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  {title || "Ready to Get Started?"}
                </h2>
                <p className="text-xl text-electric-100 mb-6">
                  {subtitle || "Contact Berman Electric today for professional electrical services throughout Long Island"}
                </p>
                {showTrustSignals && (
                  <div className="space-y-2 mb-6">
                    {trustSignals.map((signal, index) => (
                      <div key={index} className="flex items-center gap-2 text-electric-100">
                        {signal.icon}
                        <span>{signal.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+15163614068"
                  className="flex items-center justify-center w-full px-6 py-4 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {primaryText}
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center w-full px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-800 transition-colors font-semibold"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {secondaryText}
                </Link>
                <div className="text-center text-electric-200 text-sm">
                  <p>✓ Free estimates ✓ Same-day service ✓ Upfront pricing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`py-8 bg-electric-700 text-white ${className}`}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {title || "Need Electrical Service?"}
              </h3>
              <p className="text-electric-200">
                {subtitle || "Call Long Island's trusted electrician today"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+15163614068"
                className="inline-flex items-center px-6 py-3 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4 mr-2" />
                {primaryText}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-electric-600 text-white rounded-lg hover:bg-electric-500 transition-colors font-semibold"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {secondaryText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`py-16 ${backgroundColor} text-white ${className}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {title || "Get Professional Electrical Services Today"}
          </h2>
          <p className="text-xl text-electric-100 mb-8">
            {subtitle || "Licensed electrician serving Long Island for over 20 years. Call now for fast, reliable service."}
          </p>
          
          {showTrustSignals && (
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-electric-200">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center gap-2">
                  {signal.icon}
                  <span className="text-sm">{signal.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15163614068"
              className="inline-flex items-center px-8 py-4 bg-white text-electric-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              {primaryText}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-electric-700 text-white rounded-lg hover:bg-electric-800 transition-colors font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {secondaryText}
            </Link>
          </div>

          <p className="mt-6 text-electric-200 text-sm">
            ✓ Free estimates • ✓ Licensed & insured • ✓ Same-day service available
          </p>
        </div>
      </div>
    </div>
  );
};

export default CTASection;