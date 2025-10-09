import { CalendarDays, ClipboardList, Hammer, MapPin, Sparkles, Users } from "lucide-react";
import type { CaseStudyFrontmatter } from "@/lib/caseStudies";
import MarkdownRenderer from "./MarkdownRenderer";
import BeforeAfterSlider from "./BeforeAfterSlider";
import GalleryGrid from "./GalleryGrid";
import SuggestedFaqs from "./SuggestedFaqs";

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type CaseStudyLayoutProps = {
  frontmatter: CaseStudyFrontmatter & { slug: string };
  markdown: string;
  faqSuggestions?: { question: string; answer?: string }[];
  faqLoading?: boolean;
  faqError?: string | null;
};

const CaseStudyLayout = ({ frontmatter, markdown, faqSuggestions = [], faqLoading, faqError }: CaseStudyLayoutProps) => {
  const publishDate = formatDate(frontmatter.publishDate);
  const updatedDate = formatDate(frontmatter.updatedDate);
  const galleryImages = frontmatter.gallery && frontmatter.gallery.length > 0
    ? frontmatter.gallery
    : [...frontmatter.before, ...frontmatter.after];
  const manualFaqs = frontmatter.faq ?? [];
  const combinedFaqs = (faqSuggestions ?? []).length > 0 ? faqSuggestions : manualFaqs;

  return (
    <article className="space-y-12">
      <section className="rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[1px] shadow-xl">
        <div className="rounded-[calc(1.5rem-1px)] bg-slate-950/90 px-6 py-10 text-slate-50 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {frontmatter.town}
                </span>
                {publishDate && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {publishDate}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold md:text-5xl">{frontmatter.title}</h1>
              {frontmatter.summary && (
                <p className="max-w-3xl text-lg text-slate-200">{frontmatter.summary}</p>
              )}
              {updatedDate && updatedDate !== publishDate && (
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Updated {updatedDate}
                </p>
              )}
            </div>
            {frontmatter.heroImage && (
              <img
                src={frontmatter.heroImage}
                alt={`${frontmatter.title} hero image`}
                className="h-32 w-32 rounded-2xl border border-white/20 object-cover shadow-lg md:h-40 md:w-40"
                loading="lazy"
              />
            )}
          </div>

          {frontmatter.services && frontmatter.services.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {frontmatter.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <header className="mb-4 flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Scope of Work</h2>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {frontmatter.scope.map((item) => (
              <div key={item.title} className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                {item.summary && <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>}
                {item.items.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {item.items.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <Sparkles className="mt-1 h-4 w-4 text-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <header className="mb-3 flex items-center gap-2">
              <Hammer className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Materials Installed</h2>
            </header>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {frontmatter.materials.map((material) => (
                <li key={material.name} className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-3">
                  <p className="font-semibold text-foreground">{material.name}</p>
                  {material.spec && <p className="text-xs text-muted-foreground">{material.spec}</p>}
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    {material.quantity && <span>Qty: {material.quantity}</span>}
                    {material.url && (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Spec sheet
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <header className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Labor Snapshot</h2>
            </header>
            <p className="text-sm text-muted-foreground">{frontmatter.labor.summary}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {frontmatter.labor.crewSize && (
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="font-medium text-foreground">Crew Size</dt>
                  <dd className="text-muted-foreground">{frontmatter.labor.crewSize} electricians</dd>
                </div>
              )}
              {frontmatter.labor.totalHours && (
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="font-medium text-foreground">Total Labor</dt>
                  <dd className="text-muted-foreground">{frontmatter.labor.totalHours} hours</dd>
                </div>
              )}
              {frontmatter.labor.duration && (
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="font-medium text-foreground">On-site</dt>
                  <dd className="text-muted-foreground">{frontmatter.labor.duration}</dd>
                </div>
              )}
            </dl>
            {frontmatter.labor.tasks.length > 0 && (
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                {frontmatter.labor.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <header className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Project Outcomes</h2>
          </header>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {frontmatter.outcome.map((item) => (
              <li key={item} className="flex gap-3 rounded-xl bg-muted/30 p-4">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <header className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
            Homeowner Feedback
          </header>
          <p className="text-lg leading-relaxed text-foreground">“{frontmatter.quote.text}”</p>
          <p className="mt-4 text-sm uppercase tracking-wide text-muted-foreground">
            {frontmatter.quote.author}
            {frontmatter.quote.role ? ` — ${frontmatter.quote.role}` : ""}
          </p>
        </div>
      </section>

      <BeforeAfterSlider before={frontmatter.before[0]} after={frontmatter.after[0]} />

      <MarkdownRenderer markdown={markdown} className="prose-lg" />

      <GalleryGrid images={galleryImages} />

      <SuggestedFaqs suggestions={combinedFaqs} loading={faqLoading} error={faqError ?? null} />
    </article>
  );
};

export default CaseStudyLayout;
