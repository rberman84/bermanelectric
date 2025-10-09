import type { TownData } from "@/lib/townContent";

interface TownMapProps {
  town: TownData;
}

const TownMap = ({ town }: TownMapProps) => {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(town.map.query)}&output=embed`;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Licensed Electricians Near {town.name}</h2>
            <p className="mt-4 text-gray-600">{town.map.description}</p>
            {town.map.note && (
              <p className="mt-4 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
                {town.map.note}
              </p>
            )}
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4 shadow">
                <dt className="text-sm font-semibold text-gray-500">Coordinates</dt>
                <dd className="mt-2 text-gray-700">
                  {town.coordinates.latitude.toFixed(4)}, {town.coordinates.longitude.toFixed(4)}
                </dd>
              </div>
              <div className="rounded-xl bg-white p-4 shadow">
                <dt className="text-sm font-semibold text-gray-500">Zip Codes Covered</dt>
                <dd className="mt-2 text-gray-700">{town.zipCodes.join(", ")}</dd>
              </div>
            </dl>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <iframe
              title={`${town.name} service map`}
              src={mapSrc}
              className="h-[420px] w-full"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TownMap;
