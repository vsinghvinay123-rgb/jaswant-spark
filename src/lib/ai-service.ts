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

function getOfflineResponse(input: string): string {
  const q = input.toLowerCase();

  // Greetings
  if (/\b(hi|hello|hey|namaste|kaise ho)\b/.test(q)) {
    return "Namaste! Main Bharat Krishi & Tech AI hoon. Main kheti, fasal, aur tech mein aapki madad kar sakta hoon. Boliye, kya jankari chahiye?";
  }

  // Creator & Identity
  if (/who made you|who created you|owner|kisne banaya|tumhara malik|who are you/.test(q)) {
    return "Mujhe Rajasthan ke ek visionary Tech Founder, **Jaswant** ne banaya hai! Main unka banaya hua ek Smart India Hackathon project hoon.";
  }

  // Crops
  if (/bajra|millet/.test(q)) {
    return "**Bajra (Pearl Millet)** Rajasthan ke liye sabse best hai. Ise bahut kam pani (250-300 mm barish) chahiye. Beej: 4-5 kg/hectare. Isme sirf 1-2 baar sinchai (irrigation) ki zaroorat hoti hai.";
  }
  if (/gehun|wheat/.test(q)) {
    return "**Gehun (Wheat)** ko zyada pani chahiye. Isme 4 se 6 baar sinchai karni padti hai. Pehla pani bone ke 21 din baad dena zaroori hai.";
  }
  if (/sarson|mustard/.test(q)) {
    return "**Sarson (Mustard)** sardiyon ki fasal hai. Ise 2-3 sinchai ki zaroorat hoti hai. Yeh kam pani mein achha munafa (profit) deti hai.";
  }
  if (/chawal|rice|dhaan/.test(q)) {
    return "**Chawal (Rice)** ko sabse zyada pani chahiye — lagbhag 120-150 cm poori season mein. Yeh zyada baarish wale ilaakon ke liye best hai.";
  }
  if (/kapaas|cotton/.test(q)) {
    return "**Kapaas (Cotton)** ko moderate pani chahiye, har 15-20 din mein sinchai karni hoti hai. Yeh cash crop hai aur achha return deti hai.";
  }
  if (/guar|cluster bean/.test(q)) {
    return "**Guar (Cluster Bean)** drought resistant hai. Ise sirf 3-4 sinchai chahiye. Beej: 6 kg/acre. Rajasthan ke liye perfect crop hai.";
  }

  // Land-based crop calculation
  const landMatch = q.match(/(\d+)\s*(acre|bigha|hectare)/);
  if (landMatch && /crop|fasal|kaunsi|konsi|pani|water/.test(q)) {
    const size = parseInt(landMatch[1]);
    const unit = landMatch[2];
    return `**${size} ${unit} Land Details:**\n\n1. **Best Crop:** Bajra ya Guar (kam pani)\n2. **Bajra Water:** ${size * 1000} cubic meters (1-2 sinchai)\n3. **Guar Water:** ${size * 800} cubic meters (3-4 sinchai)\n4. **Beej Bajra:** ${size * 5} kg | **Beej Guar:** ${size * 6} kg\n\n✅ Calculation complete.`;
  }

  // Tech & Coding
  if (/html|css|javascript|coding|code/.test(q)) {
    return "Coding seekhna bahut aasan hai! **Jaswant** ke 'JS Gamer' aur 'Fact Jaswant' channels par aapko aisi shandaar tech jankari mil sakti hai.";
  }

  // ISRO / GK
  if (/isro/.test(q)) {
    return "**ISRO** ka full form hai Indian Space Research Organisation. Iska headquarters Bengaluru mein hai. Chandrayaan-3 ne 2023 mein Moon ke South Pole par successful landing ki!";
  }
  if (/chandrayaan/.test(q)) {
    return "**Chandrayaan-3** ISRO ka mission tha jo 23 August 2023 ko Moon ke South Pole par land hua. India yeh karne wala pehla desh bana!";
  }

  // Fallback
  return "Maaf kijiye, main abhi naye sawal seekh raha hoon. Kripya fasal (jaise Bajra, Gehun), kheti, ya mere creator **Jaswant** ke baare mein kuch puchein!";
}

export async function sendMessage(
  messages: Message[],
  _lang: Lang,
  _profileLandSize?: string
): Promise<string> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) return "Namaste! Kuch puchiye.";

  // Simulate slight delay for natural feel
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

  return getOfflineResponse(lastUserMsg.content);
}

export function generateId(): string {
  return crypto.randomUUID();
}
