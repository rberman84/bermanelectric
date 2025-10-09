import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type FaqSuggestionRow = {
  id: string;
  page_url: string;
  question: string;
  answer?: string | null;
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  suggested_at: string;
  approved: boolean;
  approved_at: string | null;
  archived: boolean;
};

type ManualFaq = {
  question: string;
  answer?: string;
};

type UseFaqSuggestionsResult = {
  suggestions: ManualFaq[];
  loading: boolean;
  error: string | null;
  rawRows: FaqSuggestionRow[];
};

export const useFaqSuggestions = (pageUrl: string, manualFaqs: ManualFaq[] = []): UseFaqSuggestionsResult => {
  const [rawRows, setRawRows] = useState<FaqSuggestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!pageUrl) {
        setRawRows([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from<FaqSuggestionRow>("faq_suggestions")
          .select("*")
          .eq("page_url", pageUrl)
          .eq("approved", true)
          .eq("archived", false)
          .order("impressions", { ascending: false })
          .limit(5);

        if (!isMounted) return;

        if (supabaseError) {
          throw supabaseError;
        }

        setRawRows(data ?? []);
        setError(null);
      } catch (err) {
        console.error("Failed to load FAQ suggestions", err);
        if (!isMounted) return;
        setError((err as Error).message ?? "Unable to load FAQ suggestions");
        setRawRows([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [pageUrl]);

  const suggestions = useMemo(() => {
    if (rawRows.length > 0) {
      return rawRows.map((row) => ({ question: row.question, answer: row.answer ?? undefined }));
    }

    return manualFaqs;
  }, [rawRows, manualFaqs]);

  return { suggestions, loading, error, rawRows };
};
