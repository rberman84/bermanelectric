import { Loader2, MessageCircleQuestion } from "lucide-react";

type SuggestedFaqsProps = {
  suggestions: { question: string; answer?: string }[];
  loading?: boolean;
  error?: string | null;
};

const SuggestedFaqs = ({ suggestions, loading = false, error = null }: SuggestedFaqsProps) => {
  if (loading) {
    return (
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <header className="mb-4 flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <h2 className="text-lg font-semibold">Building smarter FAQs…</h2>
        </header>
        <p className="text-sm text-muted-foreground">
          Pulling search console data to recommend the questions customers actually ask.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
        <h2 className="mb-2 text-lg font-semibold text-destructive">We hit a snag loading FAQs</h2>
        <p className="text-sm text-destructive/80">{error}</p>
      </section>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <MessageCircleQuestion className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Customer Questions We Answer</h2>
          <p className="text-sm text-muted-foreground">
            Human-approved FAQs sourced from Google Search Console queries.
          </p>
        </div>
      </header>

      <dl className="space-y-4">
        {suggestions.map((faq, index) => (
          <div key={`${faq.question}-${index}`} className="rounded-xl bg-muted/30 p-4">
            <dt className="text-base font-semibold text-foreground">{faq.question}</dt>
            {faq.answer && (
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
};

export default SuggestedFaqs;
