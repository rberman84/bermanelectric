
import { MessageSquare, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ReviewCTA = () => {
  return (
    <div className="py-16 bg-electric-600">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Leave Your Review!
          </h2>
          <p className="text-lg text-white/90 mb-8">
            We love hearing from our clients! If you've worked with Berman Electric, 
            please share your experience with us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a 
              href="#review-form"
              className="inline-flex items-center px-6 py-3 text-electric-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Submit Your Review
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:+15163614068"
              className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us: (516) 361-4068
            </a>
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Request a Free Quote
            </Link>
          </div>
          <p className="text-white/90 mt-8 font-semibold">
            Berman Electric – Powering Homes & Businesses with Excellence!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCTA;
