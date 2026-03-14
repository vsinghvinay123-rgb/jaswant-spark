import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex gap-3 px-4 py-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center neon-glow-cyan">
      <Bot className="h-4 w-4 text-neon-cyan" />
    </div>
    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-neon-cyan"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
