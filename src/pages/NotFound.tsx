import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Home, Phone, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/media/ResponsiveImage";
import { toAbsoluteUrl } from "@/lib/url";

const quickLinks = [
  { label: "View Our Services", to: "/projects" },
  { label: "Read Electrical Tips", to: "/blog" },
  { label: "Explore Resources", to: "/resources" },
  { label: "See Customer Reviews", to: "/testimonials" },
];

const serviceAreas = [
  { label: "Electrician in Ronkonkoma", to: "/electrician-ronkonkoma" },
  { label: "Suffolk County Electrician", to: "/electrician-suffolk-county" },
  { label: "Long Island Service Area", to: "/electrician-long-island" },
];

const NotFound = () => {
  const location = useLocation();
  const canonical = toAbsoluteUrl(location.pathname);
const NotFound = () => {

  return (
    <>
      <SEO
        title="Page Not Found"
        description="We couldn't find the page you were looking for. Explore Berman Electric's licensed electrical services across Long Island."
        canonical={canonical}
        noindex
      />
      <Navbar />
      <main className="bg-slate-950 text-white pt-24">
        <div className="relative">
          <ResponsiveImage
            src="/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png"
            alt="Electrician working safely on an electrical panel"
            wrapperClassName="absolute inset-0 opacity-40"
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="relative z-10 px-4 pb-24 pt-12">
            <div className="container max-w-3xl text-center space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                <span className="text-electric-300">404</span> Page Not Found
              </p>
              <h1 className="text-4xl md:text-5xl font-bold">We can't find that circuit.</h1>
              <p className="text-lg text-slate-200">
                The page you're looking for may have moved or no longer exists. Try one of the trusted routes below or reach out and we'll help you get connected.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-electric-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-electric-400"
                >
                  <Home className="h-5 w-5" /> Back to Home
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" /> Contact Support
                </Link>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
                <Search className="h-4 w-4" />
                <span>Requested URL: {location.pathname}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white text-slate-900 py-16">
          <div className="container grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Popular Destinations</h2>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="inline-flex items-center gap-2 text-electric-700 hover:text-electric-500 font-medium">
                      <ArrowRight className="h-4 w-4" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Service Areas</h2>
              <ul className="space-y-2">
                {serviceAreas.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="inline-flex items-center gap-2 text-electric-700 hover:text-electric-500 font-medium">
                      <ArrowRight className="h-4 w-4" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-16 text-center">
          <div className="container max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-white">Need immediate assistance?</h2>
            <p className="text-slate-300">
              Our licensed electricians are on call 24/7 across Long Island. Call (516) 361-4068 and we'll help you restore power safely.
            </p>
            <a
              href="tel:+15163614068"
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-electric-700 shadow-md transition hover:bg-slate-100"
            >
              <Phone className="h-5 w-5" /> Call (516) 361-4068
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
