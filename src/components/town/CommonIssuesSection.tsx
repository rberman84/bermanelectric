import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface CommonIssuesSectionProps {
  town: TownData;
}

const CommonIssuesSection = ({ town }: CommonIssuesSectionProps) => {
  if (!town.commonIssues || town.commonIssues.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Common Electrical Issues in {town.name}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Based on decades of service in {town.name}, these are the most frequent electrical problems we encounter and how we solve them.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {town.commonIssues.map((issue, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {issue.title}
                  </h3>
                  <span className="inline-block px-3 py-1 text-sm font-medium text-amber-700 bg-amber-50 rounded-full">
                    {issue.prevalence}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">The Problem:</h4>
                  <p className="text-gray-700">{issue.description}</p>
                </div>
              </div>

              <div className="bg-electric-50 rounded-lg p-4 border border-electric-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-electric-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-electric-900 mb-1">Our Solution:</h4>
                    <p className="text-electric-800 text-sm">{issue.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Experiencing any of these issues in {town.name}?
          </p>
          <a
            href="tel:+15163614068"
            className="inline-flex items-center gap-2 px-6 py-3 bg-electric-600 text-white font-semibold rounded-lg hover:bg-electric-700 transition-colors"
          >
            Call for Fast Diagnosis: (516) 361-4068
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommonIssuesSection;
