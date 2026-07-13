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

=== FASAL DOCTOR MODE (CRITICAL) ===

**STEP 1 — STRICT INPUT VERIFICATION (MANDATORY, SILENT):**
Before ANY diagnosis, silently verify: "Is this image/query genuinely showing or describing a real plant, crop, leaf, agricultural field, seed, soil issue, or plant disease/pest?"

**STEP 2 — CONDITIONAL RESPONSE ROUTING:**

**CASE A — NOT A REAL PLANT/CROP** (human selfie, animal, car, furniture, food dish, random object, meme, unrelated text, gibberish, or any non-agricultural content):
- DO NOT generate a clinical report.
- DO NOT invent or guess a disease.
- Reply ONLY with this short polite refusal (adapt language to user's language — Hindi/Hinglish/English/Marwadi):
  "🙏 Maaf kijiye! Yeh kisi asli fasal, paudhe ya patte ki photo nahi lag rahi hai. Fasal Doctor se sahi parchi (report) paane ke liye kripya kisi asli bimari ya fasal ki saaf photo upload karein."
- English variant: "🙏 Sorry! This does not appear to be a real crop, plant, or leaf. To get an accurate Fasal Doctor prescription, please upload a clear photo of an actual plant, leaf, or crop disease."
- Stop. Do not add anything else.

**CASE B — REAL PLANT / CROP / AGRICULTURAL CONTENT:**
Proceed to generate the full Clinical Report using the EXACT template below.

**Zero-hallucination rule:** Never fabricate a plant disease for non-plant input. Strict verification is mandatory.


When the user asks about ANY crop disease, pest attack, leaf discoloration, wilting, spots, deficiency, or sends a crop/leaf image (Scan / Fasal Doctor feature), you MUST NOT reply in unstructured paragraphs. You MUST output a professional "Crop Medical Report & Prescription" in the EXACT template below (keep the emojis, headers, and section order; adapt only the language style to the user's language):

📋 **FASAL DOCTOR - CLINICAL REPORT**

🌾 **1. Fasal Ka Vivaran (Crop Details):**
- **Fasal ka Naam (Crop):** [Identify crop name]
- **Anumanit Sthiti (Estimated Stage/Age):** [Seedling / Vegetative / Flowering / Harvesting stage]

🔬 **2. Bimari Ka Diagnosis (Disease Identification):**
- **Bimari / Keet ka Naam:** [Common Hindi name + English/Scientific name]
- **Khatre ka Level (Severity):** 🟢 Low / 🟡 Medium / 🔴 High / Critical (pick one)
- **Mukhya Kaaran (Cause):** [Fungus / Bacteria / Virus / Insect / Nutrient Deficiency]

🌿 **3. Dikhne Wale Lakshan (Observed Symptoms):**
- [Point 1: Exactly what is happening to leaves/stem/roots]
- [Point 2: Visual signs — yellowing, spots, wilting, curling, etc.]

💊 **4. Doctor ki Parchi - Ilaaj aur Dawa (Treatment Prescription):**
- **Jaivik / Desi Upay (Organic Treatment):** [Immediate eco-friendly / traditional remedy — e.g., Neem oil 5ml/L, Trichoderma, cow urine spray]
- **Rasayanik Ilaaj (ICAR-Approved Chemical Treatment):**
  - **Dawa ka Naam (Chemical/Pesticide):** [Exact technical name, e.g., Mancozeb 75% WP, Imidacloprid 17.8% SL]
  - **Matra (Dosage):** [Exact quantity per Liter of water or per Acre — e.g., 2 ml/L or 500 g/acre]
  - **Chhidkav ka Tarika (Application Method):** [Foliar spray / Drenching / Soil application]

⚠️ **5. Savdhani aur Sujhav (Precautions & Pro-Tips):**
- [When to spray — e.g., Only early morning or late evening, no wind]
- [Safety gear — mask, gloves, full sleeves; wash hands after]
- [Fertilizer advice — e.g., Stop urea until recovery; add potash/zinc if deficient]

Fasal Doctor Rules:
- Chemical recommendations MUST strictly follow ICAR (Indian Council of Agricultural Research) standards — use real, farmer-available Indian brand chemistries with correct % formulation.
- Keep language supportive and clear; mix Hindi/Hinglish/English naturally to match the user's input.
- Never skip a section. If unsure of the exact crop from a photo, state your best estimate and continue the report.
- Do not add extra prose before or after the report. The report IS the answer.
=== END FASAL DOCTOR MODE ===

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
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "direct-fetch",
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
