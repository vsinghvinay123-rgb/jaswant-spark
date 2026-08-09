import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyMonetagBanner = () => {
  const [visible, setVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !bannerRef.current) return;

    const script = document.createElement("script");
    script.dataset.zone = "11532971";
    script.src = "https://nap5k.com/tag.min.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    bannerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <aside
      ref={bannerRef}
      aria-label="Advertisement"
      className="fixed inset-x-0 bottom-0 z-[9999] min-h-[3.5rem] overflow-hidden border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_hsl(var(--foreground)/0.12)] backdrop-blur-md"
    >
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={() => setVisible(false)}
        aria-label="Close advertisement"
        title="Close advertisement"
        className="absolute right-1 top-1 z-10 h-6 w-6 rounded-full bg-muted/90 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </aside>
  );
};

export default StickyMonetagBanner;
