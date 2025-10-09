
import { Link } from "react-router-dom";

export function BookNowStrip() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-neutral-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 text-white">
        <div className="text-sm md:text-base">
          <span className="font-semibold">Need an electrician?</span> Book a service in 60 seconds.
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/dashboard" 
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 transition"
          >
            Book Now
          </Link>
          <Link 
            to="/dashboard" 
            className="rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Get Estimate
          </Link>
        </div>
      </div>
    </div>
  );
}
