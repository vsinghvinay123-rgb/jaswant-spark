import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-3 px-4 py-3 items-center"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Bot className="h-4 w-4 text-saffron" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Thinking</span>
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
