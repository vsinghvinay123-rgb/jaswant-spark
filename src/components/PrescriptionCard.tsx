import { memo } from "react";
import { ShieldAlert, ShieldCheck, Cross, CheckSquare, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface PrescriptionCardProps {
  content: string;
}

function parsePrescription(content: string) {
  // Remove bot prefix emoji/markdown artifacts
  const clean = content.replace(/^.*?\*\*/, "**");
  
  // Extract severity from keywords
  const isHighAlert = /deemak|termite|armyworm|sundi|virus|galan|rot|frost|pala|zehar|pesticide|बीमारी|दीमक|सुंडी|फंगस/i.test(content);
  const severity = isHighAlert ? "high" : "warning";
  
  // Extract title (first bold text)
  const titleMatch = content.match(/\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1].replace(/[🩺📷]/g, "").trim() : "Fasal Doctor Diagnosis";
  
  // Extract diagnosis - text after first bold section, before treatment
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
  
  // If no structured parse worked, use a simple split approach
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
  
  return { title, diagnosis, treatments, safetyWarning, severity };
}

const PrescriptionCard = memo(({ content }: PrescriptionCardProps) => {
  const { title, diagnosis, treatments, safetyWarning, severity } = parsePrescription(content);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl overflow-hidden border border-border bg-card"
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        severity === "high" 
          ? "bg-destructive/15 border-b border-destructive/30" 
          : "bg-primary/15 border-b border-primary/30"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            severity === "high" ? "bg-destructive/20" : "bg-primary/20"
          }`}>
            <Cross className={`h-4 w-4 ${severity === "high" ? "text-destructive" : "text-primary"}`} />
          </div>
          <span className="font-heading font-bold text-sm text-foreground">{title}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold tracking-wider ${
          severity === "high"
            ? "bg-destructive/20 text-destructive"
            : "bg-primary/20 text-saffron"
        }`}>
          {severity === "high" ? "🔴 HIGH ALERT" : "🟡 WARNING"}
        </span>
      </div>

      <div className="p-4 space-y-3">
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
          <ShieldCheck className="h-3.5 w-3.5 text-green-india" />
        </div>
      </div>
    </motion.div>
  );
});

PrescriptionCard.displayName = "PrescriptionCard";
export default PrescriptionCard;

// Utility to check if a user message triggers prescription card rendering
export function isFasalDoctorQuery(userInput: string): boolean {
  return /bimari|keeda|doctor|sundi|fungus|deemak|khaira|termite|rot|galan|pala|frost|armyworm|pattiya pili|pila pad|jad galan|jad sookh|spray safety|dawa chhidak|zehar|बीमारी|कीड़ा|डॉक्टर|सुंडी|फंगस|दीमक|खैरा/i.test(userInput);
}
