import { useState } from "react";
import { X, ScanLine, Leaf, Bug, Droplets, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lang } from "@/lib/i18n";

interface CropScannerModalProps {
  open: boolean;
  onClose: () => void;
  onSymptomSelect: (query: string) => void;
  lang: Lang;
}

const SYMPTOMS = [
  { icon: "🍂", label: { en: "Yellow Leaves", hi: "पीली पत्तियां" }, query: { en: "My plant leaves are turning yellow", hi: "Mere poudhe ki pattiya pili pad rahi hain" } },
  { icon: "🕳️", label: { en: "Holes in Leaves", hi: "पत्तों में छेद" }, query: { en: "My crop leaves have holes, insects eating them", hi: "Meri fasal ke patte kha gaya keeda, holes hain" } },
  { icon: "🥀", label: { en: "Rotting Roots", hi: "जड़ गल रही" }, query: { en: "My plant roots are rotting and decaying", hi: "Mere poudhe ki jad galan ho rahi hai, fungus lag raha hai" } },
  { icon: "🐜", label: { en: "White Insects", hi: "सफेद कीड़े" }, query: { en: "White insects are attacking roots of my crop", hi: "Meri fasal mein safed keeda deemak lag gayi hai" } },
  { icon: "🧊", label: { en: "Frost Damage", hi: "पाला पड़ गया" }, query: { en: "Frost has damaged my crop plants are burning", hi: "Meri fasal par pala pad gaya, poudhe jal gaye" } },
  { icon: "📉", label: { en: "Stunted Growth", hi: "बढ़वार रुकी" }, query: { en: "My plant growth has stopped, new leaves are white", hi: "Mere poudhe ki growth ruk gayi, naye patte safed hain, khaira rog" } },
];

const CropScannerModal = ({ open, onClose, onSymptomSelect, lang }: CropScannerModalProps) => {
  const [phase, setPhase] = useState<"scanning" | "symptoms">("scanning");
  const isHindi = lang === "hi" || lang === "hinglish" || lang === "marwadi";

  const handleOpen = () => {
    setPhase("scanning");
    setTimeout(() => setPhase("symptoms"), 2200);
  };

  const handleSelect = (symptom: typeof SYMPTOMS[0]) => {
    const q = isHindi ? symptom.query.hi : symptom.query.en;
    onSymptomSelect(q);
    onClose();
    setPhase("scanning");
  };

  const handleClose = () => {
    onClose();
    setPhase("scanning");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => { if (open) handleOpen(); }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={handleClose} />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="relative w-full max-w-md glass-strong rounded-2xl neon-border-green overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
                  <ScanLine className="h-4 w-4 text-green-india" />
                </div>
                <h2 className="font-heading font-bold text-lg text-green-india">
                  {isHindi ? "फसल स्कैनर" : "Crop Scanner"} 🔬
                </h2>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5">
              <div className="tiranga-bar rounded-full" />
            </div>

            <div className="p-5 min-h-[280px]">
              <AnimatePresence mode="wait">
                {phase === "scanning" ? (
                  <motion.div
                    key="scan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[250px] gap-4"
                  >
                    {/* Radar animation */}
                    <div className="relative w-32 h-32">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-secondary/30"
                        style={{
                          background: "conic-gradient(from 0deg, transparent 0%, hsl(var(--neon-green) / 0.3) 25%, transparent 30%)"
                        }}
                      />
                      <div className="absolute inset-2 rounded-full border border-secondary/20" />
                      <div className="absolute inset-4 rounded-full border border-secondary/15" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Leaf className="h-8 w-8 text-green-india" />
                      </div>
                      {/* Pulse rings */}
                      <motion.div
                        animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border border-secondary/40"
                      />
                      <motion.div
                        animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                        className="absolute inset-0 rounded-full border border-secondary/40"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-heading font-bold text-green-india tracking-wider animate-pulse">
                        {isHindi ? "🔬 एआई इंजन शुरू हो रहा है..." : "🔬 INITIALIZING AI ENGINE..."}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-heading">
                        {isHindi ? "कृपया प्रतीक्षा करें" : "PLEASE WAIT"}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="symptoms"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-xs text-muted-foreground font-heading text-center">
                      {isHindi ? "लक्षण चुनें — एआई निदान देगा" : "SELECT SYMPTOM — AI WILL DIAGNOSE"}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {SYMPTOMS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => handleSelect(s)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border hover:neon-border-green hover:bg-secondary/5 transition-all text-center"
                        >
                          <span className="text-2xl">{s.icon}</span>
                          <span className="text-[11px] font-heading font-semibold text-foreground leading-tight">
                            {isHindi ? s.label.hi : s.label.en}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-5 pb-4">
              <p className="text-center text-[9px] text-muted-foreground font-heading tracking-wider">
                🇮🇳 POWERED BY BHARAT AI · OFFLINE DIAGNOSIS
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CropScannerModal;
