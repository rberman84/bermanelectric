import { useState } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, className }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(60);

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl shadow-lg", className)}>
      <div className="absolute inset-0">
        <img src={afterImage} alt="Completed electrical panel" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0" style={{ width: `${position}%` }}>
        <img src={beforeImage} alt="Existing electrical panel" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      </div>
      <div className="relative flex items-center justify-center py-6">
        <div className="w-full max-w-sm">
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Slide to compare before and after"
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/80 uppercase tracking-wide mt-2">
            <span>Before</span>
            <span>After</span>
          </div>
        </div>
      </div>
    </div>
  );
}
