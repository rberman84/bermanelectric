import type { ContentGalleryImage } from "@/lib/content";

interface MediaGalleryProps {
  items: ContentGalleryImage[];
}

const MediaGallery = ({ items }: MediaGalleryProps) => {
  if (!items?.length) return null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white/60 p-6 shadow-sm backdrop-blur">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((image) => (
          <figure key={image.src} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <img
              src={image.src}
              alt={image.alt}
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {image.caption && (
              <figcaption className="p-4 text-sm text-gray-600">{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
};

export default MediaGallery;
