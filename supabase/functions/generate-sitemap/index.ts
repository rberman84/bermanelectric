import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml",
};

// Static pages with priorities
const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/residential", priority: "0.9", changefreq: "weekly" },
  { url: "/commercial", priority: "0.9", changefreq: "weekly" },
  { url: "/ev-charger", priority: "0.9", changefreq: "weekly" },
  { url: "/emergency", priority: "0.9", changefreq: "weekly" },
  { url: "/contact", priority: "0.8", changefreq: "monthly" },
  { url: "/about", priority: "0.7", changefreq: "monthly" },
  { url: "/projects", priority: "0.7", changefreq: "monthly" },
  { url: "/testimonials", priority: "0.7", changefreq: "weekly" },
  { url: "/blog", priority: "0.8", changefreq: "daily" },
  { url: "/faq", priority: "0.6", changefreq: "monthly" },
  { url: "/resources", priority: "0.6", changefreq: "monthly" },
  { url: "/electrician-long-island", priority: "0.9", changefreq: "weekly" },
  { url: "/electrician-suffolk-county", priority: "0.9", changefreq: "weekly" },
  { url: "/nassau-county", priority: "0.8", changefreq: "weekly" },
  { url: "/suffolk-county", priority: "0.8", changefreq: "weekly" },
  { url: "/towns", priority: "0.7", changefreq: "weekly" },
];

// Nassau County towns
const nassauTowns = [
  "baldwin", "bellmore", "bethpage", "carle-place", "east-meadow", "east-rockaway",
  "elmont", "farmingdale", "floral-park", "franklin-square", "freeport", "garden-city",
  "glen-cove", "great-neck", "hempstead", "hewlett", "hicksville", "island-park",
  "jericho", "lawrence", "levittown", "locust-valley", "long-beach", "lynbrook",
  "malverne", "manhasset", "massapequa", "massapequa-park", "merrick", "mineola",
  "new-hyde-park", "oceanside", "old-bethpage", "old-westbury", "oyster-bay",
  "plainview", "port-washington", "rockville-centre", "roosevelt", "roslyn",
  "sea-cliff", "seaford", "syosset", "uniondale", "valley-stream", "wantagh",
  "westbury", "williston-park", "woodbury", "woodmere"
];

// Suffolk County towns
const suffolkTowns = [
  "amityville", "babylon", "bay-shore", "bellport", "blue-point", "bohemia",
  "brentwood", "bridgehampton", "brookhaven", "centereach", "centerport",
  "central-islip", "cold-spring-harbor", "commack", "copiague", "coram",
  "deer-park", "dix-hills", "east-hampton", "east-islip", "east-northport",
  "east-setauket", "farmingville", "greenlawn", "hauppauge", "holbrook",
  "holtsville", "huntington", "huntington-station", "islandia", "islip",
  "kings-park", "lake-grove", "lake-ronkonkoma", "lindenhurst", "long-island",
  "mastic", "medford", "melville", "middle-island", "miller-place", "mount-sinai",
  "nesconset", "north-babylon", "northport", "oakdale", "patchogue", "port-jefferson",
  "port-jefferson-station", "riverhead", "rocky-point", "ronkonkoma", "sayville",
  "selden", "setauket", "shirley", "smithtown", "sound-beach", "south-setauket",
  "st-james", "stony-brook", "wading-river", "west-babylon", "west-islip",
  "wyandanch", "yaphank"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const baseUrl = "https://bermanelectrical.com";
    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at 
          ? post.updated_at.split("T")[0] 
          : post.published_at?.split("T")[0] || today;
        xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    // Add Nassau County towns
    for (const town of nassauTowns) {
      xml += `  <url>
    <loc>${baseUrl}/nassau-county/${town}-electrician</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    // Add Suffolk County towns
    for (const town of suffolkTowns) {
      xml += `  <url>
    <loc>${baseUrl}/suffolk-county/${town}-electrician</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: { ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
