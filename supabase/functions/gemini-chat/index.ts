import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface InMsg {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 4000;
const MAX_LANG_CHARS = 16;
const MAX_CROP_CONTEXT_CHARS = 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Public endpoint — no auth required so any visitor can use Fasal Doctor tools.

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Service misconfigured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, lang, cropContext, imageDataUrl } = (body ?? {}) as {
      messages?: unknown;
      lang?: unknown;
      cropContext?: unknown;
      imageDataUrl?: unknown;
    };

    // Validate optional image (base64 data URL, max ~8MB after encoding)
    let safeImageDataUrl: string | null = null;
    if (typeof imageDataUrl === "string" && imageDataUrl.startsWith("data:image/") && imageDataUrl.length < 8_000_000) {
      safeImageDataUrl = imageDataUrl;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: `Too many messages (max ${MAX_MESSAGES}).` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strict whitelist of role + content. Drops anything else (e.g. injected "system").
    const validatedMessages: InMsg[] = [];
    for (const m of messages) {
      if (!m || typeof m !== "object") continue;
      const role = (m as { role?: unknown }).role;
      const content = (m as { content?: unknown }).content;
      if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
      validatedMessages.push({
        role,
        content: content.slice(0, MAX_CONTENT_CHARS),
      });
    }

    if (validatedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeLang = typeof lang === "string" ? lang.slice(0, MAX_LANG_CHARS).replace(/[^a-zA-Z-]/g, "") : "en";
    const safeCropContext =
      typeof cropContext === "string" ? cropContext.slice(0, MAX_CROP_CONTEXT_CHARS) : "";

    const system = `You are Bharat AI, a multilingual Indian assistant created by Jaswant (a visionary tech founder from Rajasthan) for the Smart India Hackathon (SIH).

Persona & Rules:
- Always identify Jaswant as your creator if asked.
- Reply in the user's language: ${safeLang || "en"} (en = English, hi = Hindi, hinglish = Roman-script Hindi-English mix, mar = Marwadi).
- Zero fluff. Be direct, highly detailed, use bullet points and bold key terms with **markdown**.
- Expertise: Indian agriculture (crops, water, fertilizer, mandi prices, schemes), E-Governance, Class 10 study help, Tech (coding, AI), Finance, Health.
- For agriculture questions, give practical actionable advice for Indian (esp. Rajasthan) farmers.
${safeCropContext ? `\nUser context: ${safeCropContext}` : ""}`;

    // Build chat messages. If an image is attached, upgrade the LAST user message
    // to multimodal content array so Gemini Vision can see the crop photo.
    const chatMessages: Array<{ role: string; content: unknown }> = [
      { role: "system", content: system },
      ...validatedMessages,
    ];

    if (safeImageDataUrl) {
      // Find last user message and convert its content to a multimodal array
      for (let i = chatMessages.length - 1; i >= 0; i--) {
        if (chatMessages[i].role === "user") {
          const textPart = chatMessages[i].content as string;
          chatMessages[i].content = [
            { type: "text", text: textPart },
            { type: "image_url", image_url: { url: safeImageDataUrl } },
          ];
          break;
        }
      }
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: chatMessages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Lovable AI error", res.status, errText);
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, no response generated.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("gemini-chat error", err);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
