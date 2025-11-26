import { Link } from "react-router-dom";
import NAP from "./NAP";
import CTASection from "./CTASection";
import bermanLogo from "@/assets/berman-logo.png";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const serviceLinks = [{
    name: "Residential Electrical",
    href: "/residential"
  }, {
    name: "Commercial Electrical",
    href: "/commercial"
  }, {
    name: "Emergency Repairs",
    href: "/emergency"
  }, {
    name: "EV Charger Installation",
    href: "/ev-charger"
  }];
  const locationLinks = [{
    name: "Electrician Ronkonkoma",
    href: "/electrician-ronkonkoma"
  }, {
    name: "Electrician Suffolk County",
    href: "/electrician-suffolk-county"
  }, {
    name: "Electrician Long Island",
    href: "/electrician-long-island"
  }];
  const companyLinks = [{
    name: "About Us",
    href: "/about"
  }, {
    name: "Our Projects",
    href: "/projects"
  }, {
    name: "Testimonials",
    href: "/testimonials"
  }, {
    name: "Contact Us",
    href: "/contact"
  }, {
    name: "Electrical Blog",
    href: "/blog"
  }, {
    name: "FAQ",
    href: "/faq"
  }, {
    name: "Resources & Tools",
    href: "/resources"
  }];
  return <footer className="bg-[hsl(0,0%,20%)] text-white relative overflow-hidden"
    style={{
      backgroundImage: `
        linear-gradient(180deg, hsl(0,0%,20%) 0%, hsl(0,0%,18%) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)
      `,
      backgroundBlendMode: 'normal, overlay, overlay',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
    }}
  >
      {/* Noise/Grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          mixBlendMode: 'overlay',
          opacity: 0.15
        }}
      />
      
      {/* Concrete chips and light catches */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 30%, rgba(255,255,255,0.15) 0%, transparent 2px),
            radial-gradient(circle at 48% 65%, rgba(255,255,255,0.12) 0%, transparent 1.5px),
            radial-gradient(circle at 82% 45%, rgba(255,255,255,0.18) 0%, transparent 2.5px),
            radial-gradient(circle at 28% 80%, rgba(255,255,255,0.1) 0%, transparent 1px),
            radial-gradient(circle at 91% 20%, rgba(255,255,255,0.14) 0%, transparent 2px),
            radial-gradient(circle at 65% 90%, rgba(255,255,255,0.11) 0%, transparent 1.5px),
            radial-gradient(circle at 18% 10%, rgba(255,255,255,0.16) 0%, transparent 2px),
            radial-gradient(circle at 95% 75%, rgba(255,255,255,0.13) 0%, transparent 1.8px),
            radial-gradient(circle at 5% 55%, rgba(255,255,255,0.09) 0%, transparent 1.2px),
            radial-gradient(circle at 58% 35%, rgba(255,255,255,0.17) 0%, transparent 2.2px)
          `,
          backgroundSize: '100% 100%',
          filter: 'blur(0.3px)'
        }}
      />
      
      {/* Larger worn spots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 25% 40%, rgba(255,255,255,0.08) 0%, transparent 15%),
            radial-gradient(ellipse at 70% 25%, rgba(255,255,255,0.06) 0%, transparent 12%),
            radial-gradient(ellipse at 45% 75%, rgba(255,255,255,0.07) 0%, transparent 18%),
            radial-gradient(ellipse at 88% 85%, rgba(255,255,255,0.05) 0%, transparent 10%)
          `,
          filter: 'blur(2px)'
        }}
      />
      
      {/* Concrete crack patterns */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(125deg, transparent 0%, transparent 52%, rgba(0,0,0,0.3) 52%, rgba(0,0,0,0.3) 53%, transparent 53%, transparent 100%),
            linear-gradient(55deg, transparent 0%, transparent 74%, rgba(0,0,0,0.2) 74%, rgba(0,0,0,0.2) 75%, transparent 75%, transparent 100%),
            linear-gradient(85deg, transparent 0%, transparent 38%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0.15) 39%, transparent 39%, transparent 100%)
          `,
          backgroundSize: '900px 500px, 1100px 400px, 700px 600px',
          backgroundPosition: '15% 20%, 75% 10%, 40% 60%',
          mixBlendMode: 'multiply'
        }}
      />
      {/* CTA Section */}
      <div className="relative z-10">
        <CTASection variant="footer" title="Need Professional Electrical Service?" subtitle="Call Long Island's most trusted electrician" className="border-b border-white/10" />
      </div>

      {/* Main Footer Content */}
      <div className="py-12 relative z-10">
        <div className="container">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info & NAP */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]">
                <div
                  className="h-12 w-36 rounded-sm bg-center bg-cover relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${bermanLogo})`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.3)'
                  }}
                  aria-label="Berman Electric"
                  role="img"
                >
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px),
                        repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)
                      `
                    }}
                  />
                </div>
              </Link>
              <NAP variant="footer" showHours={true} />
              
              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white/80 mb-3">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/bermanelectric" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)] rounded-full p-1" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/bermanelectric" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)] rounded-full p-1" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/berman-electric" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-electric-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)] rounded-full p-1" aria-label="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
              <ul className="space-y-2">
                {serviceLinks.map(link => <li key={link.href}>
                    <Link to={link.href} className="text-white/70 hover:text-electric-400 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]">
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
            </div>

            {/* Service Areas */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Service Areas</h3>
              <ul className="space-y-2">
                {locationLinks.map(link => <li key={link.href}>
                    <Link to={link.href} className="text-white/70 hover:text-electric-400 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]">
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
              <div className="mt-4 text-sm text-white/70">
                <p>Serving Nassau & Suffolk Counties</p>
                <p>
              </p>
                <p>Fully Licensed & Insured</p>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map(link => <li key={link.href}>
                    <Link to={link.href} className="text-white/70 hover:text-electric-400 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0,0%,18%)]">
                      {link.name}
                    </Link>
                  </li>)}
              </ul>

              {/* Business Info */}
              <div className="mt-6 text-sm text-white/70">
                <p className="font-medium text-white mb-2">Business Hours:</p>
                <p>Mon-Fri: 7:00 AM - 7:00 PM</p>
                <p>Weekends: Emergency Service</p>
                <p className="mt-2 text-electric-400">24/7 Emergency Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/70 text-center md:text-left">
              <p>&copy; {currentYear} Berman Electric. All rights reserved.</p>
              <p className="mt-1">Licensed Electrician serving Long Island, NY since 2003</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm text-white/70">
              <span>License #ME-44927</span>
              <span aria-hidden="true">•</span>
              <span>Fully Insured</span>
              <span aria-hidden="true">•</span>
              <span>BBB Accredited</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;