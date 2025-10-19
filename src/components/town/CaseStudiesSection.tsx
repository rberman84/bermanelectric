import { Building2, Lightbulb, TrendingUp, Quote } from "lucide-react";
import type { TownData } from "@/lib/townContent";
import { CheckCircle2 } from "lucide-react";

interface CaseStudiesSectionProps {
  town: TownData;
}

const CaseStudiesSection = ({ town }: CaseStudiesSectionProps) => {
  if (!town.caseStudies || town.caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Real Projects in {town.name}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Success stories from {town.name} homeowners and businesses who trusted Berman Electric with their electrical projects.
          </p>
        </div>

        <div className="space-y-12">
          {town.caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="rounded-xl bg-electric-100 p-4">
                    <Building2 className="h-8 w-8 text-electric-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {study.title}
                    </h3>
                    <p className="text-electric-600 font-medium flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-electric-600 rounded-full"></span>
                      {study.location}
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-amber-100 p-2">
                        <Lightbulb className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">The Challenge</h4>
                        <p className="text-gray-700 text-sm">{study.challenge}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Our Solution</h4>
                        <p className="text-gray-700 text-sm">{study.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-electric-50 rounded-xl p-6 mb-8">
                  <h4 className="font-semibold text-electric-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-electric-600" />
                    Project Results
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {study.results.map((result, resultIndex) => (
                      <li key={resultIndex} className="flex items-start gap-2 text-sm text-electric-800">
                        <span className="inline-block w-1.5 h-1.5 bg-electric-600 rounded-full mt-1.5 flex-shrink-0"></span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {study.testimonial && (
                  <div className="border-l-4 border-electric-600 bg-gray-50 rounded-r-xl p-6">
                    <Quote className="h-8 w-8 text-electric-300 mb-3" />
                    <p className="text-gray-700 italic mb-4">"{study.testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-electric-200 flex items-center justify-center">
                        <span className="text-electric-700 font-bold text-lg">
                          {study.testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{study.testimonial.author}</p>
                        <p className="text-sm text-gray-600">{study.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Ready to start your {town.name} electrical project?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15163614068"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-electric-600 text-white font-semibold rounded-lg hover:bg-electric-700 transition-colors"
            >
              Call: (516) 361-4068
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-electric-600 text-electric-600 font-semibold rounded-lg hover:bg-electric-50 transition-colors"
            >
              Request Free Estimate
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
