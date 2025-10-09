
import { Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DynamicPhoneLink } from "@/components/shared/DynamicPhone";

const ProjectsCTA = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate('/contact');
  };

  return (
    <div className="py-16 bg-electric-600">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let's Power Your Next Project!
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Whether you're planning a new construction, electrical upgrade, or emergency repair, 
            Berman Electric is ready to deliver expert solutions tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <DynamicPhoneLink
              className="inline-flex items-center px-6 py-3 text-electric-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              {(display) => (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  {`Call Us: ${display}`}
                </>
              )}
            </DynamicPhoneLink>
            <button
              onClick={handleGetQuote}
              className="inline-flex items-center px-6 py-3 text-white bg-electric-700 rounded-lg hover:bg-electric-800 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Request a Free Quote
            </button>
          </div>
          <p className="text-white/90 mt-8 font-semibold">
            Berman Electric – Experience. Innovation. Reliability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCTA;
