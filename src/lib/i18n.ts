export type Lang = "en" | "hi";

export const UI_TEXT = {
  en: {
    appName: "Bharat AI",
    tagline: "Your Indian Knowledge Assistant",
    chatHistory: "Chat History",
    newChat: "New Chat",
    placeholder: "Ask me about farming, history, coding, ISRO...",
    poweredBy: "Created by Jaswant",
    cropCalculator: "Crop Water Calculator",
    selectCrop: "Select a crop",
    waterSchedule: "Watering Schedule",
    irrigations: "Irrigations",
    waterNeeded: "Water Needed",
    schedule: "Schedule",
    bestRegions: "Best Regions",
    welcome: `# Namaste! 🙏🇮🇳

I am **Bharat AI**, created by the innovator **Jaswant**.

I'm your offline Indian knowledge assistant! Ask me about:
- 🌾 **Smart Farming** — Crop water schedules
- 🏛️ **Indian History** — Ancient to modern
- 🚀 **ISRO** — India's space achievements
- 💻 **Coding** — Learn in Hinglish!
- 🇮🇳 **Great Leaders** — From Gandhi to Kalam

💡 Try the **Crop Water Calculator** for instant farming info!`,
  },
  hi: {
    appName: "भारत AI",
    tagline: "आपका भारतीय ज्ञान सहायक",
    chatHistory: "चैट इतिहास",
    newChat: "नई चैट",
    placeholder: "खेती, इतिहास, कोडिंग, ISRO के बारे में पूछें...",
    poweredBy: "जसवंत द्वारा निर्मित",
    cropCalculator: "फसल पानी कैलकुलेटर",
    selectCrop: "फसल चुनें",
    waterSchedule: "सिंचाई अनुसूची",
    irrigations: "सिंचाई",
    waterNeeded: "पानी की आवश्यकता",
    schedule: "अनुसूची",
    bestRegions: "उत्तम क्षेत्र",
    welcome: `# नमस्ते! 🙏🇮🇳

मैं **भारत AI** हूँ, नवप्रवर्तक **जसवंत** द्वारा निर्मित।

मैं आपका ऑफ़लाइन भारतीय ज्ञान सहायक हूँ! मुझसे पूछें:
- 🌾 **स्मार्ट खेती** — फसल पानी अनुसूची
- 🏛️ **भारतीय इतिहास** — प्राचीन से आधुनिक
- 🚀 **ISRO** — भारत की अंतरिक्ष उपलब्धियां
- 💻 **कोडिंग** — हिंग्लिश में सीखें!
- 🇮🇳 **महान नेता** — गांधी से कलाम तक

💡 तुरंत खेती की जानकारी के लिए **फसल पानी कैलकुलेटर** आज़माएं!`,
  },
} as const;
