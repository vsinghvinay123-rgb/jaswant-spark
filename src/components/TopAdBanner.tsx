import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Ultra-thin top AdSense banner.
 * Strict height: 60px on mobile, 90px on desktop. Forced horizontal format.
 */
const TopAdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not loaded yet */
    }
  }, []);

  return (
    <div className="h-[60px] md:h-[90px] w-full overflow-hidden flex justify-center items-center py-0 border-b border-gray-100 bg-white">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-1018836158313685"
        data-ad-slot="0000000000"
        data-ad-format="horizontal"
        data-full-width-responsive="false"
      />
    </div>
  );
};

export default TopAdBanner;
