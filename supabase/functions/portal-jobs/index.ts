import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JobSummary {
  id: string;
  date: string;
  title: string;
  status: "Completed" | "Scheduled" | "Pending" | "In Progress" | "Cancelled";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization")!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get limit from query params
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "10");

    // Fetch service requests for this user
    const { data: requests, error } = await supabase
      .from("service_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform to JobSummary format
    const jobs: JobSummary[] = (requests || []).map((r) => ({
      id: r.id,
      date: r.preferred_date || r.created_at,
      title: r.service_type,
      status: formatStatus(r.status),
    }));

    return new Response(JSON.stringify(jobs), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in portal-jobs function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function formatStatus(status: string): JobSummary["status"] {
  const map: Record<string, JobSummary["status"]> = {
    completed: "Completed",
    scheduled: "Scheduled",
    pending: "Pending",
    in_progress: "In Progress",
    cancelled: "Cancelled",
  };
  return map[status] || "Pending";
}

serve(handler);
