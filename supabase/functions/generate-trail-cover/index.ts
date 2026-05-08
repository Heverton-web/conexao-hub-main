import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function getActiveAPIKey(): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("system_integrations")
    .select("openai_api_key_encrypted, openai_function, openai_active")
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Error fetching integrations:", error);
    return null;
  }

  if (data.openai_active && data.openai_function === "image" && data.openai_api_key_encrypted) {
    return data.openai_api_key_encrypted;
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, collectionId } = await req.json();

    if (!title || !collectionId) {
      return new Response(JSON.stringify({ error: "title and collectionId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = await getActiveAPIKey();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Nenhum provedor de geração de imagens configurado ou ativo. Acesse Admin > Integrações para configurar OpenAI com função de Imagens." }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Create a premium, elegant cover image for a dental education learning trail called "${title}". 
The image should be a 16:9 aspect ratio banner (1200x675px).
Style: Modern, sophisticated, dark navy blue (#0a1e3d) background with metallic gold (#c9a655) accents. 
Use abstract geometric patterns, subtle gradients, and a premium feel similar to luxury dental brands.
Include subtle dental/medical iconography integrated into the abstract design.
Do NOT include any text in the image.
The overall mood should be professional, innovative, and premium.`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI image API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download and upload to Supabase Storage
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageBuffer);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileName = `${collectionId}.png`;

    const { error: uploadError } = await supabase.storage
      .from("trail-covers")
      .upload(fileName, imageBytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to upload image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("trail-covers")
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ coverUrl: publicUrlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});