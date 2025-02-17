
import { Users, MapPin } from "lucide-react";

const TeamLocation = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Users className="w-12 h-12 text-electric-600" />
              <h3 className="text-2xl font-bold">Meet Our Team</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team consists of highly skilled electricians who are passionate about 
                delivering top-tier electrical solutions with a focus on quality, efficiency, 
                and customer satisfaction.
              </p>
            </div>
            <div className="space-y-4">
              <MapPin className="w-12 h-12 text-electric-600" />
              <h3 className="text-2xl font-bold">Committed to Long Island</h3>
              <p className="text-gray-700 leading-relaxed">
                As a Long Island-based company, we take pride in serving our local communities. 
                We're more than just an electrical contractor—we're your neighbors, problem-solvers, 
                and trusted partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLocation;
