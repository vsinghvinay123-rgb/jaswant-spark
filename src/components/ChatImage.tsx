import { useState } from "react";
import { Download, Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";

interface ChatImageProps {
  url: string;
  alt: string;
}

const ChatImage = ({ url, alt }: ChatImageProps) => {
  const [open, setOpen] = useState(false);

  const download = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `bharat-ai-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-2 relative group rounded-2xl overflow-hidden border border-border bg-muted/40 max-w-sm"
      >
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onClick={() => setOpen(true)}
          className="w-full h-auto cursor-zoom-in object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => setOpen(true)}
            aria-label="Expand image"
            className="h-8 w-8 rounded-lg bg-background/85 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
          >
            <Maximize2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={download}
            aria-label="Download image"
            className="h-8 w-8 rounded-lg bg-background/85 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
          >
            <Download className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </motion.div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img src={url} alt={alt} className="max-h-[85vh] max-w-full rounded-xl border border-border" />
          <button
            aria-label="Close image"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>
      )}
    </>
  );
};

export default ChatImage;
