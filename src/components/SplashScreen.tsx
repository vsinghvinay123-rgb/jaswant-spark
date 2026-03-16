import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Grid bg */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(hsl(var(--neon-green)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-green)) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />

          {/* Glow */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px]" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-secondary/15 blur-[60px] translate-y-10" />

          {/* Brain + Leaf */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative z-10 flex items-center gap-3 mb-6"
          >
            <span className="text-6xl">🧠</span>
            <span className="text-5xl">🌿</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 font-heading font-bold text-3xl tracking-wide mb-2"
          >
            <span className="text-saffron">BHARAT</span>{" "}
            <span className="text-green-india">AI</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-10 text-muted-foreground text-sm font-body"
          >
            Empowering Farmers. Built by <span className="text-saffron font-semibold">Jaswant</span>.
          </motion.p>

          {/* Pulse rings */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border border-primary/30"
            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full border border-secondary/30"
            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
          />

          <div className="absolute bottom-0 left-0 right-0 tiranga-bar" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
