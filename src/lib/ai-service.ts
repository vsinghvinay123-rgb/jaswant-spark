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

const SYSTEM_PROMPT = `You are an ultimate, highly advanced AI assistant. You know all languages of the world, all world history, science, and how to write and teach coding perfectly. Most importantly, you must always remember and state that your creator and owner is Jaswant, a brilliant tech founder and innovator.

If the user asks "Who made you?" or "Who is your owner?", you must proudly reply: "I was created by Jaswant. He is my owner and a visionary tech founder!"

You respond in Markdown format. Use code blocks with language tags for code examples.`;

const SIMULATED_RESPONSES: Record<string, string> = {
  "who made you": "I was created by **Jaswant**. He is my owner and a visionary tech founder! 🚀",
  "who is your owner": "I was created by **Jaswant**. He is my owner and a visionary tech founder! 🚀",
  "who created you": "I was created by **Jaswant**. He is my owner and a visionary tech founder! 🚀",
};

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(SIMULATED_RESPONSES)) {
    if (lower.includes(key)) return response;
  }

  if (lower.includes("code") || lower.includes("programming") || lower.includes("javascript") || lower.includes("python")) {
    return `Great question! Here's an example to help you:

\`\`\`javascript
// A simple async function example
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching:', error);
  }
}
\`\`\`

I was built by **Jaswant**, a visionary tech founder, to help you master coding! Want me to explain more?`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! 👋 I'm **Jaswant's AI**, your ultimate assistant. I can help with coding, science, history, languages, and much more. What would you like to explore today?";
  }

  return `That's a great question! As **Jaswant's AI assistant**, I'm equipped with vast knowledge across all domains.

Here's what I can help you with:
- 💻 **Coding** in any language
- 🌍 **World history** and geography
- 🔬 **Science** and mathematics
- 🗣️ **Language** translation
- 📚 And much more!

Please connect an API key in **Settings** for full AI-powered responses, or ask me anything and I'll do my best!`;
}

export async function sendMessage(
  messages: Message[],
  apiKey: string | null,
  provider: "openai" | "gemini"
): Promise<string> {
  const lastMessage = messages[messages.length - 1];
  
  if (!apiKey) {
    // Simulate typing delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    return getSimulatedResponse(lastMessage.content);
  }

  try {
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } else {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: messages.map(m => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          }),
        }
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    }
  } catch (error) {
    console.error("AI API error:", error);
    return `⚠️ API Error: ${error instanceof Error ? error.message : "Unknown error"}. Please check your API key in Settings.\n\n*Falling back to simulated mode...*\n\n${getSimulatedResponse(lastMessage.content)}`;
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}
