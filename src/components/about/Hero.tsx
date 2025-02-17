
interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero = ({ title, subtitle }: HeroProps) => {
  return (
    <div className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 z-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
          alt="Professional electrician at work"
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
        </div>
      </div>
    </div>
  );
};

export default Hero;
