import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";

type Row = { [key: string]: string };

const Admin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [q, setQ] = useState("");
  const [typeF, setTypeF] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  // Sort states
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("portal-admin-submissions");
      
      if (error) throw error;
      
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  const filtered = rows.filter((r) => {
    const matchesSearch = !q || Object.values(r).some((val) =>
      String(val).toLowerCase().includes(q.toLowerCase())
    );
    const matchesType = !typeF || r.type === typeF;
    const ts = r.timestamp ? new Date(r.timestamp).getTime() : 0;
    const matchesFrom = !from || ts >= new Date(from).getTime();
    const matchesTo = !to || ts <= new Date(to + "T23:59:59").getTime();
    return matchesSearch && matchesType && matchesFrom && matchesTo;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey] || "";
    const bVal = b[sortKey] || "";
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const cols = rows.length > 0 ? Object.keys(rows[0]) : [];

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toCsv = (data: Row[]) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((r) =>
      headers.map((h) => JSON.stringify(r[h] || "")).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const downloadCsv = () => {
    const csv = toCsv(sorted);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `berman-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyCsv = async () => {
    const csv = toCsv(sorted);
    try {
      await navigator.clipboard.writeText(csv);
      alert("CSV copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold">Admin — Submissions</h1>
            <Link
              to="/dashboard"
              className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
            >
              Back to Portal
            </Link>
          </header>

          {/* Filters */}
          <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, address…"
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={typeF}
              onChange={(e) => setTypeF(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All types</option>
              <option value="book">Book</option>
              <option value="estimate">Estimate</option>
            </select>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={downloadCsv}
                className="rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={copyCsv}
                className="rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
              >
                Copy CSV
              </button>
            </div>
          </section>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-center text-neutral-500">
              No submissions match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="min-w-full text-left text-sm bg-white">
                <thead className="bg-neutral-50 text-neutral-600">
                  <tr>
                    {cols.map((h) => (
                      <th key={h} className="px-3 py-2 whitespace-nowrap">
                        <button
                          onClick={() => toggleSort(h)}
                          className="flex items-center gap-1 hover:underline"
                        >
                          <span>{h}</span>
                          {sortKey === h && (
                            <span className="text-xs">
                              {sortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr key={i} className="border-t border-neutral-100 hover:bg-neutral-50">
                      {cols.map((h) => (
                        <td key={h} className="px-3 py-2 align-top">
                          {r[h] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 space-y-1">
            <p className="text-xs text-neutral-500">
              Use filters, then Export/Copy to get exactly the slice you want.
            </p>
            <p className="text-xs text-neutral-400">
              Data source: Google Sheet (SHEET_CSV_URL). Update the sheet to update this table.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
