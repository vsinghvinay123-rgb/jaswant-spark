export type Lang = "en" | "hi" | "hinglish" | "marwadi";

export const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "hinglish", label: "Hinglish" },
  { value: "marwadi", label: "मारवाड़ी" },
];

export const UI_TEXT: Record<Lang, {
  appName: string;
  tagline: string;
  chatHistory: string;
  newChat: string;
  placeholder: string;
  poweredBy: string;
  cropCalculator: string;
  selectCrop: string;
  waterSchedule: string;
  irrigations: string;
  waterNeeded: string;
  schedule: string;
  bestRegions: string;
  welcome: string;
  shareWhatsApp: string;
  setProfile: string;
  profileName: string;
  profileLand: string;
  profileLang: string;
  save: string;
  splashTagline: string;
  botPrefix: string;
  fallback: string;
  sendBtn: string;
}> = {
  en: {
    appName: "Bharat AI",
    tagline: "Your Indian Knowledge Assistant",
    chatHistory: "Chat History",
    newChat: "New Chat",
    placeholder: "Ask Fasal Doctor about crops, pests, or weather...",
    poweredBy: "Created by Jaswant",
    cropCalculator: "Crop Calculator",
    selectCrop: "Select a crop",
    waterSchedule: "Watering Schedule",
    irrigations: "Irrigations",
    waterNeeded: "Water Needed",
    schedule: "Schedule",
    bestRegions: "Best Regions",
    shareWhatsApp: "Share on WhatsApp",
    setProfile: "Set Your Profile",
    profileName: "Your Name",
    profileLand: "Land Size (e.g. 5 Acre)",
    profileLang: "Preferred Language",
    save: "Save",
    splashTagline: "Empowering Farmers. Built by Jaswant.",
    botPrefix: "🤖 **Jaswant's AI Analysis:**\n\n",
    fallback: "Sorry, I don't have this information yet. Please ask about crops, farming, or coding!",
    sendBtn: "Send",
    welcome: `## Namaste! 🙏🇮🇳

I am **Bharat AI**, created by **Jaswant**.

**Capabilities:**
- 🌾 Agri-Math Engine — type "5 acre bajra" for instant calculation
- 📷 Fasal Doctor — scan crop leaves
- 📍 Auto-Location — optimized crop suggestions
- 🎤 Voice Input — speak your question
- 📡 100+ GK facts — ISRO, History, Constitution
- 💻 Coding basics in Hinglish

**Use the tools below or type your question. Direct answers only.**`,
  },
  hi: {
    appName: "भारत AI",
    tagline: "आपका भारतीय ज्ञान सहायक",
    chatHistory: "चैट इतिहास",
    newChat: "नई चैट",
    placeholder: "फसल, मौसम या कीड़ों के बारे में पूछें...",
    poweredBy: "जसवंत द्वारा निर्मित",
    cropCalculator: "फसल कैलकुलेटर",
    selectCrop: "फसल चुनें",
    waterSchedule: "सिंचाई अनुसूची",
    irrigations: "सिंचाई",
    waterNeeded: "पानी की आवश्यकता",
    schedule: "अनुसूची",
    bestRegions: "उत्तम क्षेत्र",
    shareWhatsApp: "WhatsApp पर शेयर करें",
    setProfile: "अपनी प्रोफ़ाइल सेट करें",
    profileName: "आपका नाम",
    profileLand: "ज़मीन का आकार (जैसे 5 एकड़)",
    profileLang: "पसंदीदा भाषा",
    save: "सेव करें",
    splashTagline: "किसानों को सशक्त बनाना। जसवंत द्वारा निर्मित।",
    botPrefix: "🤖 **जसवंत एआई रिपोर्ट:**\n\n",
    fallback: "माफ़ कीजिए, यह जानकारी मेरे डेटाबेस में नहीं है।",
    sendBtn: "भेजें",
    welcome: `## नमस्ते! 🙏🇮🇳

मैं **भारत AI** हूँ, **जसवंत** द्वारा निर्मित।

**क्षमताएं:**
- 🌾 एग्री-मैथ इंजन — "5 एकड़ बाजरा" टाइप करें
- 📷 फसल डॉक्टर — फसल की पत्तियां स्कैन करें
- 📍 ऑटो-लोकेशन — अनुकूलित फसल सुझाव
- 🎤 वॉइस इनपुट — अपना सवाल बोलें
- 📡 100+ GK तथ्य — ISRO, इतिहास, संविधान
- 💻 हिंग्लिश में कोडिंग बेसिक्स

**नीचे के टूल्स इस्तेमाल करें या सवाल टाइप करें। सीधे जवाब।**`,
  },
  hinglish: {
    appName: "Bharat AI",
    tagline: "Aapka Indian Knowledge Assistant",
    chatHistory: "Chat History",
    newChat: "Nayi Chat",
    placeholder: "Fasal, mausam ya keedo ke baare mein puchein...",
    poweredBy: "Jaswant ne banaya",
    cropCalculator: "Crop Calculator",
    selectCrop: "Crop chuno",
    waterSchedule: "Pani ka Schedule",
    irrigations: "Sinchai",
    waterNeeded: "Pani Chahiye",
    schedule: "Schedule",
    bestRegions: "Best Regions",
    shareWhatsApp: "WhatsApp pe Share karo",
    setProfile: "Apni Profile Set Karo",
    profileName: "Aapka Naam",
    profileLand: "Zameen ka Size (jaise 5 Acre)",
    profileLang: "Pasandida Bhasha",
    save: "Save Karo",
    splashTagline: "Kisano ko Empower karna. Jaswant ne banaya.",
    botPrefix: "🤖 **Jaswant AI Report:**\n\n",
    fallback: "Maaf kijiye, yeh jankari mere database mein nahi hai.",
    sendBtn: "Bhejein",
    welcome: `## Hello! 🙏🇮🇳

Main **Bharat AI** hoon, **Jaswant** ka banaya hua AI.

**Capabilities:**
- 🌾 Agri-Math Engine — "5 acre bajra" type karo
- 📷 Fasal Doctor — crop ki pattiyan scan karo
- 📍 Auto-Location — optimized crop suggestions
- 🎤 Voice Input — apna sawaal bolo
- 📡 100+ GK facts — ISRO, History, Constitution
- 💻 Coding basics Hinglish mein

**Neeche ke tools use karo ya sawaal type karo. Seedhe jawaab.**`,
  },
  marwadi: {
    appName: "भारत AI",
    tagline: "थारो भारतीय ज्ञान सहायक",
    chatHistory: "चैट इतिहास",
    newChat: "नई चैट",
    placeholder: "फसल या मौसम रै बारै में पूछो सा...",
    poweredBy: "जसवंत रो बनायो",
    cropCalculator: "फसल कैलकुलेटर",
    selectCrop: "फसल चुणो",
    waterSchedule: "पाणी रो हिसाब",
    irrigations: "सिंचाई",
    waterNeeded: "पाणी री जरूरत",
    schedule: "समय सारणी",
    bestRegions: "सबसूं सारा इलाका",
    shareWhatsApp: "WhatsApp पर भेजो",
    setProfile: "थारी प्रोफ़ाइल सेट करो",
    profileName: "थारो नाम",
    profileLand: "ज़मीन रो आकार (जियां 5 एकड़)",
    profileLang: "पसंदीदा भाषा",
    save: "सेव करो",
    splashTagline: "किसाना नै सशक्त करणो। जसवंत रो बनायो।",
    botPrefix: "🤖 **जसवंत रो एआई बतावै है:**\n\n",
    fallback: "माफी चाहूँ सा, आ जानकारी म्हारै कनै कोनी।",
    sendBtn: "भेजो सा",
    welcome: `## खम्मा घणी! 🙏🇮🇳

मैं **भारत AI** हूँ, **जसवंत** रो बनायो गयो।

**क्षमताएं:**
- 🌾 एग्री-मैथ इंजन — "5 एकड़ बाजरा" टाइप करो
- 📷 फसल डॉक्टर — फसल री पत्तियां स्कैन करो
- 📍 ऑटो-लोकेशन — अनुकूलित फसल सुझाव
- 🎤 वॉइस इनपुट — थारो सवाल बोलो
- 📡 100+ GK तथ्य — ISRO, इतिहास, संविधान
- 💻 हिंग्लिश में कोडिंग बेसिक्स

**नीचे रा टूल्स इस्तेमाल करो या सवाल टाइप करो। सीधा जवाब।**`,
  },
} as const;
