export type Lang = "en" | "hi";

export const UI_TEXT = {
  en: {
    appName: "Bharat AI",
    tagline: "Your Indian Knowledge Assistant",
    chatHistory: "Chat History",
    newChat: "New Chat",
    placeholder: "Ask anything — \"5 acre bajra\", \"ISRO\", \"coding\"...",
    poweredBy: "Created by Jaswant",
    cropCalculator: "Crop Calculator",
    selectCrop: "Select a crop",
    waterSchedule: "Watering Schedule",
    irrigations: "Irrigations",
    waterNeeded: "Water Needed",
    schedule: "Schedule",
    bestRegions: "Best Regions",
    welcome: `## Namaste! 🙏🇮🇳

I am **Bharat AI**, created by **Jaswant**.

**Capabilities:**
- 🌾 Agri-Math Engine — type "5 acre bajra" for instant calculation
- 📷 Fasal Doctor — scan crop leaves
- 📍 Auto-Location — optimized crop suggestions
- 🎤 Voice Input — speak your question
- 📡 60+ GK facts — ISRO, History, Constitution
- 💻 Coding basics in Hinglish

**Use the tools below or type your question. Direct answers only.**`,
  },
  hi: {
    appName: "भारत AI",
    tagline: "आपका भारतीय ज्ञान सहायक",
    chatHistory: "चैट इतिहास",
    newChat: "नई चैट",
    placeholder: "कुछ भी पूछें — \"5 एकड़ बाजरा\", \"ISRO\", \"कोडिंग\"...",
    poweredBy: "जसवंत द्वारा निर्मित",
    cropCalculator: "फसल कैलकुलेटर",
    selectCrop: "फसल चुनें",
    waterSchedule: "सिंचाई अनुसूची",
    irrigations: "सिंचाई",
    waterNeeded: "पानी की आवश्यकता",
    schedule: "अनुसूची",
    bestRegions: "उत्तम क्षेत्र",
    welcome: `## नमस्ते! 🙏🇮🇳

मैं **भारत AI** हूँ, **जसवंत** द्वारा निर्मित।

**क्षमताएं:**
- 🌾 एग्री-मैथ इंजन — "5 एकड़ बाजरा" टाइप करें तुरंत गणना के लिए
- 📷 फसल डॉक्टर — फसल की पत्तियां स्कैन करें
- 📍 ऑटो-लोकेशन — अनुकूलित फसल सुझाव
- 🎤 वॉइस इनपुट — अपना सवाल बोलें
- 📡 60+ GK तथ्य — ISRO, इतिहास, संविधान
- 💻 हिंग्लिश में कोडिंग बेसिक्स

**नीचे के टूल्स इस्तेमाल करें या सवाल टाइप करें। सीधे जवाब।**`,
  },
} as const;
