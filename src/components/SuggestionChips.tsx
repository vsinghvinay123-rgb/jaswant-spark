import { motion } from "framer-motion";
import type { Lang } from "@/lib/i18n";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
  lang: Lang;
}

const SUGGESTIONS = {
  en: [
    "5 acre Bajra",
    "ISRO GK",
    "Who made you?",
    "10 acre Wheat",
    "Chandrayaan",
    "Coding basics",
  ],
  hi: [
    "5 एकड़ बाजरा",
    "ISRO GK",
    "तुम्हें किसने बनाया?",
    "10 एकड़ गेहूं",
    "चंद्रयान",
    "कोडिंग बेसिक्स",
  ],
};

const SuggestionChips = ({ onSelect, lang }: SuggestionChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 px-1">
      {SUGGESTIONS[lang].map((s, i) => (
        <motion.button
          key={s}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(s)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/15 hover:text-primary transition-all border border-border"
        >
          {s}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestionChips;
