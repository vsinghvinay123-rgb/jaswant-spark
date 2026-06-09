import { useEffect, useState } from "react";

const STORAGE_KEY = "bharat-cookie-consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[100] bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-2xl"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-xs sm:text-sm text-foreground flex-1 leading-relaxed">
          We use cookies, including third-party Google AdSense cookies, to
          personalize content, serve ads, and analyze traffic. By continuing to
          use Bharat AI, you consent to our use of cookies.{" "}
          <a href="/privacy" className="text-primary underline">
            Learn more
          </a>
        </p>
        <button
          onClick={accept}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
