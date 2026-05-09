import { memo, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Download, FileText, FlaskConical, Leaf, Microscope, Globe2, IndianRupee, Activity, Stethoscope, ShieldCheck } from "lucide-react";
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
    backgroundColor: "#ffffff",
    // @ts-ignore — letterRendering is a valid html2canvas option
    letterRendering: true,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 8;
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

  pdf.save(`Bharat_AI_Lab_Report_${Date.now()}.pdf`);
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

// ---------- helpers to split treatments into chemical / organic ----------
function splitIpm(bullets: string[]) {
  const chem: string[] = [];
  const organic: string[] = [];
  for (const b of bullets) {
    if (/neem|trichoderma|jaivik|organic|गोमूत्र|नीम|जैविक|cow|panchgavya|compost|वर्मी|vermi|ladybird|मित्र|pheromone|फेरोमोन/i.test(b)) {
      organic.push(b);
    } else if (/spray|छिड़काव|दव|chem|%|g\/L|ml\/L|ग्राम|मिली|fungicide|insecticide|कीटनाशक|कवकनाशी|streptocycline|copper|mancozeb|propiconazole|imidacloprid|emamectin|chlorpyrifos|thiamethoxam|tricyclazole|diafenthiuron|bavistin|carbendazim|dimethoate/i.test(b)) {
      chem.push(b);
    } else {
      chem.push(b);
    }
  }
  return { chem, organic };
}

const formatDate = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ---------- CLINICAL report card (Medical Lab Letterhead) ----------
export const ClinicalReport = memo(({ content }: ClinicalReportProps) => {
  const parsed = parseReport(content);
  const [downloaded, setDownloaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const reportId = useMemo(() => `BA-${Math.floor(100000 + Math.random() * 900000)}`, [content]);
  const dateStr = useMemo(() => formatDate(), [content]);

  const sevTone =
    parsed.severity === "critical"
      ? { text: "text-red-700", bg: "bg-red-50", border: "border-red-300", chip: "bg-red-600 text-white" }
      : parsed.severity === "warning"
        ? { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", chip: "bg-amber-500 text-white" }
        : { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", chip: "bg-emerald-600 text-white" };

  const ipmSection = parsed.sections.find((s) => /Pest Management/i.test(s.title));
  const diagSection = parsed.sections.find((s) => /Diagnosis/i.test(s.title));
  const envSection = parsed.sections.find((s) => /Environmental/i.test(s.title));
  const ecoSection = parsed.sections.find((s) => /Economic/i.test(s.title));
  const { chem, organic } = ipmSection ? splitIpm(ipmSection.bullets) : { chem: [], organic: [] };

  const diseaseName = parsed.title.replace(/^Bharat AI[^—\-:]*[—\-:]\s*/i, "").trim() || "Crop Pathology";

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

  const thinking = extractThinking(content);

  return (
    <div className="space-y-2">
      {thinking && (
        <div className="rounded-xl border border-border bg-card">
          <ThinkingPanel thinking={thinking} />
        </div>
      )}

      {/* The PDF capture container — pure light medical letterhead */}
      <motion.div
        id="pdf-report-container"
        ref={reportRef}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl overflow-hidden border border-gray-300 bg-white text-gray-900 shadow-xl"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {/* ============ 1. LETTERHEAD ============ */}
        <div className="bg-green-50 border-b-2 border-gray-800 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-base sm:text-xl font-extrabold tracking-wide text-gray-900 text-center">
              BHARAT AI AGRONOMY LAB &amp; CLINIC
            </h1>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-gray-600 italic">
            ICAR-aligned Plant Pathology &amp; Crop Health Diagnostics
          </p>
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-between gap-1 text-[11px] sm:text-xs text-gray-700">
            <span><b>Date:</b> {dateStr}</span>
            <span><b>Report ID:</b> #{reportId}</span>
          </div>
        </div>

        {/* ============ 2. PATIENT & DIAGNOSIS ============ */}
        <div className="bg-white px-4 sm:px-6 py-4 space-y-4">
          <div>
            <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-1">Patient (Specimen)</p>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">{diseaseName}</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-lg p-2.5 border ${sevTone.border} ${sevTone.bg}`}>
              <p className="text-[9px] uppercase tracking-widest text-gray-600">Severity</p>
              <p className={`text-sm font-extrabold ${sevTone.text}`}>{parsed.sevLabel}</p>
            </div>
            <div className="rounded-lg p-2.5 border border-emerald-200 bg-emerald-50">
              <p className="text-[9px] uppercase tracking-widest text-gray-600">Health</p>
              <p className="text-sm font-extrabold text-emerald-700">{parsed.vitality}%</p>
              <div className="h-1 mt-1 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${parsed.vitality}%` }} />
              </div>
            </div>
            <div className="rounded-lg p-2.5 border border-amber-200 bg-amber-50">
              <p className="text-[9px] uppercase tracking-widest text-gray-600">Window</p>
              <p className="text-[11px] font-bold text-amber-800 leading-tight">
                {parsed.actionWindow || "48–72 hrs"}
              </p>
            </div>
          </div>

          {/* Clinical Findings */}
          {diagSection && (
            <section>
              <div className="flex items-center gap-1.5 mb-1.5 border-b border-gray-300 pb-1">
                <Microscope className="h-4 w-4 text-gray-700" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide uppercase">
                  Clinical Findings
                </h3>
              </div>
              <ul className="space-y-1 text-[12px] sm:text-sm text-gray-800 leading-relaxed">
                {diagSection.bullets.map((b, i) => (
                  <li key={i} className="pl-3 relative">
                    <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-gray-700" />
                    {b.replace(/\*\*/g, "")}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {envSection && (
            <section>
              <div className="flex items-center gap-1.5 mb-1.5 border-b border-gray-300 pb-1">
                <Globe2 className="h-4 w-4 text-gray-700" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide uppercase">
                  Environmental &amp; Soil Profile
                </h3>
              </div>
              <ul className="space-y-1 text-[12px] sm:text-sm text-gray-800 leading-relaxed">
                {envSection.bullets.map((b, i) => (
                  <li key={i} className="pl-3 relative">
                    <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-gray-700" />
                    {b.replace(/\*\*/g, "")}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ============ 3. PRESCRIPTION (Rx) ============ */}
        <div className="bg-gray-50 border-t-2 border-dashed border-gray-400 px-4 sm:px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <span
                className="font-serif italic font-bold text-emerald-700 leading-none"
                style={{ fontSize: "44px" }}
              >
                ℞
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Prescription</p>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">Treatment Plan</h3>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {chem.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FlaskConical className="h-3.5 w-3.5 text-rose-700" />
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-700">
                    Chemical Protocol
                  </h4>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-[12px] sm:text-sm text-gray-900">
                  {chem.map((c, i) => (
                    <li key={i} className="leading-snug">{c.replace(/\*\*/g, "")}</li>
                  ))}
                </ol>
              </div>
            )}

            {organic.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Leaf className="h-3.5 w-3.5 text-emerald-700" />
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Organic / Desi Protocol
                  </h4>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-[12px] sm:text-sm text-gray-900">
                  {organic.map((c, i) => (
                    <li key={i} className="leading-snug">{c.replace(/\*\*/g, "")}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {ecoSection && (
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <IndianRupee className="h-3.5 w-3.5 text-amber-800" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Economic Impact
                </h4>
              </div>
              <ul className="space-y-0.5 text-[12px] text-amber-900">
                {ecoSection.bullets.map((b, i) => (
                  <li key={i}>• {b.replace(/\*\*/g, "")}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ============ 4. FOOTER & SIGNATURE ============ */}
        <div className="bg-white px-4 sm:px-6 pt-4 pb-5 border-t border-gray-300">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="italic text-[11px] text-gray-600" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                Digitally Authenticated by
              </p>
              <div className="mt-1 border-b border-gray-700 w-44 ml-auto" />
              <p className="mt-1 text-[12px] font-bold text-gray-900">Chief AI Fasal Doctor</p>
              <p className="text-[10px] text-gray-600">Bharat AI Agronomy Lab</p>
              <div className="mt-1 inline-flex items-center gap-1 text-[9px] text-emerald-700">
                <ShieldCheck className="h-3 w-3" /> ICAR-Aligned · Verified
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[9px] sm:text-[10px] italic text-gray-500 leading-snug">
            This is an AI-generated agronomy report. Please verify chemicals with local dealers
            and your nearest Krishi Vigyan Kendra (KVK) before application.
          </p>
        </div>
      </motion.div>

      {/* Download bar (kept outside the captured letterhead) */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[9px] text-muted-foreground font-heading tracking-wider flex items-center gap-1">
          <FileText className="h-3 w-3 text-green-india" />
          BHARAT AI · LAB REPORT #{reportId}
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
          {busy ? "Generating…" : downloaded ? "Downloaded ✓" : "Download Prescription (PDF)"}
        </button>
      </div>
    </div>
  );
});
ClinicalReport.displayName = "ClinicalReport";
