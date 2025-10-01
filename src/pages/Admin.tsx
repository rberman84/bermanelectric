import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";

type Row = { [key: string]: string };

const Admin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin — Submissions</h1>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </Link>
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-neutral-500">
              <p className="text-lg font-medium text-neutral-700 mb-2">
                No submissions yet
              </p>
              <p className="text-sm">
                Customer submissions will appear here when they book services or request estimates.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-neutral-600">
                    <tr>
                      {Object.keys(rows[0]).map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 whitespace-nowrap font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {rows.map((row, index) => (
                      <tr key={index} className="hover:bg-neutral-50">
                        {Object.keys(rows[0]).map((header) => (
                          <td key={header} className="px-4 py-3 align-top">
                            {row[header] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="font-semibold mb-2">Data Source</h2>
            <p className="text-sm text-neutral-600">
              This data is loaded from your Google Sheet via the SHEET_CSV_URL environment variable.
              Update the sheet to see changes reflected here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
