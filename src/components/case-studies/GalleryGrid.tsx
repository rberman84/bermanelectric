import type { CaseStudyFrontmatter } from "@/lib/caseStudies";

type GalleryGridProps = {
  images: CaseStudyFrontmatter["before"];
  title?: string;
};

const GalleryGrid = ({ images, title = "Project Gallery" }: GalleryGridProps) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Highlights captured by the crew during installation and commissioning.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {images.map((image) => (
          <figure key={image.src} className="overflow-hidden rounded-xl border bg-background shadow-sm">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-64 w-full object-cover"
            />
            {image.caption && (
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
};

export default GalleryGrid;
