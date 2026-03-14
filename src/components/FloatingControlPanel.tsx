import { useState, useRef } from "react";
import { Mic, Camera, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FasalDoctorModal from "./FasalDoctorModal";
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
  const recognitionRef = useRef<any>(null);

  // ========== VOICE (Web Speech API) ==========
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
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onVoiceResult(text);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // ========== GEOLOCATION ==========
  const handleLocation = () => {
    if (!navigator.geolocation) {
      onLocationDetect(lang === "en" ? "Geolocation not supported." : "जियोलोकेशन सपोर्ट नहीं है।");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Simple region detection based on lat/long
        let region = "general";
        let regionHi = "सामान्य";
        let crops = "Wheat and Rice";
        let cropsHi = "गेहूं और चावल";

        if (latitude < 28 && longitude > 70 && longitude < 78) {
          region = "dry/semi-arid (Rajasthan region)";
          regionHi = "शुष्क/अर्ध-शुष्क (राजस्थान क्षेत्र)";
          crops = "Bajra and Sarson (Mustard)";
          cropsHi = "बाजरा और सरसों";
        } else if (latitude > 28 && latitude < 32) {
          region = "Indo-Gangetic Plains (Punjab/Haryana)";
          regionHi = "सिंधु-गंगा मैदान (पंजाब/हरियाणा)";
          crops = "Wheat and Rice";
          cropsHi = "गेहूं और चावल";
        } else if (latitude < 20) {
          region = "tropical/coastal";
          regionHi = "उष्णकटिबंधीय/तटीय";
          crops = "Rice and Sugarcane";
          cropsHi = "चावल और गन्ना";
        }

        const msg = lang === "en"
          ? `📍 **Location detected** (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)\n\n**Region**: ${region}\n**Optimized crops**: ${crops}\n\nMy calculations are now tuned for your local soil and climate conditions.`
          : `📍 **लोकेशन डिटेक्ट हुई** (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)\n\n**क्षेत्र**: ${regionHi}\n**अनुकूलित फसलें**: ${cropsHi}\n\nमेरी गणनाएं अब आपकी स्थानीय मिट्टी और जलवायु के लिए ट्यून हैं।`;

        onLocationDetect(msg);
        setLocating(false);
      },
      () => {
        onLocationDetect(lang === "en" ? "📍 Location access denied. Please enable GPS." : "📍 लोकेशन एक्सेस अस्वीकृत। कृपया GPS सक्षम करें।");
        setLocating(false);
      }
    );
  };

  return (
    <>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-strong saffron-glow"
      >
        {/* Voice */}
        <button
          onClick={handleVoice}
          className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            listening
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary/15 text-primary hover:bg-primary/25"
          }`}
        >
          <Mic className="h-5 w-5 relative z-10" />
          <AnimatePresence>
            {listening && (
              <motion.span
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-0 rounded-xl bg-destructive"
              />
            )}
          </AnimatePresence>
        </button>

        {/* Camera / Fasal Doctor */}
        <button
          onClick={() => setFasalOpen(true)}
          className="w-11 h-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center hover:bg-secondary/25 transition-all"
        >
          <Camera className="h-5 w-5" />
        </button>

        {/* GPS */}
        <button
          onClick={handleLocation}
          disabled={locating}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            locating
              ? "bg-accent/30 text-accent-foreground animate-pulse"
              : "bg-accent/15 text-accent hover:bg-accent/25"
          }`}
        >
          <MapPin className="h-5 w-5" />
        </button>
      </motion.div>

      <FasalDoctorModal open={fasalOpen} onClose={() => setFasalOpen(false)} onResult={onLocationDetect} lang={lang} />
    </>
  );
};

export default FloatingControlPanel;
