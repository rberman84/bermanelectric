import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/berman-logo-new.png";

const FibonacciHero = () => {
  return (
    <section 
      className="relative min-h-[clamp(620px,82vh,880px)] overflow-hidden isolate rounded-[22px] mx-4 mt-4"
      style={{ background: '#0b0c10' }}
      aria-label="Berman Electric hero"
    >
      {/* Background with SVG spiral */}
      <div className="absolute inset-0 -z-10">
        {/* Golden spiral / Fibonacci arcs */}
        <svg 
          className="absolute -inset-[5%] w-[110%] h-[110%] opacity-90"
          viewBox="0 0 1200 800" 
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="beGlow" cx="30%" cy="40%" r="80%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.10)"/>
              <stop offset="60%" stopColor="rgba(255,255,255,0.04)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0.00)"/>
            </radialGradient>
            <linearGradient id="beLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0.06)"/>
            </linearGradient>
          </defs>

          {/* Soft glow field */}
          <rect width="1200" height="800" fill="url(#beGlow)"/>

          {/* Fibonacci-inspired spiral arcs */}
          <g fill="none" stroke="url(#beLine)" strokeWidth="2">
            <path d="M1100 620 A420 420 0 0 0 680 200" />
            <path d="M680 200 A260 260 0 0 0 420 460" />
            <path d="M420 460 A160 160 0 0 0 580 620" />
            <path d="M580 620 A100 100 0 0 0 680 520" />
            <path d="M680 520 A60 60 0 0 0 620 460" />
            <path d="M620 460 A38 38 0 0 0 658 422" />
            <path d="M658 422 A24 24 0 0 0 634 398" />
          </g>

          {/* Subtle golden rectangles grid hint */}
          <g fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1">
            <rect x="60" y="60" width="740" height="458" />
            <rect x="800" y="60" width="340" height="210" />
            <rect x="800" y="270" width="210" height="248" />
            <rect x="1010" y="270" width="130" height="130" />
            <rect x="1010" y="400" width="80" height="118" />
            <rect x="1090" y="400" width="50" height="72" />
          </g>
        </svg>

        {/* Noise overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-[0.22] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E")`
          }}
        />

        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(1100px 680px at 35% 40%, rgba(255,255,255,.05), rgba(255,255,255,0) 58%),
              radial-gradient(900px 540px at 80% 50%, rgba(255,255,255,.03), rgba(255,255,255,0) 60%),
              linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.65) 100%)
            `
          }}
        />
      </div>

      {/* Main content wrapper - Golden ratio grid */}
      <div className="max-w-[1200px] mx-auto px-[34px] py-[89px] grid grid-cols-1 lg:grid-cols-[1fr_1.618fr] gap-[89px] items-center min-h-[clamp(520px,72vh,780px)]">
        {/* Left: Brand mark block */}
        <motion.div 
          className="flex flex-col gap-[21px]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div 
            className="w-[clamp(220px,22vw,320px)] aspect-square rounded-[28px] grid place-items-center relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 30px 60px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.06)'
            }}
          >
            {/* Inner glow */}
            <div 
              className="absolute -inset-[40%] opacity-70 blur-[10px]"
              style={{
                background: `
                  radial-gradient(circle at 30% 35%, rgba(255,255,255,.08), rgba(255,255,255,0) 55%),
                  conic-gradient(from 230deg, rgba(255,255,255,.10), rgba(255,255,255,0) 45%, rgba(255,255,255,.06))
                `
              }}
            />
            <img
              className="relative w-[72%] h-auto drop-shadow-[0_12px_26px_rgba(0,0,0,.55)]"
              src={logo}
              alt="Berman Electric"
              loading="eager"
            />
          </div>

          <div className="flex items-center gap-[13px] text-[rgba(244,244,245,.72)] text-[13px] tracking-[0.12em] uppercase">
            <span 
              className="w-[10px] h-[10px] rounded-full"
              style={{
                background: 'rgba(255,255,255,.75)',
                boxShadow: '0 0 0 6px rgba(255,255,255,.06)'
              }}
            />
            <span>Fibonacci-built. Minimal. Loud.</span>
          </div>
        </motion.div>

        {/* Right: Copy block */}
        <motion.div 
          className="flex flex-col gap-[21px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="m-0 text-[rgba(244,244,245,.72)] tracking-[0.16em] uppercase text-[12px]">
            Long Island Electrical Contractor
          </p>

          <h1 className="m-0 text-[clamp(34px,4.1vw,58px)] leading-[1.02] tracking-[-0.02em] text-[#f4f4f5]">
            Clean installs.
            <span className="block text-[rgba(255,255,255,.86)]">Precise execution.</span>
            No games.
          </h1>

          <p className="m-0 max-w-[56ch] text-[rgba(244,244,245,.72)] text-[clamp(16px,1.35vw,18px)] leading-[1.55]">
            Service upgrades, EV chargers, panels, lighting, troubleshooting.
            You get tight work, clear communication, and a job done right.
          </p>

          <div className="flex gap-[21px] flex-wrap mt-[13px]">
            <a
              href="tel:5163614068"
              className="inline-flex items-center justify-center px-[18px] py-[14px] rounded-full font-semibold tracking-[0.02em] transition-all duration-200 hover:-translate-y-[1px] focus:outline-none focus:ring-4 focus:ring-white/10"
              style={{
                background: 'rgba(255,255,255,.92)',
                color: '#0b0c10',
                border: '1px solid rgba(255,255,255,.20)'
              }}
              aria-label="Call Berman Electric"
            >
              Call 516-361-4068
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-[18px] py-[14px] rounded-full font-semibold tracking-[0.02em] transition-all duration-200 hover:-translate-y-[1px] hover:bg-white/[0.07] focus:outline-none focus:ring-4 focus:ring-white/10"
              style={{
                background: 'rgba(255,255,255,.04)',
                color: '#f4f4f5',
                border: '1px solid rgba(255,255,255,.14)'
              }}
              aria-label="Request an estimate"
            >
              Request an estimate
            </Link>
          </div>

          <div className="flex flex-wrap gap-[13px] mt-[13px]">
            {['Licensed + insured', 'Fast scheduling', 'Clean finish'].map((text) => (
              <div 
                key={text}
                className="text-[12px] tracking-[0.08em] uppercase px-[12px] py-[10px] rounded-full"
                style={{
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.12)',
                  color: 'rgba(255,255,255,.78)'
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom footer */}
      <motion.div 
        className="max-w-[1200px] mx-auto px-[34px] pb-[34px] flex items-center justify-between gap-[21px] text-[rgba(255,255,255,.62)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div 
          className="h-[1px] flex-1"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,0))' }}
        />
        <div className="flex items-center gap-[13px] text-[12px] tracking-[0.10em] uppercase whitespace-nowrap">
          <span>bermanelectric.com</span>
          <span className="opacity-55">•</span>
          <span>Serving Long Island</span>
        </div>
      </motion.div>
    </section>
  );
};

export default FibonacciHero;
