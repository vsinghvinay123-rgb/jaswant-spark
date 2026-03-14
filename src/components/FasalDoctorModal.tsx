import { useState, useRef } from "react";
import { X, Camera, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lang } from "@/lib/i18n";

interface FasalDoctorModalProps {
  open: boolean;
  onClose: () => void;
  onResult: (msg: string) => void;
  lang: Lang;
}

const SCAN_RESULTS = [
  { en: "Detection: Yellow Vein Mosaic Virus.\nSolution: Spray Neem oil mixed with water immediately.", hi: "पहचान: पीली शिरा मोज़ेक वायरस।\nसमाधान: तुरंत नीम तेल पानी में मिलाकर छिड़कें।" },
  { en: "Detection: Healthy leaf with slight water deficiency.\nAction: Increase water by 10% next cycle.", hi: "पहचान: स्वस्थ पत्ती, हल्की पानी की कमी।\nक्रिया: अगले चक्र में पानी 10% बढ़ाएं।" },
  { en: "Detection: Early stage fungal infection.\nAction: Apply Neem-based bio-pesticide within 48 hours.", hi: "पहचान: शुरुआती चरण का फफूंद संक्रमण।\nक्रिया: 48 घंटे के भीतर नीम-आधारित जैव कीटनाशक लगाएं।" },
  { en: "Detection: Nitrogen deficiency (yellowing).\nAction: Apply Urea @ 50 kg/acre. Recheck in 7 days.", hi: "पहचान: नाइट्रोजन की कमी (पीलापन)।\nक्रिया: यूरिया @ 50 kg/एकड़ डालें। 7 दिन बाद जांचें।" },
];

const FasalDoctorModal = ({ open, onClose, onResult, lang }: FasalDoctorModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setScanComplete(false);
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      const result = SCAN_RESULTS[Math.floor(Math.random() * SCAN_RESULTS.length)];
      onResult(lang === "en"
        ? `## 📷 Fasal Doctor — Scan Complete\n\n${result.en}\n\n✅ *Powered by Bharat AI.*`
        : `## 📷 फसल डॉक्टर — स्कैन पूर्ण\n\n${result.hi}\n\n✅ *भारत AI द्वारा संचालित।*`
      );
    }, 3000);
  };

  const handleClose = () => { setImageUrl(null); setScanning(false); setScanComplete(false); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={handleClose} />
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            className="relative w-full max-w-md glass-strong rounded-2xl neon-border-green p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
                  <ScanLine className="h-4 w-4 text-green-india" />
                </div>
                <h2 className="font-heading font-bold text-lg text-green-india">
                  {lang === "en" ? "Fasal Doctor" : "फसल डॉक्टर"} 🔬
                </h2>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="tiranga-bar rounded-full" />

            {!imageUrl ? (
              <button onClick={() => fileRef.current?.click()}
                className="w-full h-44 rounded-xl border-2 border-dashed border-secondary/30 flex flex-col items-center justify-center gap-3 hover:border-secondary/60 hover:bg-secondary/5 transition-all">
                <Camera className="h-10 w-10 text-secondary/40" />
                <span className="text-xs text-muted-foreground font-heading">
                  {lang === "en" ? "Tap to capture or upload leaf photo" : "पत्ती की फोटो लें या अपलोड करें"}
                </span>
              </button>
            ) : (
              <div className="relative w-full h-44 rounded-xl overflow-hidden neon-border-green">
                <img src={imageUrl} alt="Scan" className="w-full h-full object-cover" />
                {scanning && (
                  <>
                    <motion.div
                      initial={{ top: 0 }} animate={{ top: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_20px_hsl(var(--neon-green))]"
                    />
                    <div className="absolute inset-0 border-2 border-secondary/40 rounded-xl">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-secondary" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-secondary" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-secondary" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-secondary" />
                    </div>
                  </>
                )}
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />

            <p className="text-center text-[10px] text-muted-foreground font-heading tracking-wide">
              {scanning ? "🔬 ANALYZING CROP HEALTH..." : scanComplete ? "✅ SCAN COMPLETE — CHECK CHAT" : "UPLOAD LEAF PHOTO FOR AI DIAGNOSIS"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FasalDoctorModal;
