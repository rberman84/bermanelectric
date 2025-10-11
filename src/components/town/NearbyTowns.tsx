import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { towns, buildTownPath, type TownData } from "@/lib/townContent";

interface NearbyTownsProps {
  currentTown: TownData;
  maxTowns?: number;
}

const NearbyTowns = ({ currentTown, maxTowns = 6 }: NearbyTownsProps) => {
  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearby towns based on distance
  const nearbyTowns = towns
    .filter((town) => town.slug !== currentTown.slug)
    .map((town) => ({
      ...town,
      distance: calculateDistance(
        currentTown.coordinates.latitude,
        currentTown.coordinates.longitude,
        town.coordinates.latitude,
        town.coordinates.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxTowns);

  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Electrical Services in Nearby Towns
          </h2>
          <p className="mt-4 text-gray-600">
            We also serve these neighboring communities with the same expert electrical services.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nearbyTowns.map((town) => (
            <Link
              key={town.slug}
              to={buildTownPath(town.slug)}
              className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-electric-400 hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 text-electric-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-electric-600">
                    {town.name}, NY
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {town.seo.description}
                  </p>
                  <p className="mt-3 text-xs text-gray-500">
                    {town.distance.toFixed(1)} miles away
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyTowns;
