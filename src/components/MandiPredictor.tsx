import { useState } from "react";
import { X, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lang } from "@/lib/i18n";

interface MandiPredictorProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

interface CropPrice {
  nameEn: string;
  nameHi: string;
  current: number;
  predicted: number;
  change: number;
  advice: { en: string; hi: string };
}

const MANDI_DATA: CropPrice[] = [
  {
    nameEn: "Wheat (Gehun)",
    nameHi: "गेहूं",
    current: 2275,
    predicted: 2380,
    change: 4.6,
    advice: { en: "Hold for 15 days, price expected to rise.", hi: "15 दिन रुकें, कीमत बढ़ने की संभावना।" },
  },
  {
    nameEn: "Mustard (Sarson)",
    nameHi: "सरसों",
    current: 5200,
    predicted: 5408,
    change: 4.0,
    advice: { en: "Hold for 15 days, price expected to rise by 4%.", hi: "15 दिन रुकें, कीमत 4% बढ़ने की संभावना।" },
  },
  {
    nameEn: "Bajra",
    nameHi: "बाजरा",
    current: 2500,
    predicted: 2425,
    change: -3.0,
    advice: { en: "Sell now. Price may drop next month.", hi: "अभी बेचें। अगले महीने कीमत गिर सकती है।" },
  },
  {
    nameEn: "Cotton (Kapaas)",
    nameHi: "कपास",
    current: 6200,
    predicted: 6510,
    change: 5.0,
    advice: { en: "Strong hold. Price trending upward.", hi: "मजबूत होल्ड। कीमत ऊपर जा रही है।" },
  },
  {
    nameEn: "Guar",
    nameHi: "ग्वार",
    current: 5800,
    predicted: 6090,
    change: 5.0,
    advice: { en: "Hold. Industrial demand rising.", hi: "रुकें। औद्योगिक मांग बढ़ रही है।" },
  },
];

const MandiPredictor = ({ open, onClose, lang }: MandiPredictorProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={handleClose} />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="relative w-full max-w-md glass-strong rounded-2xl neon-border-green p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-india" />
                </div>
                <h2 className="font-heading font-bold text-lg text-green-india">
                  {lang === "en" ? "Mandi Bhav Predictor" : "मंडी भाव प्रेडिक्टर"}
                </h2>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="tiranga-bar rounded-full" />

            {/* Crop selection */}
            <div className="grid grid-cols-2 gap-2">
              {MANDI_DATA.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selected === i
                      ? "bg-secondary/20 text-secondary neon-border-green"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  {lang === "en" ? c.nameEn : c.nameHi}
                </button>
              ))}
            </div>

            {/* Price display */}
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Bar chart */}
                <div className="bg-muted rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{lang === "en" ? "Current" : "वर्तमान"}</span>
                    <span>{lang === "en" ? "Predicted (30 days)" : "अनुमान (30 दिन)"}</span>
                  </div>
                  <div className="flex items-end gap-3 h-24">
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-mono text-saffron">₹{MANDI_DATA[selected].current}</span>
                      <div
                        className="w-full rounded-t-lg bg-primary/40 neon-border-orange"
                        style={{ height: `${(MANDI_DATA[selected].current / MANDI_DATA[selected].predicted) * 100}%`, minHeight: 20 }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-mono text-green-india">₹{MANDI_DATA[selected].predicted}</span>
                      <div
                        className="w-full rounded-t-lg bg-secondary/40 neon-border-green"
                        style={{ height: "100%", minHeight: 20 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-muted rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {MANDI_DATA[selected].change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-india" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm font-bold ${MANDI_DATA[selected].change > 0 ? "text-green-india" : "text-destructive"}`}>
                      {MANDI_DATA[selected].change > 0 ? "+" : ""}{MANDI_DATA[selected].change}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "en" ? MANDI_DATA[selected].advice.en : MANDI_DATA[selected].advice.hi}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MandiPredictor;
