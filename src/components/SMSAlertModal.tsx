import { useState } from "react";
import { X, Bell, Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lang } from "@/lib/i18n";

interface SMSAlertModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

const SMSAlertModal = ({ open, onClose, lang }: SMSAlertModalProps) => {
  const [phone, setPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (phone.length >= 10) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setPhone("");
        onClose();
      }, 3000);
    }
  };

  const handleClose = () => {
    setSubscribed(false);
    setPhone("");
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
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={handleClose} />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="relative w-full max-w-sm glass-strong rounded-2xl neon-border-orange p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-saffron" />
                </div>
                <h2 className="font-heading font-bold text-lg text-saffron">
                  {lang === "en" ? "Offline SMS Alerts" : "ऑफ़लाइन SMS अलर्ट"}
                </h2>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="tiranga-bar rounded-full" />

            {!subscribed ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  {lang === "en"
                    ? "Get instant alerts for sudden rain, watering schedules, and mandi price changes directly to your phone."
                    : "अचानक बारिश, सिंचाई शेड्यूल, और मंडी भाव में बदलाव के लिए तुरंत अलर्ट पाएं।"}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-muted flex-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s]/g, ""))}
                      maxLength={15}
                      className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {lang === "en" ? "Rain & weather alerts" : "बारिश और मौसम अलर्ट"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {lang === "en" ? "Watering schedule reminders" : "सिंचाई शेड्यूल रिमाइंडर"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {lang === "en" ? "Mandi price changes" : "मंडी भाव बदलाव"}
                  </div>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={phone.length < 10}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm saffron-glow hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {lang === "en" ? "Subscribe to Alerts" : "अलर्ट के लिए सबस्क्राइब करें"}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-3 py-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="h-12 w-12 text-green-india mx-auto" />
                </motion.div>
                <p className="text-sm font-medium text-green-india">
                  {lang === "en"
                    ? "✅ Number saved! You will receive offline SMS alerts for sudden rain and watering schedules directly to your phone."
                    : "✅ नंबर सेव हो गया! आपको अचानक बारिश और सिंचाई शेड्यूल के SMS अलर्ट सीधे फोन पर मिलेंगे।"}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SMSAlertModal;
