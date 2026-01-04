import { CalendarDays, Calculator, Zap } from "lucide-react";
import BookingCalendar from "@/components/shared/BookingCalendar";
import CostEstimator from "@/components/shared/CostEstimator";
import AiTroubleshootChat from "@/components/shared/AiTroubleshootChat";

const QuickTools = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-foreground mb-3">
            Quick Tools
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get started in seconds — book online, estimate costs, or diagnose your electrical issue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Book Online */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Book Online</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule your appointment in minutes with our smart booking system
            </p>
            <BookingCalendar />
          </div>

          {/* Cost Estimator */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cost Estimator</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get an instant estimate for common electrical services
            </p>
            <CostEstimator />
          </div>

          {/* AI Troubleshooter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Troubleshooter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Describe your issue and get instant diagnostic help
            </p>
            <AiTroubleshootChat />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickTools;
