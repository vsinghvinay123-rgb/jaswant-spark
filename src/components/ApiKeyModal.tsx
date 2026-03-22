import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Cpu } from "lucide-react";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

const ApiKeyModal = ({ open, onClose }: ApiKeyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-foreground">
            <Cpu className="h-5 w-5 text-primary" /> Bharat AI Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Bharat AI runs 100% offline — no API key needed!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 text-secondary text-xs font-heading">
            <Cpu className="h-4 w-4" />
            Offline Mode Active · No Internet Required
          </div>
          <p className="text-[10px] text-muted-foreground">
            All responses are powered by a built-in rule-based engine. Ask about crops, coding, ISRO, or Jaswant!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
