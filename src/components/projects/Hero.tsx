
interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
}

const Hero = ({ title, subtitle, description }: HeroProps) => {
  return (
    <div className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[hsl(15,100%,70%)] to-[hsl(25,100%,75%)] opacity-40 blur-3xl" />
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[hsl(10,100%,70%)] to-[hsl(20,100%,75%)] opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-white opacity-90 blur-[100px]" />
      </div>

      <div className="container relative py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-foreground mb-6 leading-[0.95] tracking-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal mb-6 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
