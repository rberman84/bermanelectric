import { Car, Route } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface DrivingDirectionsProps {
  town: TownData;
}

const DrivingDirections = ({ town }: DrivingDirectionsProps) => {
  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-100 bg-gradient-to-r from-white via-gray-50 to-white p-10 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Route className="h-8 w-8 text-electric-600" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Driving Directions from HQ to {town.name}
                </h2>
                <p className="text-sm text-gray-500">{town.drivingDirections.summary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-electric-50 px-4 py-2 text-sm text-electric-700">
              <Car className="h-4 w-4" />
              {town.drivingDirections.startingPoint}
            </div>
          </div>

          <ol className="mt-8 space-y-6">
            {town.drivingDirections.steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-electric-600 text-lg font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default DrivingDirections;
