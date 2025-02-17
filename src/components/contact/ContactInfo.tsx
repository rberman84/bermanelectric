
import { Clock, Phone, Mail, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">📞 Get in Touch</h3>
        <div className="space-y-3">
          <a href="tel:+15163614068" className="flex items-center text-gray-700 hover:text-electric-600">
            <Phone className="w-5 h-5 mr-2" />
            516-361-4068
          </a>
          <a href="mailto:Rob@bermanelectrical.com" className="flex items-center text-gray-700 hover:text-electric-600">
            <Mail className="w-5 h-5 mr-2" />
            Rob@bermanelectrical.com
          </a>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-2 mt-1" />
            <span>Ronkonkoma, NY – Serving all of Long Island</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <Clock className="w-5 h-5 mr-2 mt-1" />
            <div>
              <p>Monday – Friday: 7:00 AM – 7:00 PM</p>
              <p>Saturday – Sunday: Emergency Services Available</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Service Areas</h3>
        <ul className="space-y-2">
          <li>✔ Nassau & Suffolk Counties</li>
          <li>✔ Ronkonkoma, Huntington, Massapequa, Smithtown, Babylon & More</li>
          <li>✔ Call us to see if we service your area!</li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Connect with Us!</h3>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-600 hover:text-blue-700">Facebook</a>
          <a href="#" className="text-pink-600 hover:text-pink-700">Instagram</a>
          <a href="#" className="text-blue-800 hover:text-blue-900">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
