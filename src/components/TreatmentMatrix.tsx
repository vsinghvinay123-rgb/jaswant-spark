import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert, Cross, FlaskConical, Leaf, ShieldCheck,
  Droplet, Eye, Sparkles, Download, CheckSquare, AlertTriangle, Cpu,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface TreatmentMatrixProps {
  content: string;
}

// ---------- helpers ----------
const CHEM_KEYWORDS = [
  "Propiconazole", "Imidacloprid", "Streptocycline", "Copper Oxychloride",
  "NPK 19:19:19", "Emamectin Benzoate", "Trichoderma", "Bavistin", "Chlorpyrifos",
  "Zinc Sulphate", "Boron", "DAP", "Urea", "Tilt", "Spinosad", "Amino Acid", "Fulvic Acid",
];
const ORGANIC_KEYWORDS = [
  "neem oil", "neem cake", "neem", "marigold", "genda", "ladybird", "mitra keet",
  "trichoderma", "jaivik", "organic", "pheromone", "sticky trap", "गेंदा", "नीम",
];
const PREVENTION_KEYWORDS = [
  "resistant", "agli baar", "next time", "next season", "crop rotation",
  "uproot", "destroy", "ukhad", "agli", "अगली बार", "रोक", "prevention", "bachav",
];

function getSeverity(content: string): { level: "critical" | "warning" | "safe"; percent: number; label: string } {
  if (/blight|fall armyworm|root rot|jad galan|deemak|termite|armyworm|sundi|virus|galan|rot|rust|ratiya|leaf curl|chemical burn|jal gayi|ब्लाइट|दीमक|सुंडी|रतुआ/i.test(content))
    return { level: "critical", percent: 90, label: "🔴 CRITICAL" };
  if (/deficiency|boron|zinc|kami|khaira|खैरा|कमी|pila|peela|drooping/i.test(content))
    return { level: "warning", percent: 60, label: "🟡 WARNING" };
  if (/mitra keet|prevention|ladybird|organic|jaivik|bachav|safe/i.test(content))
    return { level: "safe", percent: 25, label: "🟢 SAFE" };
  return { level: "warning", percent: 55, label: "🟡 WARNING" };
}

function extractTitle(content: string): string {
  const m = content.match(/\*\*(.+?)\*\*/);
  return m ? m[1].replace(/[🩺📷✅]/g, "").trim() : "Fasal Doctor Diagnosis";
}

function extractDiagnosis(content: string): string {
  const cleaned = content.replace(/\*\*.+?\*\*/, "").replace(/[🩺📷✅]/g, "").trim();
  const firstSentence = cleaned.split(/[.।]/)[0]?.trim();
  return firstSentence || "Issue detected in your crop.";
}

function extractSentences(content: string): string[] {
  return content
    .replace(/\*\*/g, "")
    .replace(/[🩺📷✅🔮🧮🧠]/g, "")
    .split(/(?:\d+\.\s|[.।]\s|\n)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8 && !/^powered|^bharat ai/i.test(s));
}

function classifySentences(sentences: string[]) {
  const chemical: string[] = [];
  const organic: string[] = [];
  const prevention: string[] = [];

  for (const s of sentences) {
    const lower = s.toLowerCase();
    const isOrganic = ORGANIC_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
    const isPrevention = PREVENTION_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
    const isChemical = CHEM_KEYWORDS.some((k) => lower.includes(k.toLowerCase())) ||
      /spray|chhidkaw|छिड़काव|दवा|ec |sl |%|ml|gram|kg/i.test(s);

    if (isPrevention && !isChemical) prevention.push(s);
    else if (isOrganic && !isChemical) organic.push(s);
    else if (isChemical) chemical.push(s);
    else prevention.push(s);
  }
  return { chemical, organic, prevention };
}

// Highlight numeric dosages: 200ml, 5ml, 45 kg, 19:19:19, 25% EC
function highlightDosages(text: string) {
  const regex = /(\d+(?:\.\d+)?\s?(?:ml|ML|g|kg|KG|gram|litre|L|%|%\s?(?:EC|SL|SG|SP|WP))|\d+:\d+:\d+)/g;
  const parts = text.split(regex);
  return parts.map((p, i) =>
    regex.test(p) ? (
      <span
        key={i}
        className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-saffron/25 text-saffron font-mono font-bold text-[11px] border border-saffron/40"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

// ---------- component ----------
type TabKey = "chemical" | "organic" | "prevention";

const TABS: { key: TabKey; label: string; icon: typeof FlaskConical; color: string }[] = [
  { key: "chemical", label: "💊 Chemical", icon: FlaskConical, color: "saffron" },
  { key: "organic", label: "🌿 Organic", icon: Leaf, color: "green-india" },
  { key: "prevention", label: "🛡️ Prevention", icon: ShieldCheck, color: "navy" },
];

const TIMELINE_STEPS = [
  { icon: Droplet, title: "Immediate Action", sub: "First spray (Day 0)" },
  { icon: Eye, title: "Observation", sub: "Wait 3–5 days" },
  { icon: Sparkles, title: "Recovery Boost", sub: "NPK / Micro-nutrient" },
];

const TreatmentMatrix = memo(({ content }: TreatmentMatrixProps) => {
  const title = extractTitle(content);
  const diagnosis = extractDiagnosis(content);
  const severity = getSeverity(content);
  const sentences = extractSentences(content);
  const { chemical, organic, prevention } = classifySentences(sentences);
  const buckets = { chemical, organic, prevention };

  const defaultTab: TabKey = chemical.length ? "chemical" : organic.length ? "organic" : "prevention";
  const [active, setActive] = useState<TabKey>(defaultTab);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    try {
      const reports = JSON.parse(localStorage.getItem("bharat-saved-reports") || "[]");
      reports.unshift({ content, date: new Date().toISOString() });
      localStorage.setItem("bharat-saved-reports", JSON.stringify(reports.slice(0, 20)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* */ }
  };

  const sevColor =
    severity.level === "critical" ? "hsl(var(--destructive))"
      : severity.level === "warning" ? "hsl(var(--saffron))"
        : "hsl(var(--green-india))";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-2xl overflow-hidden border border-border bg-card"
    >
      {/* AI Reasoning Badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy/30 border border-navy/50 text-[8px] font-heading tracking-wider text-navy backdrop-blur-md"
      >
        <Cpu className="h-2.5 w-2.5" />
        VERIFIED · ANI LOGIC
      </motion.div>

      {/* Header */}
      <div className={`px-4 py-3 flex items-center gap-2 ${
        severity.level === "critical" ? "bg-destructive/15 border-b border-destructive/30"
          : severity.level === "warning" ? "bg-primary/15 border-b border-primary/30"
            : "bg-secondary/15 border-b border-secondary/30"
      }`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          severity.level === "critical" ? "bg-destructive/20"
            : severity.level === "warning" ? "bg-primary/20" : "bg-secondary/20"
        }`}>
          <Cross className={`h-4 w-4 ${
            severity.level === "critical" ? "text-destructive"
              : severity.level === "warning" ? "text-saffron" : "text-green-india"
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm text-foreground truncate pr-20">{title}</p>
          <p className="text-[10px] text-muted-foreground">{severity.label}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Severity Meter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Threat Level</p>
            <p className="text-[10px] font-heading font-bold" style={{ color: sevColor }}>{severity.percent}%</p>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${severity.percent}%` }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${sevColor}88, ${sevColor})` }}
            />
          </div>
        </motion.div>

        {/* Diagnosis */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Diagnosis</p>
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-muted/50 neon-border-orange">
            <ShieldAlert className="h-4 w-4 text-saffron flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-foreground leading-snug">{diagnosis}</p>
          </div>
        </motion.div>

        {/* Treatment Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Treatment Matrix</p>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/40 border border-border">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              const count = buckets[tab.key].length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`relative px-2 py-2 rounded-lg text-[10px] font-heading font-bold transition-all ${
                    isActive
                      ? "bg-card text-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-primary/20 text-saffron text-[8px]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5 min-h-[60px]"
            >
              {buckets[active].length === 0 ? (
                <div className="px-3 py-3 rounded-xl bg-muted/30 border border-dashed border-border text-center">
                  <p className="text-[11px] text-muted-foreground italic">
                    No specific {active} steps in this diagnosis.
                  </p>
                </div>
              ) : (
                buckets[active].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2 px-3 py-2 rounded-xl bg-secondary/5 border border-secondary/15"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-green-india flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground leading-relaxed">
                      {highlightDosages(step)}
                    </p>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Recovery Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="space-y-2"
        >
          <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Recovery Timeline</p>
          <div className="relative flex items-start justify-between gap-1 px-1">
            {/* connector line */}
            <div className="absolute top-3.5 left-[14%] right-[14%] h-[2px] bg-gradient-to-r from-saffron/40 via-primary/40 to-green-india/40" />
            {TIMELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 + i * 0.18 }}
                  className="relative flex flex-col items-center gap-1 flex-1 z-[1]"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    i === 0 ? "bg-saffron/20 border-saffron text-saffron"
                      : i === 1 ? "bg-primary/20 border-primary text-saffron"
                        : "bg-secondary/20 border-secondary text-green-india"
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] font-heading font-bold text-foreground text-center leading-tight">
                    Step {i + 1}
                  </p>
                  <p className="text-[8.5px] text-muted-foreground text-center leading-tight max-w-[80px]">
                    {step.title}
                  </p>
                  <p className="text-[8px] text-muted-foreground/70 text-center italic leading-tight">
                    {step.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-[9px] text-muted-foreground font-heading tracking-wider">
            🩺 FASAL DOCTOR · BHARAT AI
          </p>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-heading transition-all ${
              saved ? "bg-secondary/20 text-green-india"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            {saved ? <CheckSquare className="h-3 w-3" /> : <Download className="h-3 w-3" />}
            {saved ? "Saved!" : "Save Report"}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

TreatmentMatrix.displayName = "TreatmentMatrix";
export default TreatmentMatrix;
