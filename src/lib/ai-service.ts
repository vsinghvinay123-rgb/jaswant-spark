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

  // --- Batch 16: Value Addition & Business (Farming to Factory) ---
  { keywords: ["food processing", "sauce", "ketchup", "juice", "business"], answer: "🏭 **Food Processing (Value Addition):** Tamatar khet mein ₹10/kg bikta hai, par uska Ketchup banakar ₹150/kg bikta hai! Kisan ko ab sirf fasal nahi, fasal ka 'Product' banana chahiye. Sarkar 'PMFME Scheme' ke tahat aisi factory lagane par 35% subsidy deti hai." },
  { keywords: ["parali", "stubble", "kachra jalana", "dhuaan"], answer: "🔥 **Parali (Stubble) Jalana:** Khet mein fasal ka kachra jalane se mitti ke faydemand bacteria mar jate hain aur pradushan hota hai. Iski jagah 'Happy Seeder' machine ka use karein jo kachre ko mitti mein milakar natural khad bana deti hai." },
  { keywords: ["mahila kisan", "women farmer", "aurat"], answer: "👩‍🌾 **Mahila Kisan Pariyojana:** Kheti mein 70% kaam mahilayein karti hain. 'Mahila Kisan Sashaktikaran Pariyojana (MKSP)' ke tahat auraton ke Self-Help Groups (SHGs) ko drone chalane aur tractor ki special training aur fund milta hai." },
  { keywords: ["carbon credit", "hawa saaf", "ped lagana"], answer: "🌳 **Carbon Credits:** Agar aap organic kheti karte hain aur khet mein ped lagate hain, toh aap hawa ko saaf kar rahe hain. Duniya ki badi companiyan iske badle kisan ko 'Carbon Credits' deti hain, jo dollars ($) mein bikte hain!" },

  // --- Batch 17: The Rajasthan Survival & Desert Mastery ---
  { keywords: ["oont", "camel", "ship of desert", "oontni"], answer: "🐪 **Oont (Camel) Palan:** Oontni ka doodh (Camel Milk) Diabetes (Sugar) aur height badhane ke liye sabse best mana jata hai. Bikaner mein 'National Research Centre on Camel' hai jahan ispar bahut research hoti hai." },
  { keywords: ["guar gum", "gvar", "export"], answer: "🛢️ **Guar Gum Export:** Rajasthan duniya ka sabse bada Guar producer hai. Guar se nikla 'Gum' America aur Europe mein oil drilling aur cosmetics (makeup) banane mein use hota hai. Yeh ek International cash crop hai!" },
  { keywords: ["johad", "khadeen", "baarish ka pani", "rainwater"], answer: "🌧️ **Johad / Khadeen (Water Harvesting):** Churu aur Jaisalmer jaise ilakon mein barish ka pani rokne ki paramparik takneek. Khet ke dhalan par mitti ki deewar banakar pani roka jata hai, jisse saal bhar zameen mein nami (moisture) rehti hai." },
  { keywords: ["khejri fali", "sangri", "panchkuta"], answer: "🍲 **Sangri (Khejri):** Khejri ke ped par lagne wali fali ko 'Sangri' kehte hain. Marwad ki 'Ker-Sangri' ki sabzi duniya bhar mein 5-star hotels mein mehngi bikti hai. Yeh sukhe ilake ka green gold hai!" },

  // --- Batch 18: Smart India Hackathon & Deep Tech Secrets ---
  { keywords: ["sih", "smart india hackathon", "judge", "pitch"], answer: "🏆 **SIH Winning Strategy:** Smart India Hackathon mein jeetne ke liye app ka 'Practical' hona zaroori hai. Bharat AI 100% offline chalta hai, regional language support karta hai, aur kisan ki real problem solve karta hai—yahi iski sabse badi USP (Unique Selling Proposition) hai!" },
  { keywords: ["hallucination", "ai jhooth", "galat jawab", "fake answer"], answer: "🤖 **AI Hallucination:** Bade AI (jaise ChatGPT) kabhi-kabhi confidence ke sath jhooth bol dete hain, ise 'Hallucination' kehte hain. Par Jaswant ka Bharat AI ek 'Rule-Based Engine' hai, isliye yeh kheti ke mamle mein hamesha 100% sateek aur verified jawab hi deta hai." },
  { keywords: ["nlp", "natural language processing", "keyword match"], answer: "🧠 **NLP (Natural Language Processing):** Yeh computer ki woh takneek hai jisse machine insaan ki bhasha (text ya voice) samajhti hai. Humara app Regex aur Fuzzy matching use karke kisan ke sawal mein se main 'Keywords' nikalta hai." },
  { keywords: ["internet nahi", "offline ai", "bina net"], answer: "📶 **Offline Capability:** Gaon mein hamesha 5G nahi hota. Isliye is app ka dimaag (Database) seedha mobile ke browser mein load ho jata hai. Bina internet ke chalna is app ki sabse badi power hai." },

  // --- Batch 19: Weather Crisis & Disaster Management ---
  { keywords: ["ola", "hailstorm", "olavrishti", "barf"], answer: "🧊 **Olavrishti (Hailstorm):** Olo se fasal barbad hone par turant apne khet ki photo khinchein aur 72 ghante ke andar PMFBY (Fasal Bima Yojna) app par claim darj karein ya toll-free number par call karein." },
  { keywords: ["bijli girna", "lightning", "kadak", "aakashiy bijli"], answer: "⚡ **Aakashiy Bijli (Lightning):** Barish aur toofan ke waqt khet mein ped ke neeche ya tractor par na baithein. Sarkar ki 'Damini App' download karein jo bijli girne se 40 minute pehle aapke mobile par alert de deti hai." },
  { keywords: ["khet talab", "farm pond", "paani ikattha", "diggi"], answer: "🌊 **Khet Talab Yojna:** Barish ka pani khet mein hi rokne ke liye farm pond (diggi) banwayein. Rajasthan sarkar iske nirmaan par kisanon ko 60% se 70% tak ki subsidy deti hai." },

  // --- Batch 20: Digital Portals, Revenue Records & E-Governance ---
  { keywords: ["jamabandi", "nakal", "khata", "khasra", "apna khata"], answer: "📄 **Jamabandi & Apna Khata:** Ab nakal nikalwane ke liye patwari ke chakkar lagane ki zaroorat nahi. Rajasthan sarkar ke 'Apna Khata' portal par apna Khasra number daalkar online Jamabandi free mein nikal sakte hain." },
  { keywords: ["girdawari", "fasal ki entry"], answer: "📝 **E-Girdawari:** Patwari dwara khet mein kaunsi fasal boi gayi hai, iski online entry ko Girdawari kehte hain. Fasal bima claim aur MSP par fasal bechne ke liye yeh sabse zaroori sarkaari document hai." },
  { keywords: ["agmarknet", "mandi bhav app"], answer: "📱 **Agmarknet Portal:** Yeh Bharat sarkar ka official portal hai jahan aap pure desh ki kisi bhi mandi ka daily live bhav (price) apne mobile par ek click mein dekh sakte hain." },
  { keywords: ["emitra", "e-mitra"], answer: "🖥️ **E-Mitra:** Rajasthan mein kisi bhi krishi yojna (jaise tarbandi, pipeline, solar pump) ka form bharne ke liye sabse nazdiki E-Mitra center par jayein. Wahan se aapka aavedan seedha krishi vibhag ke system mein chala jayega." },

  // --- Batch 21: Highly Profitable Medicinal Crops (Ausadhiya Kheti) ---
  { keywords: ["ashwagandha", "asgandh"], answer: "🌿 **Ashwagandha:** Retili mitti aur kam pani wali sabse top aushadhiya (medicinal) fasal. Iski jado (roots) ki market mein bhari demand hai aur yeh aam fasal se 3 guna zyada munafa (profit) deti hai." },
  { keywords: ["sonamukhi", "sena"], answer: "🍃 **Sonamukhi (Senna):** Churu aur Jodhpur ke aaspaas ke ilakon ke liye vardan! Ek baar bone ke baad yeh 3-4 saal tak patte deti hai. Isme awara pashu muh nahi marte aur pani ki zaroorat bilkul kam hoti hai." },
  { keywords: ["safed musli", "musli"], answer: "🌱 **Safed Musli:** Ise kheti ka 'Safed Sona' (White Gold) kaha jata hai. Ise halki retili mitti mein lagaya jata hai aur mandi mein iska bhav ₹1000 se ₹1500 prati kilo tak mil jata hai." },
  { keywords: ["tulsi", "basil"], answer: "🪴 **Tulsi Farming:** Patanjali aur Dabur jaisi Ayurvedic companiyan contract farming ke zariye Tulsi seedha kisan se kharidti hain. Yeh 3 mahine mein taiyar ho jati hai aur isme keede-bimari ka khatra lagbhag zero hota hai." },
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
