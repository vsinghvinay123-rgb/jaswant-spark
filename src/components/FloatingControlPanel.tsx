import { useState, useRef } from "react";
import { Mic, Camera, MapPin, BarChart3, Bell, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SMSAlertModal from "./SMSAlertModal";
import type { Lang } from "@/lib/i18n";

interface FloatingControlPanelProps {
  onSend: (text: string) => void;              // triggers the full user→AI chat flow
  onImageAnalyze: (dataUrl: string) => void;   // sends photo to Gemini Vision via AI flow
  onVoiceResult: (text: string) => void;       // transcribed speech (auto-submits)
  onLocationDetect: (msg: string) => void;     // fallback status text (errors, no-permission)
  lang: Lang;
}

const T = {
  en: {
    voice: "Voice", listening: "Listening…",
    gps: "GPS", fetching: "Fetching weather…",
    scan: "Scan", analyzing: "Analyzing…",
    mandi: "Mandi",
    sms: "SMS",
    geoDenied: "📍 Location access denied. Please allow location to get weather-based farming advice.",
    geoUnsupported: "📍 Geolocation not supported in this browser.",
    voiceUnsupported: "🎙️ Voice input not supported in this browser. Please use Chrome or Edge.",
    weatherFail: "⚠️ Could not fetch weather data. Please try again.",
    mandiPrompt: "🧑‍🌾 **Act as a real-time Mandi Price Analyst for Indian farmers.**\n\nPlease tell me:\n1. My **district & state** (or I can share GPS location)\n2. The **crop** I want to sell (e.g., Wheat, Mustard, Bajra, Cotton)\n\nOnce I share this, give me:\n- Recent mandi rate trends (₹/quintal) for that crop in nearby mandis\n- Current **Minimum Support Price (MSP)** for the year\n- Whether I should sell now or hold — with reasoning\n- Best nearby mandis (Agmarknet linked)\n- Grading tips to get a better price",
  },
  hi: {
    voice: "वॉइस", listening: "सुन रहा है…",
    gps: "GPS", fetching: "मौसम ला रहा है…",
    scan: "स्कैन", analyzing: "जांच रहा है…",
    mandi: "मंडी",
    sms: "SMS",
    geoDenied: "📍 लोकेशन एक्सेस अस्वीकृत। मौसम आधारित सलाह के लिए लोकेशन अनुमति दें।",
    geoUnsupported: "📍 इस ब्राउज़र में जियोलोकेशन सपोर्ट नहीं है।",
    voiceUnsupported: "🎙️ इस ब्राउज़र में वॉइस सपोर्ट नहीं है। Chrome या Edge इस्तेमाल करें।",
    weatherFail: "⚠️ मौसम डेटा नहीं मिल पाया। कृपया दोबारा कोशिश करें।",
    mandiPrompt: "🧑‍🌾 **आप एक रियल-टाइम मंडी भाव विश्लेषक की भूमिका निभाएँ।**\n\nमुझे बताएँ:\n1. मेरा **जिला और राज्य** (या मैं GPS लोकेशन साझा कर सकता हूँ)\n2. मैं कौन सी **फसल** बेचना चाहता हूँ (जैसे गेहूँ, सरसों, बाजरा, कपास)\n\nइसके आधार पर बताएँ:\n- आस-पास की मंडियों में हाल के भाव (₹/क्विंटल)\n- चालू साल का **न्यूनतम समर्थन मूल्य (MSP)**\n- अभी बेचूँ या रुकूँ — कारण सहित\n- सबसे पास की बेहतर मंडियाँ (Agmarknet)\n- अच्छा भाव पाने के लिए ग्रेडिंग टिप्स",
  },
} as const;

const FloatingControlPanel = ({ onSend, onImageAnalyze, onVoiceResult, onLocationDetect, lang }: FloatingControlPanelProps) => {
  const [listening, setListening] = useState(false);
  const [locating, setLocating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = lang === "hi" || lang === "marwadi" ? T.hi : T.en;

  // ================= VOICE (Web Speech API) =================
  const handleVoice = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      onLocationDetect(t.voiceUnsupported);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = (lang === "hi" || lang === "marwadi" || lang === "hinglish") ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onVoiceResult(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // ================= GPS + Open-Meteo Weather =================
  const handleLocation = () => {
    if (!navigator.geolocation) {
      onLocationDetect(t.geoUnsupported);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&forecast_days=3&timezone=auto`;
          const res = await fetch(url);
          if (!res.ok) throw new Error("weather fetch failed");
          const data = await res.json();
          const cur = data.current || {};
          const daily = data.daily || {};
          const days = (daily.time || []).slice(0, 3);

          const dailyLines = days.map((d: string, i: number) =>
            `- **${d}**: ${daily.temperature_2m_min?.[i]}°C – ${daily.temperature_2m_max?.[i]}°C, rain ${daily.precipitation_sum?.[i] ?? 0}mm (chance ${daily.precipitation_probability_max?.[i] ?? 0}%)`
          ).join("\n");

          const langLabel = (lang === "hi") ? "Hindi" : (lang === "hinglish") ? "Hinglish" : (lang === "marwadi") ? "Marwadi" : "English";

          const prompt = `📍 **Localized Farming Advisory Request**

My GPS coordinates: **${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E**

**Live weather (Open-Meteo)**
- Now: ${cur.temperature_2m}°C, humidity ${cur.relative_humidity_2m}%, wind ${cur.wind_speed_10m} km/h, precipitation ${cur.precipitation ?? 0}mm
- 3-day forecast:
${dailyLines}

**Please act as my Fasal Doctor + Weather Advisor and give me (in ${langLabel}):**
1. What this weather means for a typical farmer in this area (climate zone, likely soil type).
2. **Best crops to sow / manage right now** given the forecast.
3. **Irrigation timing** — should I irrigate today, tomorrow, or wait for rain?
4. **Pest / disease risk** to watch based on humidity & temperature.
5. Any urgent 24-hour action (spraying, harvesting, covering).`;

          onSend(prompt);
        } catch (e) {
          console.error(e);
          onLocationDetect(t.weatherFail);
        } finally {
          setLocating(false);
        }
      },
      () => {
        onLocationDetect(t.geoDenied);
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 15000 }
    );
  };

  // ================= MANDI prompt =================
  const handleMandi = () => {
    onSend(t.mandiPrompt);
  };

  // ================= SCAN → Gemini Vision =================
  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const resizeImage = (file: File, maxDim = 1024): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("no ctx"));
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so same file can be re-picked
    if (!file) return;
    setAnalyzing(true);
    try {
      const dataUrl = await resizeImage(file);
      onImageAnalyze(dataUrl);
    } catch (err) {
      console.error(err);
      onLocationDetect("⚠️ Could not read the image. Please try another photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  const buttons = [
    { icon: <Mic className="h-5 w-5" />, label: listening ? t.listening : t.voice, onClick: handleVoice, active: listening, color: "primary" as const },
    { icon: <MapPin className="h-5 w-5" />, label: locating ? t.fetching : t.gps, onClick: handleLocation, active: locating, color: "secondary" as const },
    { icon: analyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />, label: analyzing ? t.analyzing : t.scan, onClick: handleScanClick, active: analyzing, color: "primary" as const },
    { icon: <BarChart3 className="h-5 w-5" />, label: t.mandi, onClick: handleMandi, active: false, color: "secondary" as const },
    { icon: <Bell className="h-5 w-5" />, label: t.sms, onClick: () => setSmsOpen(true), active: false, color: "primary" as const },
  ];

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelected}
        className="hidden"
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-strong neon-border-orange"
      >
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            disabled={btn.active && !listening}
            className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all ${
              btn.active
                ? "bg-destructive/20 text-destructive"
                : btn.color === "primary"
                  ? "text-primary hover:bg-primary/10"
                  : "text-secondary hover:bg-secondary/10"
            }`}
          >
            <span className="relative z-10">{btn.icon}</span>
            <span className="text-[9px] font-heading font-semibold whitespace-nowrap">{btn.label}</span>
            <AnimatePresence>
              {btn.active && (
                <motion.span
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 rounded-xl bg-destructive/30"
                />
              )}
            </AnimatePresence>
          </button>
        ))}
      </motion.div>

      <SMSAlertModal open={smsOpen} onClose={() => setSmsOpen(false)} lang={lang} />
    </>
  );
};

export default FloatingControlPanel;
