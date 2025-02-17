
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ContactCTA = () => {
  return (
    <div className="py-16 bg-electric-600">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Get in Touch
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Looking for a reliable, experienced electrician? Berman Electric is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:+15163614068"
              className="inline-flex items-center px-6 py-3 text-electric-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us: (516) 361-4068
            </a>
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Request a Quote Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCTA;
