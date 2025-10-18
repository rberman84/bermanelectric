import { MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface TownHeroProps {
  town: TownData;
}

const TownHero = ({ town }: TownHeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
      </div>

      <div className="container relative py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-gray-700">
              <Sparkles className="h-4 w-4" /> Suffolk County Service Area
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-foreground leading-[0.95] tracking-tight">
              {town.hero.heading || `Licensed Electricians in ${town.name}, NY`}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 font-normal leading-relaxed">
              {town.hero.subheading}
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              {town.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center rounded-full bg-foreground px-8 py-4 font-semibold text-background shadow-lg transition hover:opacity-90"
              >
                {town.hero.ctaLabel || `Book ${town.name} Electrician`}
              </a>
              <a
                href="tel:+15163614068"
                className="inline-flex items-center rounded-full border-2 border-foreground px-8 py-4 font-semibold text-foreground transition hover:bg-foreground/5"
              >
                Call (516) 361-4068
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur p-8 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="h-6 w-6" />
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Service Area</p>
                <p className="text-lg font-semibold">{town.serviceArea}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Neighborhoods</p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {town.neighborhoods.map((neighborhood) => (
                    <li key={neighborhood}>• {neighborhood}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Notable Landmarks</p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {town.landmarks.map((landmark) => (
                    <li key={landmark}>• {landmark}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <p>
                Permit coordination, code compliance, and inspection scheduling handled for {town.name} projects. Zip codes served: {town.zipCodes.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TownHero;
