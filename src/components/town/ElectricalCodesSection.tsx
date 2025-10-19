import { FileText, AlertCircle } from "lucide-react";
import type { TownData } from "@/lib/townContent";

interface ElectricalCodesSectionProps {
  town: TownData;
}

const ElectricalCodesSection = ({ town }: ElectricalCodesSectionProps) => {
  if (!town.electricalCodes || town.electricalCodes.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {town.name} Electrical Code Requirements
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Local electrical codes and permit requirements specific to {town.name} that ensure your project meets all safety and compliance standards.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Licensed & Compliant in {town.name}
                </h3>
                <p className="text-blue-800 text-sm">
                  Berman Electric holds all necessary licenses for {town.name} and stays current with local code amendments. 
                  We handle permit applications, inspections, and final sign-offs so your project proceeds without delays.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {town.electricalCodes.map((code, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:border-electric-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-electric-100 p-3">
                    <FileText className="h-6 w-6 text-electric-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {code.topic}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-semibold text-electric-700 uppercase tracking-wide">
                          Requirement:
                        </span>
                        <p className="mt-1 text-gray-700">{code.requirement}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Details:
                        </span>
                        <p className="mt-1 text-gray-600 text-sm">{code.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Need Help with Permits or Code Compliance?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team handles all permitting and ensures your {town.name} electrical project meets current code requirements. 
              We work directly with local inspectors for smooth approvals.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-electric-600 text-white font-semibold rounded-lg hover:bg-electric-700 transition-colors"
            >
              Get Compliant Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectricalCodesSection;
