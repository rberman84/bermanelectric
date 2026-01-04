import { useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataUrl?: string;
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * LazyImage - Optimized image component with native lazy loading
 * Implements best practices for Core Web Vitals (LCP, CLS)
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataUrl,
  srcSet,
  sizes,
  onLoad
}: LazyImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      // For priority images, add fetchpriority hint
      imgRef.current.setAttribute('fetchpriority', 'high');
    }
  }, [priority]);

  // Generate responsive srcset if not provided
  const generateSrcSet = (baseSrc: string): string => {
    if (srcSet) return srcSet;
    
    // Only generate for local images
    if (!baseSrc.startsWith('/') && !baseSrc.includes('bermanelectrical.com')) {
      return '';
    }

    // For WebP images, provide multiple sizes
    if (baseSrc.endsWith('.webp') || baseSrc.endsWith('.jpg') || baseSrc.endsWith('.png')) {
      return `${baseSrc} 1x, ${baseSrc} 2x`;
    }
    
    return '';
  };

  const defaultBlur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+';

  const handleLoad = () => {
    if (imgRef.current && placeholder === 'blur') {
      imgRef.current.style.filter = 'none';
      imgRef.current.style.transition = 'filter 0.3s ease-out';
    }
    onLoad?.();
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      srcSet={generateSrcSet(src)}
      sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
      onLoad={handleLoad}
      style={placeholder === 'blur' ? {
        backgroundImage: `url(${blurDataUrl || defaultBlur})`,
        backgroundSize: 'cover',
        filter: 'blur(5px)',
      } : undefined}
    />
  );
};

export default LazyImage;
