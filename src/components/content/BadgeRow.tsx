import type { BadgeItem } from "@/lib/content";

interface BadgeRowProps {
  badges: BadgeItem[];
}

const BadgeRow = ({ badges }: BadgeRowProps) => {
  if (!badges?.length) return null;

  return (
    <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur md:grid-cols-3">
      {badges.map((badge) => (
        <div key={badge.label} className="rounded-xl border border-electric-100 bg-electric-50/40 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-electric-600">{badge.label}</p>
          {badge.description && <p className="mt-2 text-sm text-gray-600">{badge.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default BadgeRow;
