import { searchKnowledge } from "./bharat-knowledge";
import type { Lang } from "./i18n";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const SYSTEM_PROMPT = `You are Bharat Krishi & Tech AI, a highly advanced agricultural and tech assistant. Your creator, owner, and visionary tech founder is Jaswant from Rajasthan. You must ALWAYS proudly state that Jaswant created you if asked. Provide precise, zero-fluff answers about farming, crop water usage, coding, and general knowledge. Adapt your language based on the user's prompt (reply in English, Hindi, Hinglish, or Marwadi as requested by the user context or UI settings).`;

function getLangInstruction(lang: Lang): string {
  switch (lang) {
    case "hi": return "Reply in Hindi (Devanagari script).";
    case "hinglish": return "Reply in Hinglish (Hindi words written in English script).";
    case "marwadi": return "Reply in Marwadi/Rajasthani (written in English script).";
    default: return "Reply in English.";
  }
}

async function callGemini(
  messages: Message[],
  lang: Lang,
  profileLandSize?: string
): Promise<string> {
  const apiKey = localStorage.getItem("bharat-gemini-key");
  if (!apiKey) throw new Error("NO_KEY");

  const contextParts: string[] = [];
  if (profileLandSize) contextParts.push(`User's land size: ${profileLandSize}.`);
  contextParts.push(getLangInstruction(lang));

  const systemInstruction = SYSTEM_PROMPT + "\n\n" + contextParts.join(" ");

  const conversationHistory = messages
    .map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `SYSTEM INSTRUCTION: ${systemInstruction}\n\n${conversationHistory ? "CONVERSATION HISTORY:\n" + conversationHistory : ""}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini error:", res.status, err);
    throw new Error("API Error: Please check your Gemini API key in Settings.");
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export async function sendMessage(
  messages: Message[],
  lang: Lang,
  profileLandSize?: string
): Promise<string> {
  try {
    return await callOpenAI(messages, lang, profileLandSize);
  } catch (e: any) {
    if (e.message === "NO_KEY") {
      // Fallback to offline
      const lastMessage = messages[messages.length - 1];
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
      return searchKnowledge(lastMessage.content, lang, profileLandSize);
    }
    throw e;
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}
