export interface CropInfo {
  nameEn: string;
  nameHi: string;
  waterNeeded: string;
  waterNeededHi: string;
  irrigations: string;
  irrigationsHi: string;
  schedule: string;
  scheduleHi: string;
  bestFor: string;
  bestForHi: string;
}

export const CROPS: CropInfo[] = [
  {
    nameEn: "Wheat (Gehun)",
    nameHi: "गेहूं",
    waterNeeded: "Moderate",
    waterNeededHi: "मध्यम",
    irrigations: "4-6 irrigations",
    irrigationsHi: "4-6 सिंचाई",
    schedule: "First irrigation after 21 days of sowing, then every 20-25 days",
    scheduleHi: "बुवाई के 21 दिन बाद पहली सिंचाई, फिर हर 20-25 दिन",
    bestFor: "North India - Punjab, Haryana, UP, MP",
    bestForHi: "उत्तर भारत - पंजाब, हरियाणा, यूपी, मध्य प्रदेश",
  },
  {
    nameEn: "Rice (Chawal)",
    nameHi: "चावल",
    waterNeeded: "Very High - 120-150 cm throughout season",
    waterNeededHi: "बहुत अधिक - पूरे मौसम में 120-150 सेमी",
    irrigations: "Continuous standing water required",
    irrigationsHi: "लगातार खड़े पानी की आवश्यकता",
    schedule: "Maintain 5-7 cm water level from transplanting to 2 weeks before harvest",
    scheduleHi: "रोपाई से कटाई के 2 सप्ताह पहले तक 5-7 सेमी पानी का स्तर बनाए रखें",
    bestFor: "West Bengal, Tamil Nadu, Andhra Pradesh, Punjab",
    bestForHi: "पश्चिम बंगाल, तमिलनाडु, आंध्र प्रदेश, पंजाब",
  },
  {
    nameEn: "Bajra (Pearl Millet)",
    nameHi: "बाजरा",
    waterNeeded: "Very Low",
    waterNeededHi: "बहुत कम",
    irrigations: "2-3 irrigations only",
    irrigationsHi: "केवल 2-3 सिंचाई",
    schedule: "Drought-resistant crop, perfect for arid regions. Water at flowering stage only if needed",
    scheduleHi: "सूखा-प्रतिरोधी फसल, शुष्क क्षेत्रों के लिए उत्तम। फूल आने पर ही पानी दें",
    bestFor: "Rajasthan, Gujarat, Maharashtra, Haryana",
    bestForHi: "राजस्थान, गुजरात, महाराष्ट्र, हरियाणा",
  },
  {
    nameEn: "Cotton (Kapaas)",
    nameHi: "कपास",
    waterNeeded: "Moderate",
    waterNeededHi: "मध्यम",
    irrigations: "6-8 irrigations, every 15-20 days",
    irrigationsHi: "6-8 सिंचाई, हर 15-20 दिन",
    schedule: "First irrigation at square formation, then every 15-20 days. Avoid waterlogging",
    scheduleHi: "स्क्वायर बनने पर पहली सिंचाई, फिर हर 15-20 दिन। जलभराव से बचें",
    bestFor: "Gujarat, Maharashtra, Telangana, Madhya Pradesh",
    bestForHi: "गुजरात, महाराष्ट्र, तेलंगाना, मध्य प्रदेश",
  },
  {
    nameEn: "Sugarcane (Ganna)",
    nameHi: "गन्ना",
    waterNeeded: "High - 200-250 cm",
    waterNeededHi: "अधिक - 200-250 सेमी",
    irrigations: "25-30 irrigations",
    irrigationsHi: "25-30 सिंचाई",
    schedule: "Every 7-10 days in summer, 15-20 days in winter",
    scheduleHi: "गर्मियों में हर 7-10 दिन, सर्दियों में 15-20 दिन",
    bestFor: "UP, Maharashtra, Karnataka, Tamil Nadu",
    bestForHi: "यूपी, महाराष्ट्र, कर्नाटक, तमिलनाडु",
  },
];

interface KnowledgeEntry {
  keywords: string[];
  responseEn: string;
  responseHi: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ["who made you", "who created you", "who is your owner", "kisne banaya", "creator", "tumhe kisne"],
    responseEn: "I am **Bharat AI**, created by the innovator **Jaswant**! 🇮🇳 He built me to serve India with knowledge about farming, education, history, and technology.",
    responseHi: "मैं **भारत AI** हूँ, नवप्रवर्तक **जसवंत** द्वारा बनाया गया! 🇮🇳 उन्होंने मुझे खेती, शिक्षा, इतिहास और तकनीक की जानकारी के साथ भारत की सेवा के लिए बनाया है।",
  },
  {
    keywords: ["isro", "space", "antriksh", "chandrayaan", "mangalyaan"],
    responseEn: `## ISRO - India's Pride in Space 🚀

**Indian Space Research Organisation (ISRO)** has achieved remarkable milestones:

- 🌙 **Chandrayaan-3 (2023)**: India became the **4th country** to land on the Moon and the **1st to land near the South Pole**!
- 🔴 **Mangalyaan (2014)**: India's Mars mission — the **cheapest Mars mission ever** at just ₹450 crore (~$74 million).
- 🛰️ **104 satellites** launched in a single mission (2017) — a world record!
- 🌞 **Aditya-L1**: India's first solar observation mission.

ISRO was founded by **Dr. Vikram Sarabhai** in 1969. Jai Hind! 🇮🇳`,
    responseHi: `## ISRO - अंतरिक्ष में भारत का गौरव 🚀

**भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO)** ने कई उल्लेखनीय उपलब्धियां हासिल की हैं:

- 🌙 **चंद्रयान-3 (2023)**: भारत चंद्रमा पर उतरने वाला **चौथा देश** और **दक्षिणी ध्रुव पर पहला**!
- 🔴 **मंगलयान (2014)**: भारत का मंगल मिशन — **सबसे सस्ता मंगल मिशन** सिर्फ ₹450 करोड़ में।
- 🛰️ **104 उपग्रह** एक ही मिशन में (2017) — विश्व रिकॉर्ड!
- 🌞 **आदित्य-L1**: भारत का पहला सौर अवलोकन मिशन।

ISRO की स्थापना **डॉ. विक्रम साराभाई** ने 1969 में की थी। जय हिंद! 🇮🇳`,
  },
  {
    keywords: ["history", "india history", "itihas", "bharat ka itihas", "ancient india"],
    responseEn: `## Indian History — A Glorious Journey 🏛️

- 🏔️ **Indus Valley Civilization (3300-1300 BCE)**: One of the world's oldest civilizations with advanced urban planning.
- 📚 **Vedic Period**: Origin of the Vedas, world's oldest scriptures.
- 👑 **Maurya Empire**: Emperor **Ashoka** spread Buddhism and peace across Asia.
- 🕌 **Mughal Era**: Built the **Taj Mahal**, one of the 7 Wonders.
- ✊ **Freedom Struggle**: Led by **Mahatma Gandhi, Bhagat Singh, Subhas Chandra Bose** and many brave freedom fighters.
- 🇮🇳 **Independence**: 15th August 1947 — India became free!

India's history spans **5000+ years** of culture, science, and resilience. 🙏`,
    responseHi: `## भारतीय इतिहास — एक गौरवशाली यात्रा 🏛️

- 🏔️ **सिंधु घाटी सभ्यता (3300-1300 ईसा पूर्व)**: दुनिया की सबसे पुरानी सभ्यताओं में से एक।
- 📚 **वैदिक काल**: वेदों का उद्गम, दुनिया के सबसे पुराने ग्रंथ।
- 👑 **मौर्य साम्राज्य**: सम्राट **अशोक** ने एशिया में बौद्ध धर्म और शांति फैलाई।
- 🕌 **मुगल काल**: **ताजमहल** का निर्माण, 7 अजूबों में से एक।
- ✊ **स्वतंत्रता संग्राम**: **महात्मा गांधी, भगत सिंह, सुभाष चंद्र बोस** के नेतृत्व में।
- 🇮🇳 **स्वतंत्रता**: 15 अगस्त 1947 — भारत आज़ाद हुआ!

भारत का इतिहास **5000+ वर्षों** की संस्कृति, विज्ञान और दृढ़ता का है। 🙏`,
  },
  {
    keywords: ["leader", "neta", "gandhi", "nehru", "modi", "great indian"],
    responseEn: `## Great Indian Leaders 🇮🇳

- 🕊️ **Mahatma Gandhi**: Father of the Nation. Led India to freedom through non-violence (Ahimsa).
- 🌹 **Jawaharlal Nehru**: First PM of India. Built modern India's institutions.
- 🗡️ **Bhagat Singh**: Fearless revolutionary who sacrificed his life at age 23.
- ⚔️ **Subhas Chandra Bose**: "Tum mujhe khoon do, main tumhe azaadi dunga!" — Founded the INA.
- 📖 **Dr. B.R. Ambedkar**: Architect of the Indian Constitution, champion of social justice.
- 🚀 **Dr. APJ Abdul Kalam**: Missile Man of India, inspiring President and scientist.

These leaders shaped the India we know today! 🙏`,
    responseHi: `## महान भारतीय नेता 🇮🇳

- 🕊️ **महात्मा गांधी**: राष्ट्रपिता। अहिंसा से भारत को आज़ादी दिलाई।
- 🌹 **जवाहरलाल नेहरू**: भारत के पहले प्रधानमंत्री। आधुनिक भारत के निर्माता।
- 🗡️ **भगत सिंह**: 23 साल की उम्र में शहीद होने वाले निडर क्रांतिकारी।
- ⚔️ **सुभाष चंद्र बोस**: "तुम मुझे खून दो, मैं तुम्हें आज़ादी दूंगा!" — INA के संस्थापक।
- 📖 **डॉ. बी.आर. अम्बेडकर**: भारतीय संविधान के निर्माता, सामाजिक न्याय के चैंपियन।
- 🚀 **डॉ. एपीजे अब्दुल कलाम**: भारत के मिसाइल मैन, प्रेरणादायक राष्ट्रपति।

इन नेताओं ने आज के भारत को आकार दिया! 🙏`,
  },
  {
    keywords: ["coding", "code", "programming", "html", "css", "javascript", "js", "python", "react"],
    responseEn: `## Coding Basics — Hinglish Style! 💻

Coding seekhna bahut easy hai! Let me explain:

### HTML (Page ka structure)
\`\`\`html
<h1>Namaste Bharat!</h1>
<p>Yeh ek paragraph hai.</p>
\`\`\`

### CSS (Page ko sundar banao)
\`\`\`css
h1 {
  color: #FF9933; /* Saffron color! */
  font-size: 24px;
}
\`\`\`

### JavaScript (Page ko smart banao)
\`\`\`javascript
// User se naam lo aur greet karo
let naam = prompt("Aapka naam kya hai?");
alert("Namaste, " + naam + "! Bharat AI mein aapka swagat hai!");
\`\`\`

**Tip**: Pehle HTML seekho → phir CSS → phir JavaScript. Step by step jao! 🚀`,
    responseHi: `## कोडिंग की बुनियाद — हिंग्लिश स्टाइल! 💻

कोडिंग सीखना बहुत आसान है! समझिए:

### HTML (पेज का ढांचा)
\`\`\`html
<h1>नमस्ते भारत!</h1>
<p>यह एक पैराग्राफ है।</p>
\`\`\`

### CSS (पेज को सुंदर बनाएं)
\`\`\`css
h1 {
  color: #FF9933; /* केसरी रंग! */
  font-size: 24px;
}
\`\`\`

### JavaScript (पेज को स्मार्ट बनाएं)
\`\`\`javascript
// User से नाम लो और greet करो
let naam = prompt("आपका नाम क्या है?");
alert("नमस्ते, " + naam + "! भारत AI में आपका स्वागत है!");
\`\`\`

**टिप**: पहले HTML सीखो → फिर CSS → फिर JavaScript। कदम-दर-कदम चलो! 🚀`,
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "namaskar", "kaise ho"],
    responseEn: "Namaste! 🙏 I am **Bharat AI**, created by the innovator **Jaswant**. I can help you with Smart Farming 🌾, Indian History 🏛️, Coding 💻, ISRO 🚀, and much more! How can I help you today?",
    responseHi: "नमस्ते! 🙏 मैं **भारत AI** हूँ, नवप्रवर्तक **जसवंत** द्वारा निर्मित। मैं आपकी स्मार्ट खेती 🌾, भारतीय इतिहास 🏛️, कोडिंग 💻, ISRO 🚀 और बहुत कुछ में मदद कर सकता हूँ! आज मैं आपकी कैसे सहायता कर सकता हूँ?",
  },
  {
    keywords: ["crop", "fasal", "kheti", "farming", "kisan", "agriculture", "wheat", "gehun", "rice", "chawal", "bajra", "cotton", "kapaas", "ganna", "sugarcane", "sinchai", "irrigation", "water", "pani"],
    responseEn: "",
    responseHi: "",
  },
];

export function searchKnowledge(query: string, lang: "en" | "hi"): string {
  const lower = query.toLowerCase().trim();

  // Check for crop-related queries
  const cropKeywords = ["crop", "fasal", "kheti", "farming", "wheat", "gehun", "rice", "chawal", "bajra", "cotton", "kapaas", "ganna", "sugarcane", "sinchai", "irrigation", "water", "pani"];
  const isCropQuery = cropKeywords.some(k => lower.includes(k));

  if (isCropQuery) {
    // Check if asking about a specific crop
    const specificCrop = CROPS.find(c =>
      lower.includes(c.nameEn.toLowerCase().split(" ")[0]) ||
      lower.includes(c.nameEn.toLowerCase().split("(")[1]?.replace(")", "").trim() || "__") ||
      lower.includes(c.nameHi)
    );

    if (specificCrop) {
      return lang === "en"
        ? `## 🌾 ${specificCrop.nameEn}\n\n| Detail | Info |\n|---|---|\n| **Water Needed** | ${specificCrop.waterNeeded} |\n| **Irrigations** | ${specificCrop.irrigations} |\n| **Schedule** | ${specificCrop.schedule} |\n| **Best Regions** | ${specificCrop.bestFor} |\n\n💡 *Use the Crop Water Calculator for a quick lookup of all crops!*`
        : `## 🌾 ${specificCrop.nameHi}\n\n| विवरण | जानकारी |\n|---|---|\n| **पानी की आवश्यकता** | ${specificCrop.waterNeededHi} |\n| **सिंचाई** | ${specificCrop.irrigationsHi} |\n| **अनुसूची** | ${specificCrop.scheduleHi} |\n| **उत्तम क्षेत्र** | ${specificCrop.bestForHi} |\n\n💡 *सभी फसलों की जानकारी के लिए क्रॉप वॉटर कैलकुलेटर इस्तेमाल करें!*`;
    }

    // General crop info
    const allCrops = CROPS.map(c => lang === "en"
      ? `- **${c.nameEn}**: ${c.irrigations} — ${c.schedule}`
      : `- **${c.nameHi}**: ${c.irrigationsHi} — ${c.scheduleHi}`
    ).join("\n");

    return lang === "en"
      ? `## 🌾 Smart Farming — Crop Water Guide\n\n${allCrops}\n\n💡 *Use the Crop Water Calculator button for detailed info!*`
      : `## 🌾 स्मार्ट खेती — फसल पानी गाइड\n\n${allCrops}\n\n💡 *विस्तृत जानकारी के लिए क्रॉप वॉटर कैलकुलेटर बटन दबाएं!*`;
  }

  // Search general knowledge
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(k => lower.includes(k))) {
      const response = lang === "en" ? entry.responseEn : entry.responseHi;
      if (response) return response;
    }
  }

  // Default fallback
  return lang === "en"
    ? "Main abhi seekh raha hoon, par **Jaswant** mujhe jaldi hi iski jaankari dega! 🙏\n\n*I am still learning, but Jaswant will update me soon!*\n\nTry asking me about: 🌾 Crops & Farming | 🏛️ Indian History | 🚀 ISRO | 💻 Coding | 🇮🇳 Great Indian Leaders"
    : "मैं अभी सीख रहा हूँ, पर **जसवंत** मुझे जल्दी ही इसकी जानकारी देगा! 🙏\n\nमुझसे पूछें: 🌾 फसलें और खेती | 🏛️ भारतीय इतिहास | 🚀 ISRO | 💻 कोडिंग | 🇮🇳 महान भारतीय नेता";
}
