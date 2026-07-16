import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Ask Bharat AI's Fasal Doctor for a structured Indian crop diagnosis / agri advice.
 * Runs server-side against the Lovable AI Gateway using the caller's identity for audit.
 */
export default defineTool({
  name: "ask_fasal_doctor",
  title: "Ask Fasal Doctor",
  description:
    "Ask Bharat AI's Fasal Doctor for structured crop diagnosis, pest / disease prescriptions (ICAR-standard), mandi advice, irrigation advice, or general Indian agriculture guidance. Returns a professional clinical report when the question is about a plant / crop.",
  inputSchema: {
    question: z
      .string()
      .min(3)
      .max(4000)
      .describe(
        "The farmer's question in English, Hindi, Hinglish or Marwadi. E.g. 'Wheat leaves turning yellow with orange stripes' or 'Aaj bajra ka mandi bhav Rajasthan'."
      ),
    lang: z
      .enum(["en", "hi", "hinglish", "mar"])
      .default("en")
      .describe("Preferred reply language: en, hi (Hindi), hinglish, or mar (Marwadi)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ question, lang }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { content: [{ type: "text", text: "Service misconfigured: LOVABLE_API_KEY missing." }], isError: true };
    }

    const system = `You are Bharat AI - Fasal Doctor. Reply in language code: ${lang}.
For any crop disease, pest, deficiency or scan-style question, respond ONLY in this format:

📋 **FASAL DOCTOR - CLINICAL REPORT**

🌾 **1. Fasal Ka Vivaran (Crop Details)**
🔬 **2. Bimari Ka Diagnosis (Disease Identification)** — include severity 🟢/🟡/🔴 and cause type
🌿 **3. Dikhne Wale Lakshan (Observed Symptoms)** — bullets
💊 **4. Doctor ki Parchi - Ilaaj aur Dawa** — Jaivik + Rasayanik (ICAR chemical name, dosage, method)
⚠️ **5. Savdhani aur Sujhav**

For non-plant / non-agri questions, answer briefly in bullet points. Never fabricate a disease for non-plant input; politely refuse instead.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "mcp-js",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        content: [{ type: "text", text: `AI gateway error ${res.status}: ${errText.slice(0, 300)}` }],
        isError: true,
      };
    }
    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? "No response generated.";
    return {
      content: [{ type: "text", text: reply }],
      structuredContent: { reply, lang, askedBy: ctx.getUserEmail() ?? ctx.getUserId() },
    };
  },
});
