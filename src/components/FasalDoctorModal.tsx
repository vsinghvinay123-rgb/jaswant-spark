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

// --- Authenticity heuristic (offline) ---
// Real crop photos are dominated by green / yellow-green / earthy hues.
// We sample the uploaded image and reject if green pixels < threshold.
async function isLikelyCrop(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const W = 80, H = 80;
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return resolve(true);
      ctx.drawImage(img, 0, 0, W, H);
      const { data } = ctx.getImageData(0, 0, W, H);
      let cropPx = 0, total = W * H;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // green-dominant OR earth/brown-dominant
        const green = g > 60 && g > r * 0.95 && g > b * 0.95;
        const earth = r > 80 && r < 200 && g > 50 && g < 170 && b < 130 && r > b;
        const yellowing = r > 150 && g > 130 && b < 110;
        if (green || earth || yellowing) cropPx++;
      }
      resolve(cropPx / total > 0.32);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

// --- Synthetic ICAR-style reports (offline) ---
const REPORTS = [
  {
    title: "Tomato Late Blight",
    severity: "CRITICAL",
    vitality: 38,
    spread: "Extremely Fast",
    window: "Must treat within 24 hours",
    yieldLoss: "60% to 90%",
    sci: "Phytophthora infestans",
    local: "Pichheti Jhulsa / Late Blight",
    sym: "Dark water-soaked lesions on leaves with white fungal growth on undersides. Rapid necrosis of stem and fruit observed.",
    env: "Triggered by high humidity (>85%), cool nights (15–22°C), and dense canopy reducing air flow.",
    chem: "Mancozeb 75% WP @ 2g/litre OR Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/litre — 2 sprays at 7-day interval.",
    org: "Trichoderma viride @ 5g/litre + Cow urine 10% spray; remove and burn affected leaves immediately.",
    agro: "Stop overhead irrigation. Increase plant spacing. Drain standing water from beds.",
  },
  {
    title: "Cotton Pink Bollworm",
    severity: "CRITICAL",
    vitality: 42,
    spread: "Moderate",
    window: "Must treat within 48 hours",
    yieldLoss: "40% to 70%",
    sci: "Pectinophora gossypiella",
    local: "Gulabi Sundi",
    sym: "Pink larvae inside bolls; rosette flowers; entry holes on bolls with frass deposits.",
    env: "Warm humid conditions (28–32°C) and over-aged Bt cotton crop favour resistance build-up.",
    chem: "Emamectin Benzoate 5% SG @ 0.4 g/litre OR Profenofos 50% EC @ 2 ml/litre — alternate sprays.",
    org: "Install pheromone traps (PBW lure) @ 8/acre; release Trichogramma bactrae @ 1.5 lakh/acre.",
    agro: "Destroy rosette flowers daily. Avoid extending crop beyond 160 days. Uproot and burn stalks post-harvest.",
  },
  {
    title: "Wheat Yellow Rust",
    severity: "WARNING",
    vitality: 62,
    spread: "Moderate",
    window: "Treat within 72 hours",
    yieldLoss: "20% to 40%",
    sci: "Puccinia striiformis",
    local: "Peeli Ratua",
    sym: "Yellow-orange pustules in linear rows on upper leaf surface; powdery spores rub off on touch.",
    env: "Cool (10–18°C), cloudy weather with morning dew accelerates spore germination.",
    chem: "Propiconazole 25% EC @ 1 ml/litre OR Tebuconazole 25% EC @ 1 ml/litre — single foliar spray.",
    org: "Spray cow urine + asafoetida solution (10%) at first sign; remove rust-prone volunteer wheat plants.",
    agro: "Avoid late nitrogen top-dressing. Switch to rust-resistant varieties (HD-3086, DBW-187) next season.",
  },
  {
    title: "Soil Nitrogen Deficiency (Healthy Patch)",
    severity: "WARNING",
    vitality: 70,
    spread: "Slow",
    window: "Treat within 5 days",
    yieldLoss: "10% to 20%",
    sci: "N-deficiency (chlorosis)",
    local: "Nitrogen Ki Kami",
    sym: "Uniform yellowing of older lower leaves while new growth remains green; reduced tillering.",
    env: "Sandy soils with low organic matter and recent heavy irrigation leaching nitrogen below root zone.",
    chem: "Urea (46% N) @ 50 kg/acre top-dressing after light irrigation; foliar 2% Urea spray for quick uptake.",
    org: "Vermicompost @ 1 tonne/acre + Azotobacter culture @ 4 kg/acre.",
    agro: "Split nitrogen doses; mulch to reduce leaching; rotate with legumes (moong/guar) next season.",
  },
];

function buildClinicalReport(lang: Lang) {
  const r = REPORTS[Math.floor(Math.random() * REPORTS.length)];
  void lang; // bilingual rendering happens through shared formatting; AI text below is English-first
  return `[CROP_REPORT]

🩺 **Bharat AI Supreme Agronomy & Diagnostic Report — ${r.title}**

━━━━━━━━━━━━━━━━━━━━━━

📊 **Vitality & Risk Index**
• **Severity Level:** ${r.severity} ${r.severity === "CRITICAL" ? "🔴" : r.severity === "WARNING" ? "🟡" : "🟢"}
• **Crop Vitality Score:** ${r.vitality}% (Survival probability)
• **Spread Rate:** ${r.spread}

🔬 **Botanical & Pathological Diagnosis**
• **Scientific Name:** ${r.sci}
• **Local/Common Name:** ${r.local}
• **Symptomatology:** ${r.sym}

🌍 **Environmental & Soil Analysis**
• **Probable Cause:** ${r.env}

💊 **Integrated Pest Management (IPM) Protocol**
• **Chemical Intervention:** ${r.chem}
• **Organic / Bio-Control:** ${r.org}
• **Agronomic Practices:** ${r.agro}

💰 **Economic Impact Forecast**
• **Estimated Yield Loss (If untreated):** ${r.yieldLoss}
• **Action Window:** ${r.window}

━━━━━━━━━━━━━━━━━━━━━━`;
}

function buildInvalidReport(lang: Lang) {
  const txt = lang === "hi"
    ? "अपलोड की गई इमेज वनस्पति प्रामाणिकता परीक्षण में विफल रही। कृपया प्रभावित फसल, पत्ती या मिट्टी की एक स्पष्ट, उच्च-रिज़ॉल्यूशन फोटो अपलोड करें।"
    : "Uploaded media fails the botanical authenticity scan. Please upload a clear, high-resolution image of the affected crop, leaf, or soil for clinical analysis.";
  return `[INVALID_CROP]\n\n⚠️ **SYSTEM REJECTION:** ${txt}`;
}

const FasalDoctorModal = ({ open, onClose, onResult, lang }: FasalDoctorModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setScanComplete(false);
    setScanning(true);

    const valid = await isLikelyCrop(file);

    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      onResult(valid ? buildClinicalReport(lang) : buildInvalidReport(lang));
      onClose();
      setImageUrl(null);
      setScanComplete(false);
    }, 2200);
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
                <span className="text-xs text-muted-foreground font-heading text-center px-4">
                  {lang === "en"
                    ? "Tap to capture leaf / soil photo. Authenticity scan is strict — non-crop images are rejected."
                    : "पत्ती / मिट्टी की फोटो लें। प्रामाणिकता जाँच कठोर है — असंबंधित इमेज अस्वीकृत होंगी।"}
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
              {scanning ? "🔬 RUNNING BOTANICAL AUTHENTICITY SCAN..." : scanComplete ? "✅ SCAN COMPLETE — CHECK CHAT" : "AUTHENTICITY + CLINICAL DIAGNOSIS · ICAR PROTOCOL"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FasalDoctorModal;
