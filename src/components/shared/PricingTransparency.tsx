import { DollarSign, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PricingTransparency = () => {
  const pricingItems = [
    {
      icon: <Zap className="w-6 h-6" />,
      service: "Service Calls",
      price: "Starting at $99",
      description: "Standard diagnostic and repair visits",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      service: "Panel Upgrades",
      price: "From $1,200",
      description: "Complete electrical panel replacement",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      service: "Free Estimates",
      price: "$0",
      description: "For all projects over $500",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-cream-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Transparent <span className="text-electric-600">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No surprises. Just honest pricing for quality work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {pricingItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-electric-600 hover:shadow-lg transition-all"
            >
              <div className="text-electric-600 mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{item.service}</h3>
              <p className="text-3xl font-bold text-electric-600 mb-3">{item.price}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-electric-600 rounded-full hover:bg-electric-700 transition-all hover:scale-105 shadow-lg"
          >
            Get Your Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingTransparency;
