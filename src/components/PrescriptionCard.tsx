import { memo, useState } from "react";
import { ShieldAlert, ShieldCheck, Cross, CheckSquare, AlertTriangle, FlaskConical, Download, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface PrescriptionCardProps {
  content: string;
}

const CHEMICAL_PATTERNS = [
  "Streptocycline", "Copper Oxychloride", "NPK 19:19:19", "Emamectin Benzoate",
  "Trichoderma", "Bavistin", "Chlorpyrifos", "Zinc Sulphate", "Boron",
  "Pheromone Trap", "Neem Cake", "Neem Oil", "DAP", "Urea",
  "फेरोमोन ट्रैप", "ट्राइकोडर्मा", "बाविस्टिन", "क्लोरपाइरीफॉस", "जिंक सल्फेट",
  "एमामेक्टिन बेंजोएट", "स्ट्रेप्टोसाइक्लिन", "कॉपर ऑक्सीक्लोराइड", "बोरॉन",
];

function getSeverity(content: string): { level: "critical" | "warning" | "safe"; percent: number; label: string } {
  if (/blight|fall armyworm|root rot|jad galan|deemak|termite|armyworm|sundi|zehar|virus|galan|rot|ब्लाइट|दीमक|सुंडी/i.test(content)) {
    return { level: "critical", percent: 90, label: "🔴 CRITICAL" };
  }
  if (/deficiency|boron|zinc|kami|khaira|खैरा|कमी|pila|peela|safed|drooping|jhad/i.test(content)) {
    return { level: "warning", percent: 60, label: "🟡 WARNING" };
  }
  if (/mitra keet|prevention|ladybird|organic|jaivik|bachav|safe|surakshit/i.test(content)) {
    return { level: "safe", percent: 20, label: "🟢 SAFE" };
  }
  return { level: "warning", percent: 50, label: "🟡 WARNING" };
}

function extractChemicals(content: string): string[] {
  const found: string[] = [];
  for (const chem of CHEMICAL_PATTERNS) {
    if (content.toLowerCase().includes(chem.toLowerCase()) && !found.includes(chem)) {
      found.push(chem);
    }
  }
  // Also extract quoted chemicals like 'Something 5% SG'
  const quoted = content.match(/'([^']+(?:\d+%?[^']*))'/g);
  if (quoted) {
    for (const q of quoted) {
      const clean = q.replace(/'/g, "").trim();
      if (clean.length > 2 && !found.some(f => f.toLowerCase() === clean.toLowerCase())) {
        found.push(clean);
      }
    }
  }
  return found;
}

function parsePrescription(content: string) {
  const titleMatch = content.match(/\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1].replace(/[🩺📷]/g, "").trim() : "Fasal Doctor Diagnosis";

  const lines = content.split("\n").filter(l => l.trim());

  let diagnosis = "";
  const treatments: string[] = [];
  let safetyWarning = "";

  for (const line of lines) {
    const stripped = line.replace(/\*\*/g, "").replace(/[🩺📷✅]/g, "").trim();
    if (!stripped) continue;

    if (/detection|diagnosis|पहचान|pehchaan|rog|disease|kami|deficiency/i.test(stripped) && !diagnosis) {
      diagnosis = stripped.replace(/^(detection|diagnosis|पहचान)[:\s]*/i, "").trim();
    } else if (/solution|action|treatment|ilaj|इलाज|spray|dawa|prayog|use|apply|lagao|dalein|dalna|छिड़काव|प्रयोग/i.test(stripped)) {
      treatments.push(stripped.replace(/^(solution|action|treatment|ilaj|इलाज)[:\s]*/i, "").trim());
    } else if (/safety|mask|bachav|suraksha|सुरक्षा|बचाव|wear|pehen/i.test(stripped)) {
      safetyWarning = stripped;
    }
  }

  if (!diagnosis && !treatments.length) {
    const parts = content.replace(/\*\*/g, "").split(/[.।]/);
    if (parts.length >= 1) diagnosis = parts[0].replace(/[🩺📷]/g, "").trim();
    for (let i = 1; i < parts.length; i++) {
      const p = parts[i].trim();
      if (p && !p.startsWith("✅") && !p.startsWith("Powered")) {
        treatments.push(p);
      }
    }
  }

  const severity = getSeverity(content);
  const chemicals = extractChemicals(content);

  return { title, diagnosis, treatments, safetyWarning, severity, chemicals };
}

const PrescriptionCard = memo(({ content }: PrescriptionCardProps) => {
  const { title, diagnosis, treatments, safetyWarning, severity, chemicals } = parsePrescription(content);
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

  const severityColor = severity.level === "critical"
    ? "hsl(var(--destructive))"
    : severity.level === "warning"
      ? "hsl(var(--saffron))"
      : "hsl(var(--green-india))";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl overflow-hidden border border-border bg-card"
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        severity.level === "critical"
          ? "bg-destructive/15 border-b border-destructive/30"
          : severity.level === "warning"
            ? "bg-primary/15 border-b border-primary/30"
            : "bg-secondary/15 border-b border-secondary/30"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            severity.level === "critical" ? "bg-destructive/20" : severity.level === "warning" ? "bg-primary/20" : "bg-secondary/20"
          }`}>
            <Cross className={`h-4 w-4 ${
              severity.level === "critical" ? "text-destructive" : severity.level === "warning" ? "text-saffron" : "text-green-india"
            }`} />
          </div>
          <span className="font-heading font-bold text-sm text-foreground">{title}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold tracking-wider ${
          severity.level === "critical"
            ? "bg-destructive/20 text-destructive"
            : severity.level === "warning"
              ? "bg-primary/20 text-saffron"
              : "bg-secondary/20 text-green-india"
        }`}>
          {severity.label}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Severity Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Threat Level</p>
            <p className="text-[10px] font-heading font-bold" style={{ color: severityColor }}>{severity.percent}%</p>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${severity.percent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${severityColor}88, ${severityColor})` }}
            />
          </div>
        </div>

        {/* Diagnosis */}
        {diagnosis && (
          <div className="space-y-1">
            <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Diagnosis</p>
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-muted/50 neon-border-orange">
              <ShieldAlert className="h-4 w-4 text-saffron flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-foreground leading-snug">{diagnosis}</p>
            </div>
          </div>
        )}

        {/* Active Ingredient Badges */}
        {chemicals.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Active Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {chemicals.map((chem, i) => (
                <Badge key={i} className="bg-navy/20 text-navy border-navy/30 text-[10px] font-heading gap-1 px-2 py-0.5">
                  <FlaskConical className="h-3 w-3" />
                  {chem}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Treatment Checklist */}
        {treatments.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Treatment Plan</p>
            <div className="space-y-1.5">
              {treatments.map((step, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-secondary/5 border border-secondary/15">
                  <CheckSquare className="h-3.5 w-3.5 text-green-india flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Warning */}
        {safetyWarning && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-destructive leading-relaxed font-medium">{safetyWarning}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <p className="text-[9px] text-muted-foreground font-heading tracking-wider">
            🩺 FASAL DOCTOR · BHARAT AI
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-heading transition-all ${
                saved
                  ? "bg-secondary/20 text-green-india"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {saved ? <CheckSquare className="h-3 w-3" /> : <Download className="h-3 w-3" />}
              {saved ? "Saved!" : "Save Report"}
            </button>
            <ShieldCheck className="h-3.5 w-3.5 text-green-india" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

PrescriptionCard.displayName = "PrescriptionCard";
export default PrescriptionCard;

export function isFasalDoctorQuery(userInput: string): boolean {
  return /bimari|keeda|doctor|sundi|fungus|deemak|khaira|termite|rot|galan|pala|frost|armyworm|pattiya pili|pila pad|jad galan|jad sookh|spray safety|dawa chhidak|zehar|बीमारी|कीड़ा|डॉक्टर|सुंडी|फंगस|दीमक|खैरा|blight|npk|boron|mitra keet|ladybird/i.test(userInput);
}
