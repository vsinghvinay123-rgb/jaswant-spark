import { useState } from "react";
import { X, Key, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  provider: "openai" | "gemini";
  onSave: (key: string, provider: "openai" | "gemini") => void;
}

const SettingsModal = ({ open, onClose, apiKey, provider, onSave }: SettingsModalProps) => {
  const [key, setKey] = useState(apiKey);
  const [prov, setProv] = useState(provider);

  const handleSave = () => {
    onSave(key.trim(), prov);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md glass-strong rounded-2xl neon-glow-purple p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-neon-purple" />
                <h2 className="font-heading font-semibold text-lg">Settings</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">AI Provider</label>
                <div className="flex gap-2">
                  {(["openai", "gemini"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProv(p)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        prov === p
                          ? "bg-primary text-primary-foreground neon-glow-cyan"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p === "openai" ? "OpenAI" : "Gemini"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" />
                  API Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={prov === "openai" ? "sk-..." : "AIza..."}
                  className="w-full px-4 py-2.5 rounded-xl bg-input text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary focus:neon-glow-cyan transition-all text-sm font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your key is stored locally and never sent to any server except {prov === "openai" ? "OpenAI" : "Google"}.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground neon-glow-cyan text-sm font-medium transition-all hover:opacity-90"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
