import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log("Anthropic function called");
    const { messages, apiKey, model = "claude-sonnet-4-5" } = await req.json();
    console.log("Model requested:", model);
    console.log("API key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("No API key provided");
      return new Response(
        JSON.stringify({ error: "Anthropic API key is required. Please add it in Settings." }), 
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert messages format for Anthropic
    const anthropicMessages = messages.filter((m: any) => m.role !== "system");
    const systemMessage = messages.find((m: any) => m.role === "system")?.content || "";

    console.log("Calling Anthropic API...");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemMessage,
        messages: anthropicMessages,
      }),
    });

    console.log("Anthropic API response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error response:", error);
      
      let errorMessage = "Anthropic API request failed";
      try {
        const errorData = JSON.parse(error);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // If parsing fails, use default message
      }
      
      return new Response(
        JSON.stringify({ error: `Claude Error: ${errorMessage}` }), 
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";
    console.log("Successfully got response from Anthropic");

    return new Response(
      JSON.stringify({ content }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-anthropic:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }), 
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
