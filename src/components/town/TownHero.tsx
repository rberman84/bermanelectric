import { MapPin, ShieldCheck, Sparkles, Phone, Star, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { TownData } from "@/lib/townContent";

interface TownHeroProps {
  town: TownData;
}

const TownHero = ({ town }: TownHeroProps) => {
  // Determine county based on slug
  const isNassauCounty = ['garden-city', 'great-neck', 'manhasset', 'port-washington', 'roslyn', 'oyster-bay', 'glen-cove', 'hempstead', 'freeport', 'long-beach', 'valley-stream', 'mineola', 'westbury', 'new-hyde-park', 'floral-park'].includes(town.slug);
  const countyName = isNassauCounty ? 'Nassau County' : 'Suffolk County';
  const countyLink = isNassauCounty ? '/locations/nassau-county' : '/locations/suffolk-county';

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
      </div>

      <div className="container relative py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            {/* Breadcrumb-style context */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/locations" className="hover:text-primary transition-colors">Service Areas</Link>
              <span>/</span>
              <Link to={countyLink} className="hover:text-primary transition-colors">{countyName}</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{town.name}</span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-4 w-4" /> Licensed {countyName} Electrician
            </span>
            
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-foreground leading-[0.95] tracking-tight">
              Electrician in {town.name}, NY
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
              {town.hero.subheading}
            </p>
            
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {town.intro}
            </p>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9 Rating
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" /> Same-Day Service
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Licensed & Insured
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+15163614068"
                className="inline-flex items-center rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
              >
                <Phone className="w-5 h-5 mr-2" />
                (516) 361-4068
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border-2 border-primary px-8 py-4 font-semibold text-primary transition hover:bg-primary/5"
              >
                {town.hero.ctaLabel || `Get ${town.name} Quote`}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-card backdrop-blur p-8 shadow-lg border border-border">
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Service Area</p>
                <p className="text-lg font-semibold">{town.serviceArea}</p>
              </div>
            </div>
            
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-muted p-4">
                <p className="text-sm font-semibold text-foreground">Neighborhoods We Serve</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {town.neighborhoods.map((neighborhood) => (
                    <li key={neighborhood} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      {neighborhood}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-sm font-semibold text-foreground">Local Landmarks</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {town.landmarks.map((landmark) => (
                    <li key={landmark} className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-foreground">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <p>
                <strong>Full permit coordination</strong> with the Town of {town.name} Building Department. 
                ZIP codes: {town.zipCodes.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TownHero;
