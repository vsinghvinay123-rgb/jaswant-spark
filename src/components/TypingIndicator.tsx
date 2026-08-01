import { motion } from "framer-motion";
import logoAsset from "@/assets/bharat-ai-logo.png.asset.json";

const TypingIndicator = ({ label = "Thinking" }: { label?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-3 px-4 py-3 items-center"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
      <img src={logoAsset.url} alt="Bharat AI" className="h-5 w-5 object-contain" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  </motion.div>
);

export default TypingIndicator;
