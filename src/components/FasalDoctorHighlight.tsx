import { memo } from "react";
import { Sprout, ScanLine, FileDown, Activity } from "lucide-react";
import { motion } from "framer-motion";
import type { Lang } from "@/lib/i18n";

const COPY: Record<Lang, { title: string; body: string; chips: string[] }> = {
  en: {
    title: "Meet Your Advanced AI Fasal Doctor",
    body:
      "Empowering Indian agriculture with cutting-edge artificial intelligence. Bharat AI's Fasal Doctor is a Supreme Agronomist in your pocket. Simply upload a clear photo of your crop, leaf, or soil. Our advanced biological vision scanner instantly detects pests, fungal infections, and nutritional deficiencies. Within seconds, receive a clinical-grade diagnostic report complete with crop vitality scores, spread rates, and ICAR-standard chemical and organic treatment plans. You can even download the full prescription as a professional PDF. Smart farming, now just a click away.",
    chips: ["Biological Vision Scanner", "ICAR-grade Treatment Plan", "Vitality & Spread Score", "Downloadable PDF Report"],
  },
  hi: {
    title: "आपका एडवांस AI फसल डॉक्टर",
    body:
      "अत्याधुनिक AI से भारतीय कृषि को सशक्त बनाते हुए, Bharat AI का फसल डॉक्टर आपकी जेब में मौजूद Supreme Agronomist है। बस अपनी फसल, पत्ती या मिट्टी की साफ फोटो अपलोड करें। हमारा बायोलॉजिकल विज़न स्कैनर तुरंत कीट, फफूँद और पोषक तत्वों की कमी पकड़ लेता है। कुछ ही सेकंड में आपको क्लिनिकल रिपोर्ट मिलती है — विटैलिटी स्कोर, फैलाव की गति, और ICAR मानक के रासायनिक व जैविक उपचार के साथ। पूरी प्रिस्क्रिप्शन को प्रोफेशनल PDF में डाउनलोड भी कर सकते हैं।",
    chips: ["जैविक विज़न स्कैनर", "ICAR उपचार योजना", "विटैलिटी व स्प्रेड स्कोर", "PDF रिपोर्ट डाउनलोड"],
  },
  hinglish: {
    title: "Aapka Advanced AI Fasal Doctor",
    body:
      "Cutting-edge AI ke saath Indian agriculture ko empower karte hue, Bharat AI ka Fasal Doctor aapki pocket me ek Supreme Agronomist hai. Sirf apni fasal, patti ya mitti ki saaf photo upload karein. Hamara biological vision scanner turant pests, fungal infections aur nutrient deficiency pakad leta hai. Seconds me clinical-grade report milti hai — vitality score, spread rate, aur ICAR-standard chemical & organic treatment ke saath. Poori prescription ko professional PDF me download bhi kar sakte hain.",
    chips: ["Biological Vision Scan", "ICAR Treatment Plan", "Vitality & Spread Score", "PDF Report Download"],
  },
  marwadi: {
    title: "थारो एडवांस AI फसल डॉक्टर",
    body:
      "अत्याधुनिक AI सूं भारतीय खेती ने ताकत देता थका, Bharat AI रो फसल डॉक्टर थारी जेब में बैठ्यो Supreme Agronomist है सा। बस फसल, पत्ती या माटी री साफ फोटो डाळो। म्हारो बायोलॉजिकल विज़न स्कैनर तुरंत कीड़ा, फफूंद अर पोषण री कमी पकड़ ल्यै। थोड़ा सेकंड में क्लिनिकल रिपोर्ट मिलै — विटैलिटी स्कोर, फैलाव री गति, अर ICAR मानक रा रसायन व जैविक उपचार रै साथै। पूरी पर्ची ने PDF में डाउनलोड भी कर सकाँ सा।",
    chips: ["जैविक विज़न स्कैनर", "ICAR उपचार योजना", "विटैलिटी अर स्प्रेड", "PDF रिपोर्ट"],
  },
};

const FasalDoctorHighlight = memo(({ lang }: { lang: Lang }) => {
  const t = COPY[lang];
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Fasal Doctor — AI Crop Diagnosis"
      className="mx-4 my-3 rounded-2xl glass border border-green-india/30 shadow-[0_0_30px_-15px_hsl(var(--neon-green))] overflow-hidden"
    >
      <div className="tiranga-bar" />
      <div className="p-4 sm:p-5 space-y-3">
        <header className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-green-india/15 flex items-center justify-center neon-border-green">
            <Sprout className="h-5 w-5 text-green-india" aria-hidden="true" />
          </div>
          <h1 className="font-heading font-bold text-base sm:text-lg text-foreground leading-tight">
            🌱 {t.title}
          </h1>
        </header>

        <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
          {t.body}
        </p>

        <ul className="grid grid-cols-2 gap-2 pt-1" aria-label="Key features">
          {t.chips.map((c, i) => {
            const Icon = [ScanLine, Activity, Sprout, FileDown][i % 4];
            return (
              <li
                key={c}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-saffron flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{c}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.section>
  );
});

FasalDoctorHighlight.displayName = "FasalDoctorHighlight";
export default FasalDoctorHighlight;
