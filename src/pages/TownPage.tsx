import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";

import JobsMap from "@/components/JobsMap";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TownData } from "@/lib/towns";

interface TownPageProps {
  town: TownData;
}

const TownPage: React.FC<TownPageProps> = ({ town }) => {
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Berman Electric — " + town.name,
      "image": town.localPhotos[0]?.src ?? town.heroImage,
      "url": town.seo.canonical,
      "description": town.seo.description,
      "areaServed": town.zipCodes.map((zip) => ({
        "@type": "PostalCodeRangeSpecification",
        postalCodeBegin: zip,
        postalCodeEnd: zip,
      })),
      "serviceType": town.serviceHighlights,
      "hasMap": `https://www.google.com/maps/search/?api=1&query=${town.center.lat},${town.center.lng}`,
      "makesOffer": town.landmarks.map((landmark) => ({
        "@type": "Offer",
        areaServed: town.name,
        itemOffered: {
          "@type": "Service",
          name: `${landmark.name} electrical support`,
          description: landmark.description,
        },
      })),
    }),
    [town]
  );

  const primaryLandmark = town.landmarks[0]?.name ?? "local facilities";
  const secondaryLandmark = town.landmarks[1]?.name ?? "neighboring properties";
  const topLandmarks = town.landmarks
    .map((landmark) => landmark.name)
    .slice(0, 2)
    .filter(Boolean)
    .join(", ");

  return (
    <main className="bg-slate-50">
      <Helmet>
        <title>{town.seo.title}</title>
        <meta name="description" content={town.seo.description} />
        <link rel="canonical" href={town.seo.canonical} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(12, 74, 110, 0.75), rgba(15, 118, 110, 0.55)), url(${town.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 text-white sm:py-28">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-100">
            Electrician — {town.name}, NY {town.zipCodes.join(", ")}
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            {town.headline}
          </h1>
          <p className="max-w-2xl text-lg text-teal-50 sm:text-xl">
            {town.subheadline}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-white/90">
              <a href="/contact" title="Schedule service">
                Schedule Service Call
              </a>
            </Button>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Avg. arrival {town.drivingDirections.travelTimeMinutes} minutes from HQ
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <article className="space-y-8 rounded-3xl bg-white p-8 shadow-sm">
            <header className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">
                What we handle in {town.name}
              </h2>
              <p className="text-base text-slate-600">
                We keep {town.name}'s signature destinations powered — from {primaryLandmark} to {secondaryLandmark} — with rapid response teams who already know every loading zone and access panel.
              </p>
            </header>
            <Separator />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900">Landmark coverage</h3>
                <ul className="space-y-3">
                  {town.landmarks.map((landmark) => (
                    <li key={landmark.name} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <h4 className="font-semibold text-slate-800">{landmark.name}</h4>
                      <p className="text-sm text-slate-600">{landmark.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900">Signature service packages</h3>
                <ul className="space-y-3">
                  {town.serviceHighlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
                    >
                      <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                      <p className="text-sm text-slate-700">{highlight}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl bg-slate-900/90 p-5 text-white">
                  <p className="text-sm uppercase tracking-wide text-emerald-200">
                    Dispatch facts
                  </p>
                  <p className="mt-2 text-sm text-emerald-50">
                    We depart HQ via {town.drivingDirections.fromHq} — arriving in roughly {town.drivingDirections.travelTimeMinutes} minutes across {town.zipCodes.join(", ")}.
                  </p>
                  <p className="mt-3 text-xs text-emerald-100/90">
                    Typical route: {town.drivingDirections.fromHq}
                  </p>
                </div>
              </div>
            </div>
          </article>
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Quick details</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li><strong className="font-semibold text-slate-800">ZIP codes:</strong> {town.zipCodes.join(", ")}</li>
                <li>
                  <strong className="font-semibold text-slate-800">Distance from HQ:</strong> {town.drivingDirections.distanceMiles} miles
                </li>
                <li>
                  <strong className="font-semibold text-slate-800">Average dispatch time:</strong> {town.drivingDirections.travelTimeMinutes} minutes
                </li>
                {topLandmarks && (
                  <li>
                    <strong className="font-semibold text-slate-800">Primary landmarks:</strong> {topLandmarks}
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-emerald-900">Need rapid help?</h3>
              <p className="mt-2 text-sm text-emerald-800">
                Call 24/7 dispatch at <a href="tel:16316422100" className="font-semibold underline">(631) 642-2100</a> and reference the {town.name} crew.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-semibold text-slate-900">Local field gallery</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            These on-site captures highlight recent lighting, power, and safety upgrades across {town.name}. Every crew photo is geo-tagged for quality assurance.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {town.localPhotos.map((photo) => (
              <figure
                key={photo.src}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="p-4 text-sm text-slate-700">{photo.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <JobsMap jobs={town.jobs} townCenter={town.center} townName={town.name} />
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Driving directions from HQ</h2>
              <p className="text-sm text-slate-600">
                {town.drivingDirections.fromHq}
              </p>
              <p className="text-sm text-slate-600">
                Expect roughly {town.drivingDirections.distanceMiles} miles on the truck odometer. We stage materials before rolling so night crews can deploy without delay.
              </p>
            </article>
            <nav className="space-y-3" aria-label="Related service pages">
              <h3 className="text-lg font-semibold text-slate-900">Explore more support</h3>
              <ul className="space-y-3">
                {town.internalLinks.map((link) => (
                  <li key={link.to}>
                    <a
                      href={link.to}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TownPage;
