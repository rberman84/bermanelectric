import { Star } from "lucide-react";

const reviews = [
  {
    quote: "Showed up within the hour and had power back in our kitchen before dinner.",
    name: "Megan • Ronkonkoma",
  },
  {
    quote: "Clean, professional install on our EV charger. Price matched the quote exactly.",
    name: "Justin • Lake Grove",
  },
  {
    quote: "Explained every option and left everything spotless. Highly recommend.",
    name: "Priya • Holbrook",
  },
];

export const SocialProofRail = () => {
  return (
    <aside className="hidden xl:flex xl:flex-col xl:items-stretch xl:gap-4 xl:fixed xl:right-8 xl:top-32 xl:w-80">
      <div className="flex items-center gap-3 rounded-2xl bg-white/90 px-5 py-4 shadow-lg shadow-black/10 ring-1 ring-white/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-electric-100 text-electric-700">
          <Star className="h-6 w-6 fill-current" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">4.9 average from 180+ Long Island homeowners</p>
          <p className="text-xs text-gray-500">Last booking 14 minutes ago</p>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <blockquote
            key={review.quote}
            className="rounded-2xl bg-white/85 p-5 text-sm text-gray-700 shadow-md shadow-black/5 ring-1 ring-white/60 backdrop-blur"
          >
            <p className="italic">“{review.quote}”</p>
            <footer className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {review.name}
            </footer>
          </blockquote>
        ))}
      </div>
    </aside>
  );
};

export default SocialProofRail;
