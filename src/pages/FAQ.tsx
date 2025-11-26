import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, HelpCircle, Zap, Shield, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FAQSchema from "@/components/schema/FAQSchema";

const FAQ = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const commonQuestions = [
    {
      question: "How much does it cost to upgrade an electrical panel?",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      question: "Do I need a permit for electrical work in Suffolk County?",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      question: "How long does EV charger installation take?",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      question: "What are signs I need to replace my electrical panel?",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  const faqSchemaData = [
    {
      question: "How much does it cost to upgrade an electrical panel?",
      answer: "The cost to upgrade an electrical panel in Suffolk County typically ranges from $1,500 to $4,000, depending on the amperage (100A, 200A, or 400A) and complexity of the installation. This includes permits, materials, and professional installation by a licensed electrician. Contact Berman Electric for a free, accurate quote for your specific needs."
    },
    {
      question: "Do I need a permit for electrical work in Suffolk County?",
      answer: "Yes, most electrical work in Suffolk County requires a permit, including panel upgrades, new circuits, EV charger installations, and major repairs. Licensed electricians like Berman Electric handle all permit applications and inspections to ensure your work meets local codes and safety standards."
    },
    {
      question: "How long does EV charger installation take?",
      answer: "Professional EV charger installation typically takes 2-4 hours for a standard Level 2 charger, though this can vary based on your electrical panel capacity and distance from the installation location. If a panel upgrade is needed, the project may take 1-2 days. Berman Electric provides same-day or next-day installation in most cases."
    },
    {
      question: "What are signs I need to replace my electrical panel?",
      answer: "Common signs include frequent circuit breaker trips, flickering lights, burning smells near the panel, rust or corrosion, outdated fuse boxes, or panels over 25 years old. If you're adding major appliances or an EV charger, you may also need an upgrade. Berman Electric offers free panel inspections to assess your needs."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("faq-answer", {
        body: { question: question.trim() },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setQuestion(q);
    setAnswer("");
  };

  return (
    <>
      <Helmet>
        <title>Electrical FAQ - Common Questions | Berman Electric</title>
        <meta
          name="description"
          content="Get instant answers to common electrical questions from licensed electricians. Learn about panel upgrades, EV chargers, permits, and more for Long Island homes and businesses."
        />
        <meta
          name="keywords"
          content="electrical FAQ, electrician questions, electrical panel upgrade cost, EV charger installation, electrical permits Suffolk County, Long Island electrician"
        />
        <link rel="canonical" href="https://bermanelectric.com/faq" />
      </Helmet>

      <FAQSchema faqs={faqSchemaData} />

      <Navbar />

      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="container max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Electrical <span className="text-electric-600">FAQ</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ask any electrical question and get expert answers powered by AI trained on professional electrical knowledge
            </p>
          </div>

          {/* Question Input */}
          <Card className="p-8 mb-12 bg-card border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ask any electrical question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="pl-12 py-6 text-lg"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-electric-600 hover:bg-electric-700 text-white font-semibold"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? "Getting Answer..." : "Get Expert Answer"}
              </Button>
            </form>

            {/* Answer Display */}
            {answer && (
              <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
                <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-electric-600" />
                  Expert Answer:
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {answer}
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Need more help? Contact our licensed electricians:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm" className="bg-electric-600 hover:bg-electric-700">
                      <a href="tel:+15163614068">Call (516) 361-4068</a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href="/contact">Get Free Quote</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Common Questions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
              Common Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {commonQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(item.question)}
                  className="p-6 bg-card border border-border rounded-xl hover:border-electric-400 hover:bg-muted/50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-electric-600/10 flex items-center justify-center text-electric-600 group-hover:bg-electric-600 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <p className="text-foreground font-medium group-hover:text-electric-600 transition-colors">
                      {item.question}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SEO Content */}
          <div className="prose prose-lg max-w-none">
            <Card className="p-8 bg-card border-border">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Expert Electrical Guidance for Long Island
              </h2>
              <p className="text-muted-foreground mb-4">
                At Berman Electric, we understand that electrical work can be complex and sometimes
                confusing. That's why we've created this AI-powered FAQ system to provide instant,
                accurate answers to your electrical questions.
              </p>
              <p className="text-muted-foreground mb-4">
                Our FAQ assistant is trained on years of professional electrical experience serving
                Suffolk County and Nassau County. Whether you're curious about panel upgrades, EV
                charger installations, emergency repairs, or electrical codes, you'll get reliable
                information backed by licensed electrician expertise.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-foreground mt-6">
                Why Trust Our Electrical Advice?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-electric-600 flex-shrink-0 mt-0.5" />
                  <span>Licensed and insured electricians serving Long Island for over 20 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-electric-600 flex-shrink-0 mt-0.5" />
                  <span>Up-to-date knowledge of Suffolk and Nassau County electrical codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-electric-600 flex-shrink-0 mt-0.5" />
                  <span>24/7 emergency electrical services available</span>
                </li>
              </ul>
              <div className="mt-8 p-6 bg-electric-600 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
                <p className="mb-4 text-electric-50">
                  Our licensed electricians are ready to help with any electrical project or
                  emergency. Get a free quote today!
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" variant="secondary">
                    <a href="tel:+15163614068">Call (516) 361-4068</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-electric-600">
                    <a href="/contact">Request Free Quote</a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FAQ;
