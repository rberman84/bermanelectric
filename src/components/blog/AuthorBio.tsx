import { User, Phone, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthorBioProps {
  author: string;
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  // In a real app, this would come from a database
  const authorData = {
    "Rob Berman": {
      name: "Rob Berman",
      title: "Licensed Master Electrician",
      bio: "Rob Berman is a licensed master electrician with over 20 years of experience serving Long Island, NY. He specializes in residential and commercial electrical services, including panel upgrades, EV charger installations, and emergency electrical repairs. Rob is committed to electrical safety and education, helping homeowners understand their electrical systems.",
      credentials: [
        "Licensed Master Electrician (NY State)",
        "OSHA 30-Hour Certified",
        "Over 20 years experience on Long Island",
        "Fully insured and bonded"
      ],
      image: "/lovable-uploads/c867126f-321b-4d27-b41c-c3b7b160cd63.png",
      phone: "(516) 361-4068",
      email: "Rob@bermanelectrical.com"
    }
  };

  const author_info = authorData[author as keyof typeof authorData];
  
  if (!author_info) return null;

  return (
    <div className="bg-gradient-to-r from-electric-50 to-electric-100 border border-electric-200 rounded-lg p-6 mt-12">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-electric-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {author_info.name}
              </h3>
              <p className="text-electric-700 font-semibold mb-3">
                {author_info.title}
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {author_info.bio}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-electric-600 text-white rounded-lg hover:bg-electric-700 transition-colors text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Get a Quote
                </Link>
                <a
                  href={`mailto:${author_info.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-electric-600 border border-electric-600 rounded-lg hover:bg-electric-50 transition-colors text-sm font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  Contact Rob
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-2 pt-4 border-t border-electric-200">
            {author_info.credentials.map((credential, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <Shield className="w-4 h-4 text-electric-600 flex-shrink-0" />
                <span>{credential}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;