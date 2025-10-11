import { Phone, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TownData } from "@/lib/townContent";

interface TownCTAProps {
  town: TownData;
}

const TownCTA = ({ town }: TownCTAProps) => {
  return (
    <section className="bg-gradient-to-br from-electric-600 via-electric-700 to-electric-800 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready for Expert Electrical Service in {town.name}?
            </h2>
            <p className="text-xl text-electric-100 max-w-2xl mx-auto">
              Licensed electrician serving {town.neighborhoods.slice(0, 3).join(", ")} and surrounding {town.name} communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <Phone className="h-8 w-8 text-electric-200 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Call Now</h3>
              <a 
                href="tel:+15163614068" 
                className="text-2xl font-bold text-white hover:text-electric-200 transition-colors"
              >
                (516) 361-4068
              </a>
              <p className="text-sm text-electric-200 mt-2">24/7 Emergency Available</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <MapPin className="h-8 w-8 text-electric-200 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Service Area</h3>
              <p className="text-electric-100">
                {town.name}, NY
              </p>
              <p className="text-sm text-electric-200 mt-2">
                ZIP: {town.zipCodes.join(", ")}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <Calendar className="h-8 w-8 text-electric-200 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Response Time</h3>
              <p className="text-electric-100">
                {town.drivingDirections.summary}
              </p>
              <p className="text-sm text-electric-200 mt-2">Same-day service available</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-electric-700 hover:bg-electric-50 text-lg px-8"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule Service Online
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
              onClick={() => window.location.href = 'tel:+15163614068'}
            >
              Call for Emergency
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-electric-100 text-sm">
              NY License #ME-44927 • Fully Insured • Serving {town.name} Since 2003
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TownCTA;
