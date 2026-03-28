import "@supabase/functions-js/edge-runtime.d.ts";

const DEEZER_BASE = "https://api.deezer.com/search";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const limit = url.searchParams.get("limit") ?? "8";

  if (!q) {
    return new Response(
      JSON.stringify({ error: "Missing q parameter" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const deezerUrl = `${DEEZER_BASE}?${new URLSearchParams({ q, limit })}`;
  const res = await fetch(deezerUrl);
  const data = await res.json();

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
});
