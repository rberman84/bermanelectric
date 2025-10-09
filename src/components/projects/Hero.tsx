
import { generateAltText } from "@/lib/utils";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
}

const Hero = ({ title, subtitle, description }: HeroProps) => {
  return (
    <div className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475"
          alt={generateAltText(
            "https://images.unsplash.com/photo-1518770660439-4636190af475",
            "Background image highlighting electric circuit board expertise"
          )}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {subtitle}
          </p>
          <p className="text-lg text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
