import { useEffect, useState } from 'react';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const scrollTop = window.pageYOffset;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial calculation
    
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div 
        className="h-full bg-gradient-to-r from-electric-600 to-electric-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;