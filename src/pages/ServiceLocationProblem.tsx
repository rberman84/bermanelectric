import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Shield, AlertTriangle, CheckCircle2, Wrench, MapPin } from "lucide-react";
import { allTowns, towns as suffolkTowns } from "@/lib/townContent";
import { electricalProblems } from "@/data/electricalProblems";
import ServiceSchema from "@/components/schema/ServiceSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ServiceLocationProblem = () => {
  const { service, town, problem } = useParams<{ service: string; town: string; problem: string }>();
  
  const townData = allTowns.find(t => t.slug === town);
  const problemData = electricalProblems.find(p => p.slug === problem);
  
  if (!townData || !problemData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine county
  const county = suffolkTowns.find(t => t.slug === town) ? "Suffolk County" : "Nassau County";

  const serviceNames: Record<string, string> = {
    "residential": "Residential Electrical",
    "emergency": "Emergency Electrical",
    "panel-upgrades": "Panel Upgrade",
    "ev-charger": "EV Charger Installation",
    "lighting": "Lighting Installation",
    "commercial": "Commercial Electrical"
  };

  const serviceName = serviceNames[service || "residential"] || "Electrical";
  const pageTitle = `${problemData.name} in ${townData.name} | ${serviceName} Service`;
  const description = `Expert ${problemData.name.toLowerCase()} repair in ${townData.name}, ${county}. ${problemData.urgency === "emergency" ? "Emergency 24/7 service." : "Licensed electrician available."} Call (516) 361-4068 for immediate help.`;

  const urgencyColors = {
    emergency: "text-red-600 bg-red-50 border-red-200",
    urgent: "text-orange-600 bg-orange-50 border-orange-200",
    routine: "text-blue-600 bg-blue-50 border-blue-200"
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: county, url: `/locations/${county.toLowerCase().replace(" ", "-")}` },
    { name: townData.name, url: `/locations/${townData.slug}` },
    { name: serviceName, url: `/services/${service}/${townData.slug}` },
    { name: problemData.name, url: window.location.pathname }
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://bermanelectrical.com/services/${service}/${town}/${problem}`} />
      </Helmet>

      <ServiceSchema
        serviceName={`${problemData.name} Repair in ${townData.name}`}
        serviceType="Electrical Repair Service"
        description={description}
        url={`https://bermanelectrical.com/services/${service}/${town}/${problem}`}
        areaServed={[townData.name, county]}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border ${urgencyColors[problemData.urgency]}`}>
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold uppercase text-sm">
                    {problemData.urgency === "emergency" ? "Emergency Service Available" : 
                     problemData.urgency === "urgent" ? "Urgent Attention Required" : 
                     "Professional Service"}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {problemData.name} Repair in {townData.name}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Licensed electrician serving {townData.name}, {county}. {problemData.urgency === "emergency" ? "Available 24/7 for emergencies." : "Same-day service available."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" className="text-lg px-8" asChild>
                    <a href="tel:516-361-4068">
                      <Phone className="mr-2 h-5 w-5" />
                      Call (516) 361-4068
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                    <Link to="/contact">Request Service</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Typical Fix: {problemData.timeToFix}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Serving {townData.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Warning */}
          {problemData.safetyWarning && (
            <section className="py-8 bg-red-50">
              <div className="container mx-auto px-4">
                <Alert className="max-w-4xl mx-auto border-red-300 bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900 font-semibold">
                    {problemData.safetyWarning}
                  </AlertDescription>
                </Alert>
              </div>
            </section>
          )}

          {/* Problem Overview */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Understanding {problemData.name} in {townData.name}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {problemData.description} If you're experiencing this issue in {townData.name} or nearby areas of {county}, Berman Electric provides expert {problemData.urgency === "emergency" ? "emergency" : "professional"} electrical services.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Common Symptoms
                    </h3>
                    <ul className="space-y-2">
                      {problemData.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      Common Causes
                    </h3>
                    <ul className="space-y-2">
                      {problemData.causes.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Solutions Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Professional Solutions We Provide</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our licensed electricians serving {townData.name} use proven methods to diagnose and repair {problemData.name.toLowerCase()} issues:
                </p>

                <div className="grid gap-4 mb-8">
                  {problemData.solutions.map((solution, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-card p-4 rounded-lg border">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{solution}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cost & Timeline</h3>
                      <p className="text-muted-foreground mb-2">
                        <strong>Estimated Cost:</strong> {problemData.estimatedCost}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Typical Repair Time:</strong> {problemData.timeToFix}
                      </p>
                      <p className="text-sm text-muted-foreground mt-3">
                        *Actual costs may vary based on the severity of the issue and specific requirements in {townData.name}. We provide free estimates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prevention Tips */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Preventing {problemData.name} Issues</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Protect your {townData.name} home or business with these preventive measures:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {problemData.preventionTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Local Service Area */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Serving {townData.name} & Surrounding Areas</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Berman Electric provides expert electrical services throughout {county}, including {townData.name} and nearby communities. Our licensed electricians are familiar with local building codes and can respond quickly to your electrical emergency.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="tel:516-361-4068">
                      <Phone className="mr-2 h-5 w-5" />
                      Emergency: (516) 361-4068
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to={`/locations/${townData.slug}`}>
                      View All {townData.name} Services
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ServiceLocationProblem;