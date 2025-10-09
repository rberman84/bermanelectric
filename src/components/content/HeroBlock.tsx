import type { ContentHero } from "@/lib/content";

interface HeroBlockProps {
  hero: ContentHero;
}

const HeroBlock = ({ hero }: HeroBlockProps) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-electric-100 bg-gradient-to-br from-electric-900 via-electric-700 to-electric-500 p-10 text-white shadow-xl">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-10 right-6 h-64 w-64 rounded-full bg-electric-200/30 blur-3xl" />
      </div>
      <div className="relative grid gap-10 md:grid-cols-[2fr,1fr] md:items-center">
        <div>
          {hero.eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-electric-100">{hero.eyebrow}</p>}
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{hero.title}</h1>
          {hero.subtitle && <p className="mt-4 max-w-2xl text-lg text-electric-100">{hero.subtitle}</p>}
        </div>

        {hero.image && (
          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-lg backdrop-blur">
            <img src={hero.image.src} alt={hero.image.alt} className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
      </div>
      {hero.stats?.length ? (
        <dl className="relative mt-8 grid gap-6 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur md:grid-cols-3">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm uppercase tracking-wide text-electric-100">{stat.label}</dt>
              <dd className="mt-2 text-2xl font-semibold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
};

export default HeroBlock;
