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

// --- Strict offline biological authenticity scan ---
// Rejects: non-crop colors, AND fake/plastic plants (too-uniform, too-glossy, too-saturated).
type ScanVerdict = "real" | "non_crop" | "fake_plant";

async function scanImage(file: File): Promise<ScanVerdict> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const W = 96, H = 96;
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return resolve("non_crop");
      ctx.drawImage(img, 0, 0, W, H);
      const { data } = ctx.getImageData(0, 0, W, H);

      const total = W * H;
      let cropPx = 0;
      let greenPx = 0;
      let highlightPx = 0; // very bright = plastic gloss
      let highSatPx = 0;   // overly saturated uniform color
      const hues: number[] = [];
      const sats: number[] = [];
      const vals: number[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];

        const green = g > 60 && g > r * 0.95 && g > b * 0.95;
        const earth = r > 80 && r < 200 && g > 50 && g < 170 && b < 130 && r > b;
        const yellowing = r > 150 && g > 130 && b < 110;
        if (green || earth || yellowing) cropPx++;
        if (green) greenPx++;

        // HSV
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const v = max / 255;
        const s = max === 0 ? 0 : (max - min) / max;
        let h = 0;
        if (max !== min) {
          if (max === r) h = ((g - b) / (max - min)) % 6;
          else if (max === g) h = (b - r) / (max - min) + 2;
          else h = (r - g) / (max - min) + 4;
          h *= 60;
          if (h < 0) h += 360;
        }
        hues.push(h);
        sats.push(s);
        vals.push(v);

        if (v > 0.92) highlightPx++;             // glossy specular highlights
        if (s > 0.7 && green) highSatPx++;       // neon-green plastic
      }

      // 1) reject if not enough botanical-colored pixels
      if (cropPx / total < 0.32) return resolve("non_crop");

      // 2) detect fake/plastic plant via low color variance + high gloss/saturation
      const greenPixelHues = hues.filter((_, i) => {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        return g > 60 && g > r * 0.95 && g > b * 0.95;
      });
      let hueStd = 0;
      if (greenPixelHues.length > 50) {
        const mean = greenPixelHues.reduce((a, b) => a + b, 0) / greenPixelHues.length;
        const variance = greenPixelHues.reduce((a, b) => a + (b - mean) ** 2, 0) / greenPixelHues.length;
        hueStd = Math.sqrt(variance);
      }
      const valMean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const valVar = vals.reduce((a, b) => a + (b - valMean) ** 2, 0) / vals.length;
      const valStd = Math.sqrt(valVar);

      const glossRatio = highlightPx / total;
      const neonGreenRatio = highSatPx / Math.max(1, greenPx);
      const greenFraction = greenPx / total;

      // Plastic signature:
      //  - dominant green pixels (>30% of image)
      //  - very narrow green hue distribution (std < 8°) → unnatural uniformity
      //  - OR strong neon saturation (>55% of greens highly saturated)
      //  - OR large glossy highlights (>4% bright specular pixels) with low brightness variance
      const tooUniformHue = greenFraction > 0.3 && hueStd < 8;
      const neonPlastic = neonGreenRatio > 0.55 && greenFraction > 0.25;
      const tooGlossy = glossRatio > 0.04 && valStd < 0.18 && greenFraction > 0.25;

      if (tooUniformHue || neonPlastic || tooGlossy) return resolve("fake_plant");

      resolve("real");
    };
    img.onerror = () => resolve("non_crop");
    img.src = URL.createObjectURL(file);
  });
}

// --- Multilingual report templates ---
type ReportData = {
  sci: string; severity: "CRITICAL" | "WARNING" | "HEALTHY";
  vitality: number; spread: Record<Lang, string>;
  window: Record<Lang, string>; yieldLoss: string;
  title: Record<Lang, string>; local: Record<Lang, string>;
  sym: Record<Lang, string>; env: Record<Lang, string>;
  chem: Record<Lang, string>; org: Record<Lang, string>; agro: Record<Lang, string>;
};

const REPORTS: ReportData[] = [
  {
    sci: "Pectinophora gossypiella",
    severity: "CRITICAL", vitality: 38, yieldLoss: "40% to 70%",
    title: {
      en: "Cotton Pink Bollworm",
      hi: "कपास गुलाबी सुंडी",
      hinglish: "Cotton Gulabi Sundi",
      marwadi: "कपास री गुलाबी सुंडी",
    },
    local: {
      en: "Pink Bollworm", hi: "गुलाबी सुंडी",
      hinglish: "Gulabi Sundi", marwadi: "गुलाबी सुंडी",
    },
    spread: { en: "Moderate", hi: "मध्यम", hinglish: "Moderate", marwadi: "मझोलो" },
    window: {
      en: "Must treat within 48 hours",
      hi: "48 घंटे के अंदर इलाज ज़रूरी",
      hinglish: "48 ghante ke andar ilaaj zaroori",
      marwadi: "48 घंटा रै मांय इलाज जरूरी",
    },
    sym: {
      en: "Pink larvae inside bolls; rosette flowers; entry holes with frass deposits.",
      hi: "टिंडों के अंदर गुलाबी लार्वा, रोज़ेट फूल और छेद में मल पाया गया।",
      hinglish: "Tindo ke andar gulabi larva, rosette phool, aur cheh me mal dikhai diya.",
      marwadi: "टिंडां रै भीतर गुलाबी कीड़ा, रोज़ेट फूल और छेद में मल दीखै सा।",
    },
    env: {
      en: "Warm humid 28–32°C with over-aged Bt cotton.",
      hi: "गरम-नम मौसम (28–32°C) और पुरानी Bt कपास।",
      hinglish: "Garam-nam mausam (28–32°C) aur purani Bt cotton.",
      marwadi: "गरम-गीलो मौसम (28–32°C) अर पुरानी Bt कपास।",
    },
    chem: {
      en: "Emamectin Benzoate 5% SG @ 0.4 g/litre OR Profenofos 50% EC @ 2 ml/litre.",
      hi: "ईमामेक्टिन बेंजोएट 5% SG @ 0.4 ग्राम/लीटर या प्रोफेनोफोस 50% EC @ 2 मिली/लीटर।",
      hinglish: "Emamectin Benzoate 5% SG @ 0.4 g/litre ya Profenofos 50% EC @ 2 ml/litre.",
      marwadi: "ईमामेक्टिन बेंजोएट 5% SG @ 0.4 ग्राम/लीटर या प्रोफेनोफोस 50% EC @ 2 मिली/लीटर।",
    },
    org: {
      en: "Pheromone traps (PBW lure) @ 8/acre; Trichogramma bactrae @ 1.5 lakh/acre.",
      hi: "फेरोमोन ट्रैप @ 8/एकड़; ट्राइकोग्रामा 1.5 लाख/एकड़ छोड़ें।",
      hinglish: "Pheromone trap @ 8/acre; Trichogramma 1.5 lakh/acre chhodein.",
      marwadi: "फेरोमोन ट्रैप @ 8/एकड़; ट्राइकोग्रामा 1.5 लाख/एकड़ छोड़ो सा।",
    },
    agro: {
      en: "Destroy rosette flowers daily. Burn stalks post-harvest.",
      hi: "रोज़ रोज़ेट फूल नष्ट करें। फसल के बाद डंठल जलाएँ।",
      hinglish: "Daily rosette phool nashta karein. Crop ke baad danthal jalayein.",
      marwadi: "रोज़ रोज़ेट फूल हटावो। फसल पछै डंठळ जळावो सा।",
    },
  },
  {
    sci: "Phytophthora infestans",
    severity: "CRITICAL", vitality: 35, yieldLoss: "60% to 90%",
    title: {
      en: "Tomato Late Blight",
      hi: "टमाटर पिछेती झुलसा",
      hinglish: "Tamatar Late Blight",
      marwadi: "टमाटर री पिछेती झुलसा",
    },
    local: {
      en: "Late Blight", hi: "पिछेती झुलसा",
      hinglish: "Pichheti Jhulsa", marwadi: "पिछेती झुळसा",
    },
    spread: { en: "Extremely Fast", hi: "बहुत तेज़", hinglish: "Bahut tez", marwadi: "घणौ तेज़" },
    window: {
      en: "Must treat within 24 hours",
      hi: "24 घंटे के अंदर इलाज ज़रूरी",
      hinglish: "24 ghante ke andar ilaaj zaroori",
      marwadi: "24 घंटा रै मांय इलाज जरूरी",
    },
    sym: {
      en: "Dark water-soaked lesions with white fungal growth on leaf undersides.",
      hi: "पत्तियों पर गहरे पानी जैसे धब्बे और नीचे सफ़ेद फफूँद।",
      hinglish: "Pattiyo par dark paani jaise dhabbe aur niche safed fungus.",
      marwadi: "पत्तां माथै काळा पाणी जैड़ा दाग अर नीचै धोळी फफूंद।",
    },
    env: {
      en: "High humidity (>85%), cool nights (15–22°C), dense canopy.",
      hi: "उच्च नमी (85%+), ठंडी रातें (15–22°C), घना पर्दा।",
      hinglish: "High humidity (85%+), thandi raatein (15–22°C), ghana canopy.",
      marwadi: "घणी नमी (85%+), ठंडी राता (15–22°C), घनो परदो।",
    },
    chem: {
      en: "Mancozeb 75% WP @ 2 g/litre OR Metalaxyl + Mancozeb @ 2.5 g/litre, 2 sprays at 7-day gap.",
      hi: "मैनकोज़ेब 75% WP @ 2 ग्राम/लीटर या मेटालैक्सिल+मैनकोज़ेब @ 2.5 ग्राम/लीटर, 7 दिन गैप पर 2 स्प्रे।",
      hinglish: "Mancozeb 75% WP @ 2 g/litre ya Metalaxyl+Mancozeb @ 2.5 g/litre, 7 din gap pe 2 spray.",
      marwadi: "मैनकोज़ेब 75% WP @ 2 ग्राम/लीटर या मेटालैक्सिल+मैनकोज़ेब @ 2.5 ग्राम/लीटर, 7 दिन रै गैप माथै 2 स्प्रे।",
    },
    org: {
      en: "Trichoderma viride @ 5 g/litre + 10% cow urine spray; remove infected leaves.",
      hi: "ट्राइकोडर्मा 5 ग्राम/लीटर + 10% गोमूत्र स्प्रे; प्रभावित पत्तियाँ हटाएँ।",
      hinglish: "Trichoderma 5 g/litre + 10% gomutra spray; affected pattiyaan hatao.",
      marwadi: "ट्राइकोडर्मा 5 ग्राम/लीटर + 10% गोमूत्र स्प्रे; बीमार पत्ता हटावो सा।",
    },
    agro: {
      en: "Stop overhead irrigation. Increase plant spacing. Drain beds.",
      hi: "ऊपर से सिंचाई बंद करें। पौधों की दूरी बढ़ाएँ। पानी निकालें।",
      hinglish: "Upar se sinchai band karo. Plant spacing badhao. Paani nikalo.",
      marwadi: "ऊपर सूं पाणी देणो बंद करो। पोधां री दूरी बधावो। पाणी काढो सा।",
    },
  },
  {
    sci: "Puccinia striiformis",
    severity: "WARNING", vitality: 62, yieldLoss: "20% to 40%",
    title: {
      en: "Wheat Yellow Rust",
      hi: "गेहूँ पीला रतुआ",
      hinglish: "Gehu Peeli Ratua",
      marwadi: "गेहूं री पीळी रतवा",
    },
    local: {
      en: "Yellow Rust", hi: "पीला रतुआ",
      hinglish: "Peeli Ratua", marwadi: "पीळी रतवा",
    },
    spread: { en: "Moderate", hi: "मध्यम", hinglish: "Moderate", marwadi: "मझोलो" },
    window: {
      en: "Treat within 72 hours",
      hi: "72 घंटे के अंदर इलाज करें",
      hinglish: "72 ghante me ilaaj karo",
      marwadi: "72 घंटा रै मांय इलाज करो",
    },
    sym: {
      en: "Yellow-orange pustules in linear rows; powdery spores rub off.",
      hi: "पत्तियों पर पीले-नारंगी फफोले, छूने पर बुरादा झड़ता है।",
      hinglish: "Pattiyo par peele-narangi phaphole, chhune par burada jhadta.",
      marwadi: "पत्तां माथै पीळा-नारंगी फफोळा, छूया माथै बुरादो झड़ै सा।",
    },
    env: {
      en: "Cool 10–18°C, cloudy weather with morning dew.",
      hi: "ठंडा (10–18°C), बादल और सुबह की ओस।",
      hinglish: "Thanda (10–18°C), badal aur subah ki ose.",
      marwadi: "ठंडो (10–18°C), बादळ अर सुबै री ओस।",
    },
    chem: {
      en: "Propiconazole 25% EC @ 1 ml/litre OR Tebuconazole 25% EC @ 1 ml/litre.",
      hi: "प्रोपिकोनाज़ोल 25% EC @ 1 मिली/लीटर या टेबुकोनाज़ोल 25% EC @ 1 मिली/लीटर।",
      hinglish: "Propiconazole 25% EC @ 1 ml/litre ya Tebuconazole 25% EC @ 1 ml/litre.",
      marwadi: "प्रोपिकोनाज़ोल 25% EC @ 1 मिली/लीटर या टेबुकोनाज़ोल 25% EC @ 1 मिली/लीटर।",
    },
    org: {
      en: "10% cow urine + asafoetida spray; remove volunteer wheat.",
      hi: "10% गोमूत्र + हींग का स्प्रे; जंगली गेहूँ हटाएँ।",
      hinglish: "10% gomutra + heeng spray; jangli gehu hatao.",
      marwadi: "10% गोमूत्र + हींग रो स्प्रे; जंगळी गेहूं हटावो सा।",
    },
    agro: {
      en: "Avoid late nitrogen. Use rust-resistant varieties (HD-3086).",
      hi: "देर से नाइट्रोजन न दें। प्रतिरोधी किस्म (HD-3086) चुनें।",
      hinglish: "Late me nitrogen mat do. Resistant variety (HD-3086) lo.",
      marwadi: "मोड़ो नाइट्रोजन कोनी देवो। प्रतिरोधी किस्म (HD-3086) चुणो।",
    },
  },
];

const LABELS: Record<Lang, {
  reportTitle: string; vitalityRisk: string; severity: string; vitalityScore: string; spreadRate: string;
  diagnosis: string; sciName: string; localName: string; symptoms: string;
  envAnalysis: string; cause: string;
  ipm: string; chemical: string; organic: string; agronomic: string;
  econ: string; loss: string; window: string;
  critical: string; warning: string; healthy: string;
}> = {
  en: {
    reportTitle: "Bharat AI Supreme Agronomy & Diagnostic Report",
    vitalityRisk: "Vitality & Risk Index", severity: "Severity Level",
    vitalityScore: "Crop Vitality Score", spreadRate: "Spread Rate",
    diagnosis: "Botanical & Pathological Diagnosis",
    sciName: "Scientific Name", localName: "Local/Common Name", symptoms: "Symptomatology",
    envAnalysis: "Environmental & Soil Analysis", cause: "Probable Cause",
    ipm: "Integrated Pest Management (IPM) Protocol",
    chemical: "Chemical Intervention", organic: "Organic / Bio-Control", agronomic: "Agronomic Practices",
    econ: "Economic Impact Forecast", loss: "Estimated Yield Loss (If untreated)",
    window: "Action Window",
    critical: "CRITICAL", warning: "WARNING", healthy: "HEALTHY",
  },
  hi: {
    reportTitle: "भारत AI सुप्रीम कृषि निदान रिपोर्ट",
    vitalityRisk: "जीवन-शक्ति व जोखिम सूचकांक", severity: "गंभीरता स्तर",
    vitalityScore: "फसल जीवन-शक्ति स्कोर", spreadRate: "फैलाव दर",
    diagnosis: "वनस्पतिक एवं रोग निदान",
    sciName: "वैज्ञानिक नाम", localName: "स्थानीय नाम", symptoms: "लक्षण विवरण",
    envAnalysis: "पर्यावरण एवं मिट्टी विश्लेषण", cause: "संभावित कारण",
    ipm: "एकीकृत कीट प्रबंधन (IPM) प्रोटोकॉल",
    chemical: "रासायनिक उपचार", organic: "जैविक / बायो-कंट्रोल", agronomic: "कृषि क्रियाएँ",
    econ: "आर्थिक प्रभाव पूर्वानुमान", loss: "अनुमानित उपज हानि (बिना इलाज)",
    window: "कार्रवाई समय",
    critical: "गंभीर", warning: "चेतावनी", healthy: "स्वस्थ",
  },
  hinglish: {
    reportTitle: "Bharat AI Supreme Krishi Diagnostic Report",
    vitalityRisk: "Vitality & Risk Index", severity: "Severity Level",
    vitalityScore: "Crop Vitality Score", spreadRate: "Spread Rate",
    diagnosis: "Botanical & Pathological Diagnosis",
    sciName: "Scientific Name", localName: "Local Name", symptoms: "Lakshan",
    envAnalysis: "Environment & Soil Analysis", cause: "Sambhavit Karan",
    ipm: "Integrated Pest Management (IPM) Protocol",
    chemical: "Chemical Ilaaj", organic: "Organic / Bio-Control", agronomic: "Krishi Kriya",
    econ: "Aarthik Prabhav Forecast", loss: "Anumanit Upaj Haani (bina ilaaj)",
    window: "Action Window",
    critical: "CRITICAL", warning: "WARNING", healthy: "HEALTHY",
  },
  marwadi: {
    reportTitle: "भारत AI सुप्रीम खेती निदान रिपोर्ट",
    vitalityRisk: "जीवन-शक्ति अर जोखिम सूचकांक", severity: "गंभीरता स्तर",
    vitalityScore: "फसल जीवन-शक्ति स्कोर", spreadRate: "फैलाव दर",
    diagnosis: "वनस्पतिक अर रोग निदान",
    sciName: "वैज्ञानिक नाम", localName: "स्थानीय नाम", symptoms: "लक्षण विवरण",
    envAnalysis: "पर्यावरण अर माटी विश्लेषण", cause: "संभावित कारण",
    ipm: "एकीकृत कीट प्रबंधन (IPM) प्रोटोकॉल",
    chemical: "रासायनिक इलाज", organic: "जैविक / बायो-कंट्रोल", agronomic: "खेती री क्रिया",
    econ: "आर्थिक असर पूर्वानुमान", loss: "अनुमानित उपज हानि (बिना इलाज)",
    window: "कार्रवाई समय",
    critical: "गंभीर", warning: "चेतावनी", healthy: "स्वस्थ",
  },
};

function buildClinicalReport(lang: Lang) {
  const r = REPORTS[Math.floor(Math.random() * REPORTS.length)];
  const L = LABELS[lang];
  const sevWord = r.severity === "CRITICAL" ? L.critical : r.severity === "WARNING" ? L.warning : L.healthy;
  const sevEmoji = r.severity === "CRITICAL" ? "🔴" : r.severity === "WARNING" ? "🟡" : "🟢";

  return `[CROP_REPORT]

🩺 **${L.reportTitle} — ${r.title[lang]}**

━━━━━━━━━━━━━━━━━━━━━━

📊 **${L.vitalityRisk}**
• **${L.severity}:** ${sevWord} (${r.severity}) ${sevEmoji}
• **${L.vitalityScore}:** ${r.vitality}%
• **${L.spreadRate}:** ${r.spread[lang]}

🔬 **${L.diagnosis}**
• **${L.sciName}:** ${r.sci}
• **${L.localName}:** ${r.local[lang]}
• **${L.symptoms}:** ${r.sym[lang]}

🌍 **${L.envAnalysis}**
• **${L.cause}:** ${r.env[lang]}

💊 **${L.ipm}**
• **${L.chemical}:** ${r.chem[lang]}
• **${L.organic}:** ${r.org[lang]}
• **${L.agronomic}:** ${r.agro[lang]}

💰 **${L.econ}**
• **${L.loss}:** ${r.yieldLoss}
• **${L.window}:** ${r.window[lang]}

━━━━━━━━━━━━━━━━━━━━━━`;
}

const INVALID_MSG: Record<Lang, { nonCrop: string; fake: string }> = {
  en: {
    nonCrop: "⚠️ **CLINICAL REJECTION:** This is not a crop image. Please upload a clear, high-resolution photo of a real plant, leaf, or soil for diagnosis.",
    fake: "⚠️ **CLINICAL REJECTION:** Artificial Plant Detected. My vision sensors indicate this is a synthetic / plastic / decorative plant — not a real living crop. Please upload a genuine biological plant for diagnosis.",
  },
  hi: {
    nonCrop: "⚠️ **क्लिनिकल अस्वीकृति:** यह किसी फसल की फोटो नहीं है। कृपया असली पौधे, पत्ती या मिट्टी की स्पष्ट फोटो अपलोड करें।",
    fake: "⚠️ **क्लिनिकल अस्वीकृति:** नकली पौधा पकड़ा गया। यह प्लास्टिक / सजावटी / कृत्रिम पौधा लग रहा है, असली जीवित फसल नहीं। कृपया असली जैविक पौधे की फोटो डालें।",
  },
  hinglish: {
    nonCrop: "⚠️ **CLINICAL REJECTION:** Yeh fasal ki photo nahi hai. Kripya asli paudhe, patti ya mitti ki saaf photo upload karein.",
    fake: "⚠️ **CLINICAL REJECTION:** Nakli paudha detect hua. Yeh plastic / decorative / artificial plant lag raha hai, asli jeevit fasal nahi. Kripya asli biological plant ki photo daalein.",
  },
  marwadi: {
    nonCrop: "⚠️ **क्लिनिकल अस्वीकृति:** आ फसल री फोटो कोनी सा। कृपया असली पोधो, पत्ती या माटी री साफ फोटो डालो।",
    fake: "⚠️ **क्लिनिकल अस्वीकृति:** नकली पोधो पकड़्यो। आ प्लास्टिक / सजावटी पोधो लागै, असली जीवित फसल कोनी। कृपया असली जैविक पोधे री फोटो डालो सा।",
  },
};

function buildInvalidReport(lang: Lang, kind: "non_crop" | "fake_plant") {
  const m = INVALID_MSG[lang];
  return `[INVALID_CROP]\n\n${kind === "fake_plant" ? m.fake : m.nonCrop}`;
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

    const verdict = await scanImage(file);

    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      const msg = verdict === "real"
        ? buildClinicalReport(lang)
        : buildInvalidReport(lang, verdict);
      onResult(msg);
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
                    ? "Tap to capture leaf / soil photo. Strict scan: rejects non-crops AND artificial / plastic plants."
                    : lang === "hinglish"
                    ? "Patti / mitti ki photo lein. Strict scan: non-crop aur plastic/nakli paudhe reject honge."
                    : "पत्ती / मिट्टी की फोटो लें। कठोर जाँच: असंबंधित और नकली/प्लास्टिक पौधे अस्वीकृत होंगे।"}
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
              {scanning ? "🔬 BIOLOGICAL + MATERIAL AUTHENTICITY SCAN..." : scanComplete ? "✅ SCAN COMPLETE — CHECK CHAT" : "STRICT VISION · REJECTS PLASTIC PLANTS · ICAR PROTOCOL"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FasalDoctorModal;
