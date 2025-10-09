import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBio from "@/components/blog/AuthorBio";
import SocialShare from "@/components/blog/SocialShare";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ContentSchema from "./ContentSchema";
import HeroBlock from "./HeroBlock";
import BadgeRow from "./BadgeRow";
import TrustStrip from "./TrustStrip";
import ProcessTimeline from "./ProcessTimeline";
import MediaGallery from "./MediaGallery";
import BeforeAfterSlider from "./BeforeAfterSlider";
import EstimateCTA from "./EstimateCTA";
import FAQList from "./FAQList";
import type { ContentEntry } from "@/lib/content";
import { contentEntries } from "@/lib/content";

interface ArticleLayoutProps {
  entry: ContentEntry;
}

const ArticleLayout = ({ entry }: ArticleLayoutProps) => {
  return (
    <>
      <ContentSchema entry={entry} />
      <ReadingProgress />
      <Navbar />
      <main className="bg-gradient-to-b from-slate-50 via-white to-white pt-24">
        <section className="container grid gap-10 pb-24">
          {entry.frontmatter.hero && <HeroBlock hero={entry.frontmatter.hero} />}

          <div className="grid gap-10 lg:grid-cols-[2.2fr,1fr]">
            <article className="space-y-10">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(entry.frontmatter.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{entry.readTime}</span>
                  <span>•</span>
                  <span>{entry.frontmatter.author || "Rob Berman"}</span>
                </div>
                <div className="mt-6 prose prose-lg max-w-none prose-headings:text-electric-900 prose-p:text-gray-700 prose-strong:text-electric-800">
                  <div className="mdx-content" dangerouslySetInnerHTML={{ __html: entry.html }} />
                </div>
              </div>

              {entry.frontmatter.gallery && entry.frontmatter.gallery.length > 0 && (
                <MediaGallery items={entry.frontmatter.gallery} />
              )}

              {entry.frontmatter.beforeAfter && (
                <BeforeAfterSlider
                  before={entry.frontmatter.beforeAfter.before}
                  after={entry.frontmatter.beforeAfter.after}
                />
              )}

              {entry.frontmatter.process && (
                <ProcessTimeline
                  title={entry.frontmatter.process.title}
                  steps={entry.frontmatter.process.steps}
                />
              )}

              {entry.frontmatter.badges && entry.frontmatter.badges.length > 0 && (
                <BadgeRow badges={entry.frontmatter.badges} />
              )}

              {entry.frontmatter.trustStrip && (
                <TrustStrip
                  headline={entry.frontmatter.trustStrip.headline}
                  items={entry.frontmatter.trustStrip.items}
                />
              )}

              {entry.frontmatter.faqs && entry.frontmatter.faqs.length > 0 && (
                <FAQList items={entry.frontmatter.faqs} />
              )}

              {entry.frontmatter.cta && (
                <EstimateCTA
                  eyebrow={entry.frontmatter.cta.eyebrow}
                  title={entry.frontmatter.cta.title}
                  description={entry.frontmatter.cta.description}
                  primaryHref={entry.frontmatter.cta.primaryHref}
                  primaryLabel={entry.frontmatter.cta.primaryLabel}
                  secondaryLabel={entry.frontmatter.cta.secondaryLabel}
                  phoneNumber={entry.frontmatter.cta.phoneNumber}
                />
              )}
            </article>

            <aside className="space-y-6">
              <TableOfContents rootSelector=".mdx-content" dependencyKey={entry.slug} />
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <SocialShare title={entry.frontmatter.title} url={`https://bermanelectrical.com${entry.url}`} description={entry.frontmatter.description} />
              </div>
              <AuthorBio />
            </aside>
          </div>

          <RelatedPosts currentEntry={entry} allEntries={contentEntries} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ArticleLayout;
