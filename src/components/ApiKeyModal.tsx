import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

const ApiKeyModal = ({ open, onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("bharat-gemini-key") || "";
      setApiKey(saved);
      setHasKey(!!saved);
    }
  }, [open]);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem("bharat-gemini-key", trimmed);
      toast({ title: "✅ API Key Saved", description: "Bharat AI is now connected to Google Gemini." });
    } else {
      localStorage.removeItem("bharat-gemini-key");
      toast({ title: "🔌 Key Removed", description: "Switched back to offline mode." });
    }
    setHasKey(!!trimmed);
    onClose();
  };

  const maskedKey = apiKey ? `sk-...${apiKey.slice(-4)}` : "";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-foreground">
            <Key className="h-5 w-5 text-primary" /> AI Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Paste your Google Gemini API key to enable AI-powered responses. Without a key, offline mode is used.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-heading ${hasKey ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
            {hasKey ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {hasKey ? `Connected: ${maskedKey}` : "Offline Mode (No API Key)"}
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10 bg-background border-border font-mono text-xs"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Your key is stored locally in your browser. It is never sent to any server other than OpenAI.
          </p>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground font-heading text-xs">
              Save Key
            </Button>
            {hasKey && (
              <Button
                variant="outline"
                onClick={() => { setApiKey(""); localStorage.removeItem("bharat-openai-key"); setHasKey(false); toast({ title: "Key removed" }); }}
                className="text-xs font-heading border-border text-muted-foreground"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
