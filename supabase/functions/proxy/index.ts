import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Proxy function called");
    const { url, headers: requestHeaders, body } = await req.json();

    if (!url) {
      console.error("No target URL provided");
      return new Response(
        JSON.stringify({ error: "Target URL is required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Forwarding request to:", url);

    // Forward the request to the target URL
    const response = await fetch(url, {
      method: "POST",
      headers: requestHeaders || {},
      body: JSON.stringify(body),
    });

    console.log("Target API response status:", response.status);

    // Get the response data
    const data = await response.text();

    // Return the response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Error in proxy function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
