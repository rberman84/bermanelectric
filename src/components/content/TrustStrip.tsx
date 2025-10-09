import type { TrustStripItem } from "@/lib/content";

interface TrustStripProps {
  headline: string;
  items: TrustStripItem[];
}

const TrustStrip = ({ headline, items }: TrustStripProps) => {
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-gray-700 md:max-w-xs">{headline}</h3>
        <div className="flex flex-wrap justify-center gap-6 md:justify-end">
          {items.map((item) => (
            <div
              key={item.alt}
              className="flex h-12 w-28 items-center justify-center rounded-lg border border-gray-100 bg-white p-3 shadow-inner"
            >
              <img src={item.logo} alt={item.alt} className="max-h-full max-w-full object-contain opacity-80" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
