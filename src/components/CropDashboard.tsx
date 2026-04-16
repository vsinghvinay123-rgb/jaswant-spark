import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Sprout, Calendar, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lang } from "@/lib/i18n";

export interface CropData {
  crop: string;
  sowingDate: string;
}

interface CropDashboardProps {
  lang: Lang;
  onCropChange?: (data: CropData | null) => void;
}

const CROPS = [
  { value: "wheat", en: "Wheat", hi: "गेहूं" },
  { value: "mustard", en: "Mustard", hi: "सरसों" },
  { value: "bajra", en: "Bajra", hi: "बाजरा" },
  { value: "cotton", en: "Cotton", hi: "कपास" },
  { value: "aloevera", en: "Aloe Vera", hi: "एलोवेरा" },
  { value: "guar", en: "Guar", hi: "ग्वार" },
  { value: "moong", en: "Moong", hi: "मूंग" },
  { value: "chana", en: "Chana", hi: "चना" },
];

const getCropAge = (sowingDate: string): number => {
  if (!sowingDate) return 0;
  const diff = Date.now() - new Date(sowingDate).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const CropDashboard = ({ lang, onCropChange }: CropDashboardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [cropData, setCropData] = useState<CropData | null>(() => {
    const saved = localStorage.getItem("bharat-crop-data");
    if (saved) try { return JSON.parse(saved); } catch { /* */ }
    return null;
  });
  const [selectedCrop, setSelectedCrop] = useState(cropData?.crop || "");
  const [sowingDate, setSowingDate] = useState(cropData?.sowingDate || "");

  useEffect(() => {
    if (cropData) {
      localStorage.setItem("bharat-crop-data", JSON.stringify(cropData));
    }
    onCropChange?.(cropData);
  }, [cropData, onCropChange]);

  const handleSave = () => {
    if (selectedCrop && sowingDate) {
      const data = { crop: selectedCrop, sowingDate };
      setCropData(data);
      setExpanded(false);
    }
  };

  const handleClear = () => {
    setCropData(null);
    setSelectedCrop("");
    setSowingDate("");
    localStorage.removeItem("bharat-crop-data");
  };

  const isHindi = lang === "hi" || lang === "hinglish" || lang === "marwadi";
  const cropAge = cropData ? getCropAge(cropData.sowingDate) : 0;
  const cropLabel = CROPS.find(c => c.value === cropData?.crop);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-2">
      {/* Mini banner when collapsed with data */}
      {cropData && !expanded && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl glass-strong neon-border-green text-xs"
        >
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-green-india" />
            <span className="font-heading font-bold text-green-india">
              {isHindi ? "फसल:" : "Crop:"} {cropLabel ? (isHindi ? cropLabel.hi : cropLabel.en) : cropData.crop}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-heading text-saffron font-semibold">
              {isHindi ? `उम्र: ${cropAge} दिन` : `Age: ${cropAge} Days`}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.button>
      )}

      {/* Collapsed with no data */}
      {!cropData && !expanded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl glass border border-dashed border-secondary/30 text-xs text-muted-foreground hover:border-secondary/60 transition-colors"
        >
          <Leaf className="h-3.5 w-3.5" />
          <span className="font-heading">{isHindi ? "अपनी फसल जोड़ें" : "Add Your Crop"}</span>
        </motion.button>
      )}

      {/* Expanded form */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-strong rounded-2xl neon-border-green p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-green-india" />
                  <h3 className="font-heading font-bold text-sm text-green-india">
                    {isHindi ? "किसान डैशबोर्ड" : "My Farm Dashboard"} 🌾
                  </h3>
                </div>
                <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground">
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>

              <div className="tiranga-bar rounded-full" />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-heading tracking-wider text-muted-foreground uppercase">
                    {isHindi ? "फसल चुनें" : "Select Crop"}
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={e => setSelectedCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground font-heading outline-none"
                  >
                    <option value="">{isHindi ? "-- चुनें --" : "-- Pick --"}</option>
                    {CROPS.map(c => (
                      <option key={c.value} value={c.value}>{isHindi ? c.hi : c.en}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-heading tracking-wider text-muted-foreground uppercase flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {isHindi ? "बुवाई तारीख" : "Sowing Date"}
                  </label>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={e => setSowingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground font-heading outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!selectedCrop || !sowingDate}
                  className="flex-1 py-2 rounded-xl bg-secondary/20 text-secondary text-xs font-heading font-bold hover:bg-secondary/30 transition-colors disabled:opacity-30"
                >
                  {isHindi ? "✅ सेव करें" : "✅ Save"}
                </button>
                {cropData && (
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-heading font-bold hover:bg-destructive/20 transition-colors"
                  >
                    {isHindi ? "हटाएं" : "Clear"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CropDashboard;

// Helper for AI context
export function getCropContext(lang: Lang): string {
  const saved = localStorage.getItem("bharat-crop-data");
  if (!saved) return "";
  try {
    const data: CropData = JSON.parse(saved);
    const age = getCropAge(data.sowingDate);
    const cropLabel = CROPS.find(c => c.value === data.crop);
    const name = cropLabel ? cropLabel.en : data.crop;
    return `[User's active crop: ${name}, Age: ${age} days, Sowed: ${data.sowingDate}]`;
  } catch { return ""; }
}
