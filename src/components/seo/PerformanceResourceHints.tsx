import { useEffect } from 'react';

interface ResourceHint {
  href: string;
  as?: 'script' | 'style' | 'image' | 'font' | 'document';
  type?: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch' | 'prerender';
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

interface PerformanceResourceHintsProps {
  hints?: ResourceHint[];
  prerenderRoutes?: string[];
}

/**
 * PerformanceResourceHints - Advanced resource hints for Core Web Vitals
 * Dynamically adds preload, prefetch, and prerender hints
 */
const PerformanceResourceHints = ({ hints, prerenderRoutes }: PerformanceResourceHintsProps) => {
  useEffect(() => {
    const defaultHints: ResourceHint[] = [
      // Critical resources
      { href: '/logo-optimized.webp', as: 'image', type: 'preload', fetchPriority: 'high' },
      
      // Likely next navigations
      { href: '/residential', type: 'prefetch' },
      { href: '/commercial', type: 'prefetch' },
      { href: '/contact', type: 'prefetch' },
      
      // External services
      { href: 'https://maps.googleapis.com', type: 'dns-prefetch' },
      { href: 'https://fonts.gstatic.com', type: 'preconnect', crossOrigin: 'anonymous' },
    ];

    const allHints = [...defaultHints, ...(hints || [])];

    // Add resource hints to head
    allHints.forEach(hint => {
      // Check if hint already exists
      const existingLink = document.querySelector(`link[href="${hint.href}"][rel="${hint.type}"]`);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = hint.type || 'prefetch';
      link.href = hint.href;
      
      if (hint.as) link.setAttribute('as', hint.as);
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      if (hint.media) link.media = hint.media;
      if (hint.fetchPriority) link.setAttribute('fetchpriority', hint.fetchPriority);
      
      document.head.appendChild(link);
    });

    // Add prerender hints for likely navigations (Speculation Rules API)
    if (prerenderRoutes && prerenderRoutes.length > 0 && 'HTMLScriptElement' in window) {
      const speculationRules = {
        prerender: prerenderRoutes.map(url => ({
          source: 'list',
          urls: [url]
        }))
      };

      const existingScript = document.querySelector('script[type="speculationrules"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'speculationrules';
        script.textContent = JSON.stringify(speculationRules);
        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      // Don't remove hints on cleanup as they're beneficial for navigation
    };
  }, [hints, prerenderRoutes]);

  return null; // This component doesn't render anything
};

export default PerformanceResourceHints;
