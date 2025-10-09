import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import SEO from "@/components/SEO";
import { caseStudies, getCaseStudyUrl } from "@/lib/caseStudies";

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Electrical Case Studies"
        description="Deep dives into Berman Electric projects across Long Island, including service upgrades, generator installs, and commercial electrical work."
        canonical="https://bermanelectrical.com/case-studies"
        keywords="electrical case studies, Long Island electrician projects, Berman Electric portfolio, service upgrade case study"
      />
      <Navbar />
      <main className="container mx-auto max-w-6xl space-y-12 py-24">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Case Studies</p>
          <h1 className="mt-2 text-4xl font-bold text-foreground">Proof of Work Across Long Island</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every case study is generated from structured MDX front matter so the team can publish faster, deliver stronger SEO, and
            keep the CMS ready for human approval.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article key={study.slug} className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <img
                  src={study.frontmatter.heroImage ?? study.frontmatter.after[0]?.src}
                  alt={`${study.frontmatter.title} hero`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {study.frontmatter.town}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{study.frontmatter.title}</h2>
                  {study.frontmatter.summary && (
                    <p className="mt-2 text-sm text-muted-foreground">{study.frontmatter.summary}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                  {study.frontmatter.services?.map((service) => (
                    <span key={service} className="rounded-full bg-muted px-3 py-1">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                  <div className="space-y-1">
                    {study.frontmatter.publishDate && (
                      <p>Published {new Date(study.frontmatter.publishDate).toLocaleDateString("en-US")}</p>
                    )}
                    <p>Outcome wins: {study.frontmatter.outcome.length}</p>
                  </div>
                  <Link
                    to={getCaseStudyUrl(study.slug)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                  >
                    View case study
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudies;
