import type { ProcessStep } from "@/lib/content";

interface ProcessTimelineProps {
  title: string;
  steps: ProcessStep[];
}

const ProcessTimeline = ({ title, steps }: ProcessTimelineProps) => {
  if (!steps?.length) return null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-2xl border border-electric-100 bg-electric-50/40 p-6">
            <span className="absolute -top-4 left-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-electric-600 text-sm font-semibold text-white shadow-lg">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-electric-900">{step.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessTimeline;
