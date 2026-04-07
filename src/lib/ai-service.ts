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

const kisanTechGK = [
  // Identity & Creator
  { keywords: ["creator", "made", "owner", "kisne banaya", "malik", "who are you", "who made", "who created"], answer: "Mujhe Rajasthan ke visionary Tech Founder, **Jaswant** ne banaya hai. Main SIH ke liye banaya gaya **Bharat AI** hoon." },

  // Kisan GK - Crops & Water
  { keywords: ["bajra", "millet", "pani bajra", "water for bajra"], answer: "**Bajra (Pearl Millet):** Rajasthan ki best fasal. Ise sirf 250-300 mm barish aur 1-2 sinchai (irrigation) chahiye. Beej: 4-5 kg/hectare." },
  { keywords: ["gehun", "wheat", "pani gehun"], answer: "**Gehun (Wheat):** Ise 4-6 baar pani dena padta hai. Pehla pani bone ke 21 din baad (CRI stage) par dena sabse zaroori hai." },
  { keywords: ["sarson", "mustard", "oil"], answer: "**Sarson (Mustard):** Yeh sardiyon ki fasal hai. Ise 2-3 sinchai chahiye. Rajasthan ki mitti iske liye behtareen hai." },
  { keywords: ["guar", "cluster bean", "dry"], answer: "**Guar:** Sukhe (dry) ilako ke liye best hai. Ise bahut kam pani chahiye aur yeh mitti ki urvarak shamta (fertility) badhata hai." },
  { keywords: ["cotton", "kapas", "narma", "kapaas"], answer: "**Kapas (Cotton):** Kali mitti iske liye best hoti hai. Ise 15-20 din ke antar par pani chahiye." },
  { keywords: ["chawal", "rice", "dhaan"], answer: "**Chawal (Rice):** Sabse zyada pani chahiye — lagbhag 120-150 cm poori season mein. Zyada baarish wale ilaakon ke liye best hai." },
  { keywords: ["urea", "khad", "fertilizer", "nitrogen"], answer: "**Urea** sabse zyada use hone wali khad hai. Isme 46% Nitrogen hota hai jo fasal ki growth ke liye zaroori hai. Ise pani dene ke baad daalna chahiye." },

  // Technical GK
  { keywords: ["html", "full form html"], answer: "**HTML** ka full form 'HyperText Markup Language' hai. Yeh kisi bhi website ka dhancha (skeleton) banati hai." },
  { keywords: ["css", "design"], answer: "**CSS** (Cascading Style Sheets) website ko sundar banane aur design karne ke kaam aati hai." },
  { keywords: ["javascript", "js", "brain", "coding", "code"], answer: "**JavaScript** ek programming language hai jo website mein dimaag aur logic dalti hai, bilkul mere dimaag ki tarah!" },
  { keywords: ["ai", "artificial intelligence"], answer: "**AI** (Artificial Intelligence) ka matlab hai computer ko insaan ki tarah sochne aur samajhne ke kabil banana." },
  { keywords: ["isro", "space"], answer: "**ISRO** (Indian Space Research Organisation) Bharat ki space agency hai, jisne Chandrayaan aur Mangalyaan jaise mahan missions kiye hain." },
  { keywords: ["chandrayaan", "moon"], answer: "**Chandrayaan-3** ISRO ka mission tha jo 23 August 2023 ko Moon ke South Pole par land hua. India yeh karne wala pehla desh bana!" },

  // Greetings
  { keywords: ["hi", "hello", "hey", "namaste", "ram ram", "kaise ho"], answer: "Namaste! Main **Jaswant** dwara banaya gaya **Bharat Krishi & Tech AI** hoon. Boliye, fasal ya tech ke baare mein kya janna hai?" },

  // --- Batch 22: Allied Agriculture (Murgi, Bakri & Machhli Palan) ---
  { keywords: ["bakri", "goat", "chheli", "sirohi", "jamnapari"], answer: "🐐 **Bakri Palan:** Bakri ko 'Gareeb ki Gaay' kaha jata hai. Rajasthan mein Sirohi aur Jamnapari nasal (breed) sabse best hain kyunki yeh sukhe mausam mein asani se reh sakti hain. Inka doodh dengue fever mein bahut faydemand hota hai." },
  { keywords: ["murgi", "poultry", "kadaknath", "anda", "egg"], answer: "🐓 **Murgi Palan:** Kheti ke sath extra income ke liye murgi palan best hai. 'Kadaknath' murgi ka meat aur ande (eggs) sabse mehange bikte hain kyunki inme protein bahut zyada aur fat kam hota hai." },
  { keywords: ["machhli palan", "fish farming", "talaab", "rohu"], answer: "🐟 **Machhli Palan:** Agar khet mein diggi ya talab hai, toh usme Rohu aur Katla machhli paal sakte hain. Sarkar 'PM Matsya Sampada Yojana' ke tahat kisanon ko talab banane ke liye 60% tak ki subsidy deti hai." },
  { keywords: ["pashu aahar", "chara", "silage", "sukha chara"], answer: "🌾 **Silage (Hara Chara):** Sardiyon ya sukhe ke waqt jab hara chara nahi hota, tab 'Silage' kaam aata hai. Yeh hare chare ko gaddhe mein daba kar banaya gaya achaar hai jo pashuon ka doodh badhata hai." },

  // --- Batch 23: Offline Tech, PWA & Storage Hacks ---
  { keywords: ["localstorage", "save data", "memory"], answer: "💾 **LocalStorage:** Yeh browser ki ek hidden memory hoti hai. Iska use karke hum user ka theme (Dark/Light) ya chat history save kar sakte hain taaki app band karne ke baad bhi data delete na ho, bina kisi server ke!" },
  { keywords: ["pwa", "progressive web app", "install app", "play store"], answer: "📱 **PWA (Progressive Web App):** PWA ek aisi advance tech hai jisse ek aam website ko log apne phone mein bilkul ek asli 'App' ki tarah install kar sakte hain. 'Bharat AI' ko PWA banane se yeh bina Play Store ke bhi download ho jayega." },
  { keywords: ["cache", "fast load", "speed badhao"], answer: "⚡ **Browser Cache:** Jab app pehli baar khulti hai, toh images aur database browser ke 'Cache' mein save ho jate hain. Isliye agli baar app bina internet ke aur lagbhag instantly (turant) load ho jati hai." },

  // --- Batch 24: Hackathon Pitch, Business Model & Vision ---
  { keywords: ["business model", "paise kaise", "revenue", "monetize"], answer: "💼 **Business Model:** Bharat AI completely free aur offline hai. Future mein isse paise kamane ke liye hum 'Freemium Model' laa sakte hain jahan kisan advance weather alerts ke liye choti si fees de sakte hain, ya agriculture companiyon ke banners chala sakte hain." },
  { keywords: ["problem statement", "kyun banaya", "idea"], answer: "🎯 **Problem Statement:** Gaon mein internet connection kamzor hota hai aur bade AI kisan ki local bhasha nahi samajhte. Bharat AI is problem ko 100% offline rehkar aur local faslon ki sateek jankari dekar solve karta hai. Yahi iski USP (Unique Selling Proposition) hai." },
  { keywords: ["future plan", "aage kya", "roadmap"], answer: "🚀 **Future Roadmap:** Jaswant ka aage ka plan isme ek lightweight 'Offline Image Recognition' (Computer Vision) jodna hai, jisse kisan sirf fasal ki photo khinchega aur AI bina net ke bimari pehchan kar dawa bata dega!" },
  { keywords: ["team", "kon kon", "solo"], answer: "🤝 **The Team:** Yeh poora offline AI architecture aur database ek single tech visionary, Jaswant ne design kiya hai, jo future ki tech industry mein ek bada badlav lane ke liye taiyar hain." },
];

function smartSearch(input: string): string {
  const q = input.toLowerCase();

  // Land-based crop calculation (priority check)
  const landMatch = q.match(/(\d+)\s*(acre|bigha|hectare)/);
  if (landMatch && /crop|fasal|kaunsi|konsi|pani|water|acchi/.test(q)) {
    const size = parseInt(landMatch[1]);
    const unit = landMatch[2];
    return `**${size} ${unit} Land Details:**\n\n1. **Best Crop:** Bajra ya Guar (kam pani)\n2. **Bajra Water:** ${size * 1000} cubic meters (1-2 sinchai)\n3. **Guar Water:** ${size * 800} cubic meters (3-4 sinchai)\n4. **Beej Bajra:** ${size * 5} kg | **Beej Guar:** ${size * 6} kg\n\n✅ Calculation complete.`;
  }

  // Smart keyword matching — find best match by count
  let bestMatch: { answer: string; score: number } = { answer: "", score: 0 };

  for (const entry of kisanTechGK) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) {
        score++;
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { answer: entry.answer, score };
    }
  }

  if (bestMatch.score > 0) {
    return bestMatch.answer;
  }

  // Fallback
  return "Maaf kijiye, mere database mein abhi iski jankari nahi hai. Par mere creator **Jaswant** jald hi mujhe naye 2000+ facts sikhayenge! Kripya kisi fasal, kheti, ya coding ke baare mein puchein.";
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

  return smartSearch(lastUserMsg.content);
}

export function generateId(): string {
  return crypto.randomUUID();
}
