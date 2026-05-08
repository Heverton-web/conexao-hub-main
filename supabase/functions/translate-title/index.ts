import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getActiveAPIKey(): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("system_integrations")
    .select("gemini_api_key_encrypted, gemini_function, gemini_active")
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Error fetching integrations:", error);
    return null;
  }

  // Se Gemini está ativa e configurada para tradução
  if (data.gemini_active && data.gemini_function === "translate" && data.gemini_api_key_encrypted) {
    return data.gemini_api_key_encrypted;
  }

  // Verificar outras APIs
  const { data: allData } = await supabase
    .from("system_integrations")
    .select("openai_api_key_encrypted, openai_function, openai_active, groq_api_key_encrypted, groq_function, groq_active, openrouter_api_key_encrypted, openrouter_function, openrouter_active")
    .limit(1)
    .single();

  if (allData?.openai_active && allData?.openai_function === "translate" && allData?.openai_api_key_encrypted) {
    return allData.openai_api_key_encrypted;
  }
  if (allData?.groq_active && allData?.groq_function === "translate" && allData?.groq_api_key_encrypted) {
    return allData.groq_api_key_encrypted;
  }
  if (allData?.openrouter_active && allData?.openrouter_function === "translate" && allData?.openrouter_api_key_encrypted) {
    return allData.openrouter_api_key_encrypted;
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = await getActiveAPIKey();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Nenhum provedor de tradução configurado ou ativo. Acesse Admin > Integrações para configurar." }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional translator for dental/medical marketing materials. 
Translate the given material title into three languages. Keep it concise, professional, and technically accurate for the dental industry.
Return ONLY a valid JSON object with this exact structure, no markdown, no code blocks:
{"pt-br": "translated title in Brazilian Portuguese", "en-us": "translated title in American English", "es-es": "translated title in Spanish"}
If the input is already in one of the languages, keep it as-is for that language and translate to the others.

Text to translate: ${text.trim()}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Translation service failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translatedText) {
      return new Response(JSON.stringify({ error: "Invalid response from translation service" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON response
    let translations: Record<string, string>;
    try {
      translations = JSON.parse(translatedText);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse translation response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});