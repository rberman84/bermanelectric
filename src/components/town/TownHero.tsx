import { MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface TownHeroProps {
  town: TownData;
}

const TownHero = ({ town }: TownHeroProps) => {
  return (
    <section className="bg-gradient-to-r from-electric-900 via-electric-800 to-electric-700 text-white">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
              <Sparkles className="h-4 w-4" /> Suffolk County Town Page Kit
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {town.hero.heading || `Licensed Electricians in ${town.name}, NY`}
            </h1>
            <p className="mt-6 text-lg text-white/90">
              {town.hero.subheading}
            </p>
            <p className="mt-6 text-base text-white/80">
              {town.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-electric-700 shadow-lg transition hover:bg-electric-100"
              >
                {town.hero.ctaLabel || `Book ${town.name} Electrician`}
              </a>
              <a
                href="tel:+15163614068"
                className="inline-flex items-center rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Call (516) 361-4068
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur">
            <div className="flex items-center gap-3 text-white">
              <MapPin className="h-6 w-6" />
              <div>
                <p className="text-sm uppercase tracking-wide text-white/70">Service Area</p>
                <p className="text-lg font-semibold">{town.serviceArea}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm font-semibold text-white/80">Neighborhoods</p>
                <ul className="mt-3 space-y-1 text-sm text-white/70">
                  {town.neighborhoods.map((neighborhood) => (
                    <li key={neighborhood}>• {neighborhood}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm font-semibold text-white/80">Notable Landmarks</p>
                <ul className="mt-3 space-y-1 text-sm text-white/70">
                  {town.landmarks.map((landmark) => (
                    <li key={landmark}>• {landmark}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/5 p-4 text-sm text-white/80">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
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
