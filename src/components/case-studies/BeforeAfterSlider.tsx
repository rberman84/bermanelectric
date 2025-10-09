import { useState } from "react";
import clsx from "clsx";
import type { CaseStudyFrontmatter } from "@/lib/caseStudies";

type BeforeAfterSliderProps = {
  before: CaseStudyFrontmatter["before"][number];
  after: CaseStudyFrontmatter["after"][number];
};

const BeforeAfterSlider = ({ before, after }: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Before & After</h2>
          <p className="text-sm text-muted-foreground">
            Drag the slider to compare the original condition with the finished installation.
          </p>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="h-1 w-full max-w-xs cursor-ew-resize appearance-none rounded-full bg-muted accent-primary focus:outline-none"
          aria-label="Adjust before and after comparison"
        />
      </header>

      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={after.src}
          alt={after.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={before.src}
            alt={before.alt}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ clipPath: "inset(0)" }}
          />
        </div>
        <div
          className="absolute inset-y-0"
          style={{ left: `calc(${position}% - 1px)` }}
        >
          <div className="h-full w-[2px] bg-white/80" />
          <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/60 text-xs font-semibold text-white">
            {`${Math.round(position)}%`}
          </div>
        </div>
      </div>

      <footer className="mt-4 grid gap-2 md:grid-cols-2">
        <div className={clsx("rounded-lg border bg-muted/30 p-3 text-sm", "border-dashed border-border/60")}
          aria-label="Before description"
        >
          <strong className="block text-xs uppercase tracking-wide text-muted-foreground">Before</strong>
          <span className="text-muted-foreground">{before.caption ?? before.alt}</span>
        </div>
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-sm" aria-label="After description">
          <strong className="block text-xs uppercase tracking-wide text-muted-foreground">After</strong>
          <span className="text-muted-foreground">{after.caption ?? after.alt}</span>
        </div>
      </footer>
    </section>
  );
};

export default BeforeAfterSlider;
