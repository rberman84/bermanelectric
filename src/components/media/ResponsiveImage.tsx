import { useMemo, useState, type CSSProperties } from "react";
import { SITE_URL } from "@/lib/siteConfig";
import { ensureLeadingSlash, stripTrailingSlash } from "@/lib/url";
import { cn } from "@/lib/utils";

const WIDTHS = [480, 768, 1024, 1440];
const IMAGE_CDN_BASE = "https://wsrv.nl/?";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  imgStyle?: CSSProperties;
}

const buildAbsoluteSource = (src: string) => {
  if (/^https?:/i.test(src)) {
    return src;
  }
  const normalized = stripTrailingSlash(ensureLeadingSlash(src));
  return `${SITE_URL}${normalized}`;
};

const buildCdnUrl = (absoluteUrl: string, params: Record<string, string>) => {
  const query = new URLSearchParams({ url: absoluteUrl, il: "1", ...params });
  return `${IMAGE_CDN_BASE}${query.toString()}`;
};

const createSrcSet = (absoluteUrl: string, format?: "webp" | "avif") =>
  WIDTHS.map((width) => {
    const params: Record<string, string> = { w: width.toString() };
    if (format) {
      params.output = format;
    }
    return `${buildCdnUrl(absoluteUrl, params)} ${width}w`;
  }).join(", ");

const createPlaceholder = (absoluteUrl: string) =>
  buildCdnUrl(absoluteUrl, { w: "32", blur: "25", output: "webp" });

export const ResponsiveImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  sizes = "100vw",
  loading = "lazy",
  priority = false,
  imgStyle,
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const absoluteSource = useMemo(() => buildAbsoluteSource(src), [src]);
  const placeholder = useMemo(() => (!import.meta.env.SSR ? createPlaceholder(absoluteSource) : undefined), [absoluteSource]);

  const webpSrcSet = useMemo(() => createSrcSet(absoluteSource, "webp"), [absoluteSource]);
  const avifSrcSet = useMemo(() => createSrcSet(absoluteSource, "avif"), [absoluteSource]);
  const fallbackSrcSet = useMemo(() => createSrcSet(absoluteSource), [absoluteSource]);

  const fallbackSrc = useMemo(() => {
    if (/^https?:/i.test(src)) {
      return src;
    }
    return ensureLeadingSlash(src);
  }, [src]);

  const fetchPriority = priority ? "high" : "auto";
  const loadingStrategy = priority ? "eager" : loading;

  return (
    <span
      className={cn("relative block overflow-hidden", wrapperClassName)}
      style={!isLoaded && placeholder ? {
        backgroundImage: `url(${placeholder})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } : undefined}
    >
      <picture>
        <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <img
          src={fallbackSrc}
          srcSet={fallbackSrcSet}
          sizes={sizes}
          alt={alt}
          loading={loadingStrategy}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]",
            className
          )}
          style={{
            willChange: "transform, opacity",
            ...imgStyle,
          }}
        />
      </picture>
    </span>
  );
};

export default ResponsiveImage;
