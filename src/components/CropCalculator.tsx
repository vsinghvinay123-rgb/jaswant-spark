import { useState } from "react";
import { Droplets, X, Wheat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CROPS } from "@/lib/bharat-knowledge";
import { UI_TEXT, type Lang } from "@/lib/i18n";

interface CropCalculatorProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

const CropCalculator = ({ open, onClose, lang }: CropCalculatorProps) => {
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  const t = UI_TEXT[lang];
  const crop = selectedCrop !== null ? CROPS[selectedCrop] : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg glass-strong rounded-2xl saffron-glow p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wheat className="h-5 w-5 text-saffron" />
                <h2 className="font-heading font-semibold text-lg text-navy">{t.cropCalculator}</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="tiranga-bar rounded-full" />

            <div className="grid grid-cols-2 gap-2">
              {CROPS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCrop(i)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedCrop === i
                      ? "bg-primary text-primary-foreground saffron-glow"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  {lang === "en" ? c.nameEn : c.nameHi}
                </button>
              ))}
            </div>

            {crop && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted rounded-xl p-4 space-y-3"
              >
                <h3 className="font-heading font-semibold text-base flex items-center gap-2 text-navy">
                  <Droplets className="h-4 w-4 text-green-india" />
                  {lang === "en" ? crop.nameEn : crop.nameHi}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.waterNeeded}:</span>
                    <span className="font-medium text-foreground">{lang === "en" ? crop.waterNeeded : crop.waterNeededHi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.irrigations}:</span>
                    <span className="font-medium text-foreground">{lang === "en" ? crop.irrigations : crop.irrigationsHi}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.schedule}:</span>
                    <p className="font-medium mt-1 text-foreground">{lang === "en" ? crop.schedule : crop.scheduleHi}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.bestRegions}:</span>
                    <p className="font-medium mt-1 text-green-india">{lang === "en" ? crop.bestFor : crop.bestForHi}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CropCalculator;
