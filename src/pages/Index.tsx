import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";

function StarterHero() {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] md:min-h-[80svh] grid place-items-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Berman Electric</h1>
        <p className="text-lg md:text-2xl text-white/80">Licensed electricians serving Long Island</p>
      </div>
    </section>
  );
}

function TallContent() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Section {i + 1}</h3>
              <p className="text-gray-600">This placeholder content guarantees the page height exceeds the viewport so scrolling works. Replace with your real sections.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SEO 
        title="Berman Electric - Licensed Electrician Long Island NY"
        description="Trusted licensed electrician serving Long Island, Suffolk County & Ronkonkoma NY. 20+ years experience in residential & commercial electrical services. Emergency repairs, panel upgrades, EV charger installation. Call (516) 361-4068"
        keywords="electrician Long Island, licensed electrician Suffolk County, electrical services Ronkonkoma NY, emergency electrician Nassau County, panel upgrades, lighting installation, EV charger installation, generator installation, electrical repairs"
        canonical="https://bermanelectrical.com/"
      />
      <Navbar />
      <main className="grow pt-20">
        <StarterHero />
        <TallContent />
      </main>
      <Footer />
    </div>
  );
}
