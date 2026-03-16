import { motion } from "framer-motion";
import type { Lang } from "@/lib/i18n";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
  lang: Lang;
}

const SUGGESTIONS: Record<Lang, string[]> = {
  en: ["5 acre Bajra", "ISRO GK", "Who made you?", "10 acre Wheat", "Chandrayaan", "Coding basics"],
  hi: ["5 एकड़ बाजरा", "ISRO GK", "तुम्हें किसने बनाया?", "10 एकड़ गेहूं", "चंद्रयान", "कोडिंग बेसिक्स"],
  hinglish: ["5 acre Bajra", "ISRO GK", "Tumhe kisne banaya?", "10 acre Wheat", "Chandrayaan", "Coding basics"],
  marwadi: ["5 एकड़ बाजरा", "ISRO GK", "थनै कुण बनायो?", "10 एकड़ गेहूं", "चंद्रयान", "कोडिंग बेसिक्स"],
};

const SuggestionChips = ({ onSelect, lang }: SuggestionChipsProps) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1 px-1">
      {SUGGESTIONS[lang].map((s, i) => (
        <motion.button
          key={s}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onSelect(s)}
          className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-heading font-semibold tracking-wide bg-muted text-muted-foreground hover:text-primary hover:neon-border-orange transition-all border border-border"
        >
          {s}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestionChips;
