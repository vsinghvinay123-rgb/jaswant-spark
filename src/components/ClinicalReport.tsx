import { memo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Download, FileText, FlaskConical, Leaf, Microscope, Globe2, IndianRupee, Activity, CheckSquare } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ClinicalReportProps {
  content: string;
}

// ---------- parsing ----------
type ReportSection = { title: string; icon: any; bullets: string[]; color: string };

function parseReport(raw: string) {
  // Strip the [CROP_REPORT] tag and any <THINKING>…</THINKING> reasoning block
  const body = raw
    .replace(/<THINKING>[\s\S]*?<\/THINKING>/gi, "")
    .replace(/\[CROP_REPORT\]/g, "")
    .trim();

  // Severity
  let severity: "critical" | "warning" | "healthy" = "warning";
  let sevLabel = "WARNING";
  if (/CRITICAL/i.test(body)) { severity = "critical"; sevLabel = "CRITICAL"; }
  else if (/HEALTHY/i.test(body)) { severity = "healthy"; sevLabel = "HEALTHY"; }

  const vitalityMatch = body.match(/Vitality(?:\s*Score)?[:\s]*\**\s*(\d+)\s*%/i);
  const vitality = vitalityMatch ? parseInt(vitalityMatch[1], 10) : (severity === "critical" ? 35 : severity === "warning" ? 65 : 92);

  const yieldMatch = body.match(/Yield Loss[^:]*:\s*\**\s*([0-9]+%?\s*(?:to|–|-)\s*[0-9]+%?)/i);
  const actionMatch = body.match(/Action Window[^:]*:\s*\**\s*([^\n•]+)/i);
  const spreadMatch = body.match(/Spread Rate[^:]*:\s*\**\s*([^\n•]+)/i);

  // Section-based parser. Look for emoji-prefixed headings.
  const sectionDefs = [
    { key: "diagnosis", title: "Botanical & Pathological Diagnosis", icon: Microscope, color: "saffron",
      regex: /🔬[^\n]*\n([\s\S]*?)(?=\n\s*[🌍💊💰📊🩺]|\n━|$)/ },
    { key: "environment", title: "Environmental & Soil Analysis", icon: Globe2, color: "green-india",
      regex: /🌍[^\n]*\n([\s\S]*?)(?=\n\s*[💊💰📊🔬🩺]|\n━|$)/ },
    { key: "ipm", title: "Integrated Pest Management Protocol", icon: FlaskConical, color: "saffron",
      regex: /💊[^\n]*\n([\s\S]*?)(?=\n\s*[💰📊🌍🔬🩺]|\n━|$)/ },
    { key: "economic", title: "Economic Impact Forecast", icon: IndianRupee, color: "green-india",
      regex: /💰[^\n]*\n([\s\S]*?)(?=\n\s*[💊📊🌍🔬🩺]|\n━|$)/ },
  ];

  const sections: ReportSection[] = [];
  for (const def of sectionDefs) {
    const m = body.match(def.regex);
    if (m && m[1]) {
      const bullets = m[1]
        .split(/\n+/)
        .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
        .filter((l) => l.length > 3 && !/^━+$/.test(l));
      if (bullets.length) sections.push({ title: def.title, icon: def.icon, bullets, color: def.color });
    }
  }

  // Title
  const titleMatch = body.match(/\*\*Bharat AI[^*]+\*\*/);
  const title = titleMatch ? titleMatch[0].replace(/\*/g, "") : "Bharat AI Clinical Fasal Report";

  return { severity, sevLabel, vitality, yieldLoss: yieldMatch?.[1], actionWindow: actionMatch?.[1], spread: spreadMatch?.[1], sections, title };
}

// ---------- PDF (html2canvas → jsPDF, Unicode-safe) ----------
async function downloadPdfFromElement(el: HTMLElement) {
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#0b0f17",
    // @ts-ignore — letterRendering is a valid html2canvas option
    letterRendering: true,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgW = pageW - margin * 2;
  const imgH = (canvas.height * imgW) / canvas.width;

  let heightLeft = imgH;
  let position = margin;

  pdf.addImage(imgData, "JPEG", margin, position, imgW, imgH);
  heightLeft -= pageH - margin * 2;

  while (heightLeft > 0) {
    position = margin - (imgH - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", margin, position, imgW, imgH);
    heightLeft -= pageH - margin * 2;
  }

  pdf.save(`Fasal_Doctor_Report_${Date.now()}.pdf`);
}

// ---------- detection helpers ----------
export function isInvalidCropResponse(content: string) {
  return /\[INVALID_CROP\]/.test(content);
}
export function isCropReportResponse(content: string) {
  return /\[CROP_REPORT\]/.test(content);
}

function extractThinking(raw: string): string | null {
  const m = raw.match(/<THINKING>([\s\S]*?)<\/THINKING>/i);
  return m ? m[1].trim() : null;
}

// ---------- Collapsible AI reasoning ----------
const ThinkingPanel = ({ thinking }: { thinking: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-heading tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-india animate-pulse" />
          AI Analysis · Chain of Thought
        </span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <pre className="px-3 pb-3 text-[10px] text-foreground/80 font-mono whitespace-pre-wrap leading-relaxed">
          {thinking}
        </pre>
      )}
    </div>
  );
};

// ---------- INVALID card ----------
export const InvalidCropCard = memo(({ content }: { content: string }) => {
  const thinking = extractThinking(content);
  const text = content
    .replace(/<THINKING>[\s\S]*?<\/THINKING>/gi, "")
    .replace(/\[INVALID_CROP\]/g, "")
    .replace(/\*\*/g, "")
    .replace(/⚠️/g, "")
    .trim();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl overflow-hidden border-2 border-saffron/50 bg-gradient-to-br from-saffron/15 to-destructive/10"
    >
      <div className="px-4 py-3 flex items-center gap-2 border-b border-saffron/30 bg-saffron/10">
        <AlertTriangle className="h-5 w-5 text-saffron" />
        <p className="font-heading font-bold text-sm text-saffron tracking-wide">
          CLINICAL REJECTION · AUTHENTICITY FAILED
        </p>
      </div>
      <div className="p-4 space-y-3">
        {thinking && <ThinkingPanel thinking={thinking} />}
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
        <div className="px-3 py-2 rounded-lg bg-muted/40 border border-border">
          <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase mb-1">
            ✅ Required input
          </p>
          <p className="text-xs text-foreground">
            Clear daylight photo · Single leaf, fruit, or soil patch · Crop fills frame
          </p>
        </div>
      </div>
    </motion.div>
  );
});
InvalidCropCard.displayName = "InvalidCropCard";

// ---------- CLINICAL report card ----------
export const ClinicalReport = memo(({ content }: ClinicalReportProps) => {
  const parsed = parseReport(content);
  const [downloaded, setDownloaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const sevColor =
    parsed.severity === "critical" ? "hsl(var(--destructive))"
      : parsed.severity === "warning" ? "hsl(var(--saffron))"
        : "hsl(var(--green-india))";

  const handleDownload = async () => {
    if (!reportRef.current || busy) return;
    setBusy(true);
    try {
      await downloadPdfFromElement(reportRef.current);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      ref={reportRef}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl overflow-hidden border border-border bg-card"
    >
      {/* Tiranga header bar */}
      <div className="h-1 bg-gradient-to-r from-saffron via-foreground to-green-india" />

      <div className="px-4 py-3 flex items-center gap-2 bg-muted/40 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-green-india/15 flex items-center justify-center">
          <FileText className="h-4 w-4 text-green-india" />
        </div>
        <div className="flex-1">
          <p className="font-heading font-bold text-sm text-foreground leading-tight">{parsed.title}</p>
          <p className="text-[9px] text-muted-foreground tracking-widest uppercase">Supreme Agronomy · ICAR Protocol</p>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-heading font-bold"
          style={{ background: `${sevColor}22`, color: sevColor, border: `1px solid ${sevColor}55` }}
        >
          {parsed.sevLabel}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Vitality + Risk index */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3 bg-muted/30 border border-border space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Vitality</p>
              <Activity className="h-3 w-3" style={{ color: sevColor }} />
            </div>
            <p className="text-xl font-heading font-bold" style={{ color: sevColor }}>{parsed.vitality}%</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${parsed.vitality}%` }}
                transition={{ duration: 1 }}
                className="h-full"
                style={{ background: sevColor }}
              />
            </div>
          </div>
          <div className="rounded-xl p-3 bg-muted/30 border border-border space-y-1">
            <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Risk Forecast</p>
            <p className="text-[11px] text-foreground leading-snug">
              <span className="text-muted-foreground">Spread:</span>{" "}
              <span className="font-semibold">{parsed.spread || "Moderate"}</span>
            </p>
            <p className="text-[11px] text-foreground leading-snug">
              <span className="text-muted-foreground">Window:</span>{" "}
              <span className="font-semibold">{parsed.actionWindow || "48–72 hrs"}</span>
            </p>
            {parsed.yieldLoss && (
              <p className="text-[11px] text-destructive leading-snug">
                <span className="text-muted-foreground">Loss:</span>{" "}
                <span className="font-semibold">{parsed.yieldLoss}</span>
              </p>
            )}
          </div>
        </div>

        {/* Sections */}
        {parsed.sections.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="space-y-1.5"
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-saffron" />
                <p className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">
                  {sec.title}
                </p>
              </div>
              <div className="space-y-1 pl-1">
                {sec.bullets.map((b, j) => (
                  <div key={j} className="flex items-start gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/60">
                    <CheckSquare className="h-3 w-3 text-green-india flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground leading-relaxed">
                      {b.replace(/\*\*/g, "")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Footer / PDF download */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <p className="text-[9px] text-muted-foreground font-heading tracking-wider flex items-center gap-1">
            <Leaf className="h-3 w-3 text-green-india" />
            VERIFIED · BHARAT AI LAB
          </p>
          <button
            onClick={handleDownload}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-heading font-bold transition-all ${
              downloaded
                ? "bg-green-india/20 text-green-india border border-green-india/40"
                : "bg-saffron/15 text-saffron border border-saffron/40 hover:bg-saffron/25"
            }`}
          >
            <Download className="h-3 w-3" />
            {busy ? "Generating…" : downloaded ? "Downloaded ✓" : "Download Full Report (PDF)"}
          </button>
        </div>
      </div>
    </motion.div>
  );
});
ClinicalReport.displayName = "ClinicalReport";
