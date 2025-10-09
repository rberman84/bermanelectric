interface EstimateCTAProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  phoneNumber?: string;
}

const EstimateCTA = ({
  eyebrow,
  title,
  description,
  primaryLabel = "Request an Estimate",
  primaryHref = "/contact",
  secondaryLabel = "Call Now",
  phoneNumber = "631-715-1273"
}: EstimateCTAProps) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-electric-900 via-electric-700 to-electric-500 text-white shadow-xl">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-12 left-8 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-16 right-16 h-56 w-56 rounded-full bg-electric-200/20 blur-3xl" />
      </div>

      <div className="relative grid gap-6 p-10 md:grid-cols-[2fr,1fr] md:items-center">
        <div>
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-electric-100">{eyebrow}</p>}
          <h2 className="mt-1 text-3xl font-bold md:text-4xl">{title}</h2>
          {description && <p className="mt-3 max-w-xl text-electric-50">{description}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-electric-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-electric-100"
            >
              {primaryLabel}
            </a>
            <a
              href={`tel:${phoneNumber.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              {secondaryLabel}
              <span className="ml-2 font-mono">{phoneNumber}</span>
            </a>
          </div>
        </div>

        <div className="relative rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-electric-100">License & Insurance</dt>
              <dd className="font-semibold">Verified Suffolk & Nassau</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-electric-100">Response Time</dt>
              <dd className="font-semibold">Same-day for emergencies</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-electric-100">Transparent Pricing</dt>
              <dd className="font-semibold">Itemized, no surprise fees</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default EstimateCTA;
