import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCcw, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";

interface InsightRow {
  town: string;
  page: string;
  impressions: number;
  ctr: number;
  calls: number;
  formFills: number;
  estimatedRevenue: number;
}

interface InsightsResponse {
  updatedAt: string;
  rows: InsightRow[];
}

const fetchInsights = async (): Promise<InsightsResponse> => {
  const { data, error } = await supabase.functions.invoke<InsightsResponse>("portal-admin-insights");
  if (error) {
    throw new Error(error.message);
  }
  return data ?? { updatedAt: new Date().toISOString(), rows: [] };
};

const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: value % 1 === 0 ? 0 : 1 }).format(value);

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const formatPercent = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

const toCsv = (rows: InsightRow[]): string => {
  if (rows.length === 0) return "town,page,impressions,ctr,calls,form_fills,estimated_revenue";
  const headers = ["town", "page", "impressions", "ctr", "calls", "form_fills", "estimated_revenue"];
  const dataRows = rows.map((row) =>
    [
      row.town,
      row.page,
      row.impressions.toString(),
      row.ctr.toString(),
      row.calls.toString(),
      row.formFills.toString(),
      row.estimatedRevenue.toString(),
    ].join(",")
  );
  return [headers.join(","), ...dataRows].join("\n");
};

const AdminInsights = () => {
  const [search, setSearch] = useState("");
  const [minCalls, setMinCalls] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: fetchInsights,
    staleTime: 1000 * 60 * 5,
  });

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return data.rows.filter((row) => {
      const matchesSearch = !search
        || row.town.toLowerCase().includes(search.toLowerCase())
        || row.page.toLowerCase().includes(search.toLowerCase());
      const matchesCalls = !minCalls || row.calls >= Number(minCalls);
      const matchesRevenue = !minRevenue || row.estimatedRevenue >= Number(minRevenue);
      return matchesSearch && matchesCalls && matchesRevenue;
    });
  }, [data, search, minCalls, minRevenue]);

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => {
        acc.impressions += row.impressions;
        acc.calls += row.calls;
        acc.formFills += row.formFills;
        acc.revenue += row.estimatedRevenue;
        return acc;
      },
      { impressions: 0, calls: 0, formFills: 0, revenue: 0 }
    );
  }, [filteredRows]);

  const handleDownload = () => {
    const csv = toCsv(filteredRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `content-impact-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Content Impact Insights</h1>
              <p className="text-sm text-neutral-500 mt-1">
                Track how each town page contributes to awareness and pipeline. Data refreshes daily from the reporting sheet.
              </p>
              {data?.updatedAt && (
                <p className="text-xs text-neutral-400 mt-1">
                  Last updated: {new Date(data.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
              >
                <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button
                onClick={handleDownload}
                disabled={filteredRows.length === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 transition-colors disabled:opacity-60"
              >
                <Download className="h-4 w-4" /> Download CSV
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter by town or page"
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              value={minCalls}
              onChange={(event) => setMinCalls(event.target.value)}
              placeholder="Min calls"
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              type="number"
              min={0}
            />
            <input
              value={minRevenue}
              onChange={(event) => setMinRevenue(event.target.value)}
              placeholder="Min est. revenue"
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              type="number"
              min={0}
            />
            <div className="rounded-xl border border-neutral-200 px-3 py-2 text-sm bg-white text-neutral-600">
              Showing {filteredRows.length} of {data?.rows.length ?? 0} rows
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Impressions</p>
              <p className="text-xl font-semibold">{formatNumber(totals.impressions)}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Calls</p>
              <p className="text-xl font-semibold">{formatNumber(totals.calls)}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Form fills</p>
              <p className="text-xl font-semibold">{formatNumber(totals.formFills)}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Est. revenue</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.revenue)}</p>
            </div>
          </section>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Failed to load insights: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-center text-neutral-500">
              No pages match your filters yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Town</th>
                    <th className="px-3 py-2 text-left">Page</th>
                    <th className="px-3 py-2 text-right">Impressions</th>
                    <th className="px-3 py-2 text-right">CTR</th>
                    <th className="px-3 py-2 text-right">Calls</th>
                    <th className="px-3 py-2 text-right">Form fills</th>
                    <th className="px-3 py-2 text-right">Est. revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, index) => (
                    <tr key={`${row.page}-${index}`} className="border-t border-neutral-100 hover:bg-neutral-50">
                      <td className="px-3 py-2 align-top">{row.town || "—"}</td>
                      <td className="px-3 py-2 align-top text-neutral-600">{row.page}</td>
                      <td className="px-3 py-2 align-top text-right">{formatNumber(row.impressions)}</td>
                      <td className="px-3 py-2 align-top text-right">{formatPercent(row.ctr)}</td>
                      <td className="px-3 py-2 align-top text-right">{formatNumber(row.calls)}</td>
                      <td className="px-3 py-2 align-top text-right">{formatNumber(row.formFills)}</td>
                      <td className="px-3 py-2 align-top text-right">{formatCurrency(row.estimatedRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-neutral-400">
            Source: CONTENT_IMPACT_CSV_URL. Update the sheet and the dashboard refreshes automatically within 24 hours.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminInsights;
