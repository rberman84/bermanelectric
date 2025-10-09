import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FaqSuggestion {
  id: string;
  page_url: string;
  question: string;
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  suggested_at: string;
  approved: boolean;
  approved_at: string | null;
  answer: string | null;
  archived: boolean;
}

const FaqSuggestionsPanel = () => {
  const [suggestions, setSuggestions] = useState<FaqSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "archived" | "all">("pending");
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from<FaqSuggestion>("faq_suggestions")
        .select("*")
        .order("suggested_at", { ascending: false })
        .limit(200);

      if (supabaseError) throw supabaseError;
      setSuggestions(data ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? "Unable to load FAQ suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((item) => {
      if (filter === "pending") return !item.approved && !item.archived;
      if (filter === "approved") return item.approved && !item.archived;
      if (filter === "archived") return item.archived;
      return true;
    });
  }, [suggestions, filter]);

  const handleUpdate = async (id: string, changes: Partial<FaqSuggestion>) => {
    const { error: updateError } = await supabase
      .from("faq_suggestions")
      .update(changes)
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }
  };

  const handleApprove = async (suggestion: FaqSuggestion) => {
    try {
      await handleUpdate(suggestion.id, {
        approved: true,
        approved_at: new Date().toISOString(),
        answer: draftAnswers[suggestion.id] ?? suggestion.answer ?? null,
        archived: false,
      });
      await loadSuggestions();
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? "Failed to approve suggestion");
    }
  };

  const handleArchive = async (suggestion: FaqSuggestion) => {
    try {
      await handleUpdate(suggestion.id, {
        archived: true,
        approved: false,
        answer: draftAnswers[suggestion.id] ?? suggestion.answer ?? null,
      });
      await loadSuggestions();
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? "Failed to archive suggestion");
    }
  };

  const pendingCount = suggestions.filter((item) => !item.approved && !item.archived).length;
  const approvedCount = suggestions.filter((item) => item.approved && !item.archived).length;
  const archivedCount = suggestions.filter((item) => item.archived).length;

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">FAQ Intelligence</h2>
          <p className="text-sm text-muted-foreground">
            Google Search Console queries are mined nightly. Approve five FAQs per page to publish.
          </p>
        </div>
        <button
          onClick={loadSuggestions}
          className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/40 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-full px-4 py-1 font-medium ${filter === "pending" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`rounded-full px-4 py-1 font-medium ${filter === "approved" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter("archived")}
          className={`rounded-full px-4 py-1 font-medium ${filter === "archived" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Archived ({archivedCount})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1 font-medium ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          All ({suggestions.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/10 p-6 text-center text-muted-foreground">
          Nothing here yet. Nightly jobs populate this list from Google Search Console.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const draftedAnswer = draftAnswers[suggestion.id] ?? suggestion.answer ?? "";
            const lastSeen = suggestion.suggested_at
              ? formatDistanceToNow(new Date(suggestion.suggested_at), { addSuffix: true })
              : "fresh";
            let pathLabel = suggestion.page_url;
            try {
              pathLabel = new URL(suggestion.page_url).pathname;
            } catch (_error) {
              // ignore invalid URL formats
            }
            return (
              <article key={suggestion.id} className="rounded-2xl border border-muted-foreground/20 bg-muted/10 p-5">
                <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {pathLabel}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">{suggestion.question}</h3>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{lastSeen}</p>
                    <p>{suggestion.impressions} impressions · {suggestion.clicks} clicks</p>
                    <p>Avg. position {suggestion.position.toFixed(1)}</p>
                  </div>
                </header>

                <div className="mb-3 rounded-lg bg-background px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Source query:</span> “{suggestion.query}”
                </div>

                <textarea
                  value={draftedAnswer}
                  onChange={(event) =>
                    setDraftAnswers((prev) => ({ ...prev, [suggestion.id]: event.target.value }))
                  }
                  placeholder="Draft an answer before publishing to the page..."
                  className="min-h-[120px] w-full rounded-xl border border-muted-foreground/30 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <footer className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    {suggestion.approved && !suggestion.archived ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" /> Published to site
                      </span>
                    ) : suggestion.archived ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-semibold text-muted-foreground">
                        <XCircle className="h-3.5 w-3.5" /> Archived
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                        Awaiting approval
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleArchive(suggestion)}
                      className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/40 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                    >
                      <XCircle className="h-4 w-4" /> Archive
                    </button>
                    <button
                      onClick={() => handleApprove(suggestion)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    >
                      <ShieldCheck className="h-4 w-4" /> Approve & Publish
                    </button>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FaqSuggestionsPanel;
