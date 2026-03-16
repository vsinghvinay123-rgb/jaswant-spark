import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";
import { LANG_OPTIONS, type Lang } from "@/lib/i18n";

export interface UserProfile {
  name: string;
  landSize: string;
  lang: Lang;
}

interface ProfileSetupModalProps {
  open: boolean;
  onSave: (profile: UserProfile) => void;
  currentLang: Lang;
}

const ProfileSetupModal = ({ open, onSave, currentLang }: ProfileSetupModalProps) => {
  const [name, setName] = useState("");
  const [landSize, setLandSize] = useState("");
  const [lang, setLang] = useState<Lang>(currentLang);

  const handleSave = () => {
    const profile: UserProfile = {
      name: name.trim() || "Kisan",
      landSize: landSize.trim() || "5 Acre",
      lang,
    };
    localStorage.setItem("bharat-profile", JSON.stringify(profile));
    localStorage.setItem("bharat-onboarded", "true");
    onSave(profile);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm glass-strong rounded-2xl neon-border-orange p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-saffron" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-saffron">Set Your Profile</h2>
                <p className="text-xs text-muted-foreground">Personalize your experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-heading text-muted-foreground mb-1 block">Your Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:neon-border-orange transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-heading text-muted-foreground mb-1 block">Land Size</label>
                <input
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  placeholder="e.g. 5 Acre"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:neon-border-orange transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-heading text-muted-foreground mb-1 block">Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground outline-none focus:neon-border-orange transition-all"
                >
                  {LANG_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm saffron-glow hover:brightness-110 transition-all"
            >
              Save & Start 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileSetupModal;
