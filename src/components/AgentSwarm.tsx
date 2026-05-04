import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Cloud, BarChart3, Check, Loader2, Cpu } from "lucide-react";

interface Agent {
  icon: typeof Stethoscope;
  name: string;
  task: string;
  delay: number;
  iconBg: string;
  iconColor: string;
  badge: string;
}

const AGENTS: Agent[] = [
  {
    icon: Stethoscope,
    name: "Agronomy Agent",
    task: "Scanning for biological threats…",
    delay: 500,
    iconBg: "bg-secondary/15",
    iconColor: "text-green-india",
    badge: "bg-secondary/20 text-green-india border-secondary/40",
  },
  {
    icon: Cloud,
    name: "Climate Agent",
    task: "Analyzing local Churu offline weather logic…",
    delay: 1000,
    iconBg: "bg-navy/15",
    iconColor: "text-navy",
    badge: "bg-navy/20 text-navy border-navy/40",
  },
  {
    icon: BarChart3,
    name: "Data Agent",
    task: "Structuring multi-lingual output…",
    delay: 1500,
    iconBg: "bg-primary/15",
    iconColor: "text-saffron",
    badge: "bg-primary/20 text-saffron border-primary/40",
  },
];

const AgentSwarm = memo(() => {
  const [completed, setCompleted] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const timers = AGENTS.map((a, i) =>
      window.setTimeout(() => {
        setCompleted((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, a.delay)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="mx-4 my-3 rounded-2xl overflow-hidden border border-border bg-card/95 backdrop-blur-xl"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 0%, hsl(var(--green-india) / 0.08), transparent 40%), radial-gradient(circle at 100% 100%, hsl(var(--saffron) / 0.08), transparent 40%)",
      }}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-destructive/70" />
          <span className="w-2 h-2 rounded-full bg-saffron/70" />
          <span className="w-2 h-2 rounded-full bg-green-india/70" />
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-green-india animate-pulse" />
          <span className="text-[9px] font-heading tracking-widest text-muted-foreground uppercase">
            ANI · Agent Swarm
          </span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground">
          {completed.filter(Boolean).length}/3
        </span>
      </div>

      <div className="p-3 space-y-2">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon;
          const isDone = completed[i];
          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
                isDone
                  ? "bg-secondary/5 border-secondary/30"
                  : "bg-muted/30 border-border"
              }`}
            >
              <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${agent.iconBg}`}>
                <Icon className={`h-4 w-4 ${agent.iconColor}`} />
                {!isDone && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-saffron/30"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-heading font-bold text-foreground leading-tight">
                  {agent.name}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight truncate">
                  {agent.task}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isDone ? (
                  <motion.div
                    key="done"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-heading font-bold ${agent.badge}`}
                  >
                    <Check className="h-2.5 w-2.5" />
                    OK
                  </motion.div>
                ) : (
                  <motion.div key="loading" exit={{ opacity: 0 }}>
                    <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="px-3 pb-2">
        <p className="text-[8.5px] font-mono text-muted-foreground/70 tracking-wider text-center">
          &gt; Multi-ANI collaboration · Simulated AGI response
        </p>
      </div>
    </motion.div>
  );
});

AgentSwarm.displayName = "AgentSwarm";
export default AgentSwarm;
