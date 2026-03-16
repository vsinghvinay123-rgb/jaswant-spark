import { useState, useRef } from "react";
import { Mic, Camera, MapPin, BarChart3, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FasalDoctorModal from "./FasalDoctorModal";
import MandiPredictor from "./MandiPredictor";
import SMSAlertModal from "./SMSAlertModal";
import type { Lang } from "@/lib/i18n";

interface FloatingControlPanelProps {
  onVoiceResult: (text: string) => void;
  onLocationDetect: (msg: string) => void;
  lang: Lang;
}

const FloatingControlPanel = ({ onVoiceResult, onLocationDetect, lang }: FloatingControlPanelProps) => {
  const [listening, setListening] = useState(false);
  const [locating, setLocating] = useState(false);
  const [fasalOpen, setFasalOpen] = useState(false);
  const [mandiOpen, setMandiOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleVoice = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      onVoiceResult(lang === "en" ? "Voice not supported in this browser." : "इस ब्राउज़र में वॉइस सपोर्ट नहीं है।");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = (lang === "hi" || lang === "marwadi") ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      onVoiceResult(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      onLocationDetect(lang === "en" ? "Geolocation not supported." : "जियोलोकेशन सपोर्ट नहीं है।");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let climate = { en: "Dry", hi: "शुष्क" };
        let soil = { en: "Sandy", hi: "रेतीली" };
        let action = {
          en: "Sowing Bajra or Guar requires 70% less water here.",
          hi: "यहां बाजरा या ग्वार बोने में 70% कम पानी लगेगा।"
        };

        if (latitude > 28 && latitude < 32) {
          climate = { en: "Sub-Humid", hi: "उप-आर्द्र" };
          soil = { en: "Alluvial", hi: "जलोढ़" };
          action = { en: "Ideal for Wheat and Rice. Ensure 4-6 irrigations.", hi: "गेहूं और चावल के लिए आदर्श। 4-6 सिंचाई सुनिश्चित करें।" };
        } else if (latitude < 20) {
          climate = { en: "Tropical Humid", hi: "उष्णकटिबंधीय आर्द्र" };
          soil = { en: "Laterite/Black", hi: "लेटराइट/काली" };
          action = { en: "Best for Sugarcane and Rice. Maintain water levels.", hi: "गन्ना और चावल के लिए सर्वश्रेष्ठ। पानी का स्तर बनाए रखें।" };
        }

        const msg = lang === "en"
          ? `## 📍 Location Detected\n\n- **Coordinates**: ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E\n- **Climate**: ${climate.en}\n- **Soil**: ${soil.en}\n- **Action**: ${action.en}\n\n✅ Calculations now optimized for your region.`
          : `## 📍 लोकेशन डिटेक्ट\n\n- **निर्देशांक**: ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E\n- **जलवायु**: ${climate.hi}\n- **मिट्टी**: ${soil.hi}\n- **क्रिया**: ${action.hi}\n\n✅ गणनाएं आपके क्षेत्र के लिए अनुकूलित।`;

        onLocationDetect(msg);
        setLocating(false);
      },
      () => {
        onLocationDetect(lang === "en" ? "📍 Location access denied." : "📍 लोकेशन एक्सेस अस्वीकृत।");
        setLocating(false);
      }
    );
  };

  const buttons = [
    {
      icon: <Mic className="h-5 w-5" />,
      label: lang === "en" ? "Voice" : "वॉइस",
      onClick: handleVoice,
      active: listening,
      color: "primary" as const,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "GPS",
      onClick: handleLocation,
      active: locating,
      color: "secondary" as const,
    },
    {
      icon: <Camera className="h-5 w-5" />,
      label: lang === "en" ? "Scan" : "स्कैन",
      onClick: () => setFasalOpen(true),
      active: false,
      color: "primary" as const,
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: lang === "en" ? "Mandi" : "मंडी",
      onClick: () => setMandiOpen(true),
      active: false,
      color: "secondary" as const,
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "SMS",
      onClick: () => setSmsOpen(true),
      active: false,
      color: "primary" as const,
    },
  ];

  return (
    <>
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
            className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all ${
              btn.active
                ? "bg-destructive/20 text-destructive"
                : btn.color === "primary"
                  ? "text-primary hover:bg-primary/10"
                  : "text-secondary hover:bg-secondary/10"
            }`}
          >
            <span className="relative z-10">{btn.icon}</span>
            <span className="text-[9px] font-heading font-semibold">{btn.label}</span>
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

      <FasalDoctorModal open={fasalOpen} onClose={() => setFasalOpen(false)} onResult={onLocationDetect} lang={lang} />
      <MandiPredictor open={mandiOpen} onClose={() => setMandiOpen(false)} lang={lang} />
      <SMSAlertModal open={smsOpen} onClose={() => setSmsOpen(false)} lang={lang} />
    </>
  );
};

export default FloatingControlPanel;
