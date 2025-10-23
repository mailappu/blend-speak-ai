import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log("Google function called");
    const { messages, apiKey, model = "gemini-2.0-flash-exp" } = await req.json();
    console.log("Model requested:", model);
    console.log("API key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("No API key provided");
      return new Response(
        JSON.stringify({ error: "Google API key is required. Please add it in Settings." }), 
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert messages to Gemini format
    const contents = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    const systemInstruction = messages.find((m: any) => m.role === "system")?.content;

    console.log("Calling Google API...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      }
    );

    console.log("Google API response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("Google API error response:", error);
      
      let errorMessage = "Google API request failed";
      try {
        const errorData = JSON.parse(error);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // If parsing fails, use default message
      }
      
      return new Response(
        JSON.stringify({ error: `Gemini Error: ${errorMessage}` }), 
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Successfully got response from Google");

    return new Response(
      JSON.stringify({ content }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-google:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }), 
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
