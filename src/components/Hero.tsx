import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SocialProofInline from "./shared/SocialProofInline";
import BitcoinPayment from "./shared/BitcoinPayment";
import { Phone, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-interior-lighting.jpg";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const Hero = ({ title, subtitle, description }: HeroProps = {}) => {
  const [showBitcoinModal, setShowBitcoinModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  
  const isHomePage = !title && !subtitle && !description;

  return (
    <div ref={heroRef} className="relative min-h-[85svh] flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/50 to-white/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="container relative py-20 md:py-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-5xl mx-auto">
          {isHomePage ? (
            <div className="text-center">
              {/* Urgency Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 backdrop-blur-sm border border-foreground/10 mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-foreground/80">
                  Available Now — 60-Minute Emergency Response
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Long Island's Most
                <br />
                <span className="text-primary">Trusted</span> Electricians
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Panel upgrades, EV chargers, emergency repairs, and full electrical services across Suffolk County.
              </motion.p>

              {/* Social Proof */}
              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <SocialProofInline />
              </motion.div>

              {/* Primary CTAs - Just 2 */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a
                  href="tel:+15163614068"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-5 text-lg font-semibold bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all shadow-2xl shadow-foreground/20 w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5" />
                  <span>(516) 361-4068</span>
                  <span className="text-sm opacity-70 hidden sm:inline">— Call Now</span>
                </a>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 w-full sm:w-auto"
                >
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>24/7 Emergency Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Same-Day Appointments</span>
                </div>
              </motion.div>
            </div>
          ) : (
            // Non-homepage hero (simplified)
            <div className="text-center">
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {subtitle}
                </motion.p>
              )}
              {description && (
                <motion.p 
                  className="text-base text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {description}
                </motion.p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bitcoin Modal (kept but not prominent) */}
      <BitcoinPayment open={showBitcoinModal} onOpenChange={setShowBitcoinModal} />
    </div>
  );
};

export default Hero;
