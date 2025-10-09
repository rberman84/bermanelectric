import { useState } from "react";
import type { BeforeAfterImage } from "@/lib/content";

interface BeforeAfterSliderProps {
  before: BeforeAfterImage;
  after: BeforeAfterImage;
}

const BeforeAfterSlider = ({ before, after }: BeforeAfterSliderProps) => {
  const [value, setValue] = useState(50);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-[360px] w-full">
        <img src={after.src} alt={after.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${value}%` }}
        >
          <img src={before.src} alt={before.alt} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/80 shadow-lg backdrop-blur">
            <span className="text-xs font-semibold text-electric-700">{value}%</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-3 p-6">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="h-2 w-full cursor-pointer rounded-full bg-electric-100"
        />
        <div className="flex w-full justify-between text-sm font-semibold text-gray-600">
          <span>{before.label || "Before"}</span>
          <span>{after.label || "After"}</span>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
