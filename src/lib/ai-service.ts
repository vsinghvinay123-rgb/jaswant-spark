import { searchKnowledge } from "./bharat-knowledge";

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

export async function sendMessage(
  messages: Message[],
  lang: "en" | "hi"
): Promise<string> {
  const lastMessage = messages[messages.length - 1];

  // Simulate brief processing time
  await new Promise(r => setTimeout(r, 400 + Math.random() * 600));

  return searchKnowledge(lastMessage.content, lang);
}

export function generateId(): string {
  return crypto.randomUUID();
}
