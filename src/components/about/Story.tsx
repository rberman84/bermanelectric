
import { CheckCircle2 } from "lucide-react";

const Story = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Story</h2>
            <div className="w-24 h-1 bg-electric-600 mx-auto"></div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-10 md:p-12 shadow-sm border border-gray-100">
            <p className="text-lg text-gray-700 mb-10 leading-relaxed text-center max-w-3xl mx-auto">
              Berman Electric was founded with a clear mission: to provide expert electrical solutions with integrity, precision, and professionalism. Over the years, we've grown into a leading electrical contractor known for:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-electric-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Industry Expertise</h3>
                  <p className="text-gray-700">High-quality workmanship backed by industry expertise</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-electric-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Personal Touch</h3>
                  <p className="text-gray-700">Exceptional customer service with a personal touch</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-electric-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Modern Solutions</h3>
                  <p className="text-gray-700">Innovative solutions tailored to modern electrical needs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-electric-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Safety Standards</h3>
                  <p className="text-gray-700">Strict adherence to safety standards & local electrical codes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
