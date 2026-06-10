import { useEffect, useRef } from "react";

/**
 * Adsterra banner ad injector.
 * Loads third-party scripts via useEffect to avoid React DOM mismatches.
 */
const AdBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current || !containerRef.current) return;
    injectedRef.current = true;

    const container = containerRef.current;
    const parent = container.parentElement;
    if (!parent) return;

    // 1. First async script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.setAttribute("data-cfasync", "false");
    script1.src = "https://pl29687701.effectivecpmnetwork.com/1548addb7abddff8d88a93ee15e021b7/invoke.js";

    // 2. Config script (must execute before the second invoke script)
    const configScript = document.createElement("script");
    configScript.text = `
      window.atOptions = {
        key: '13540e93f32bc1c6a43550ffd47c3506',
        format: 'iframe',
        height: 50,
        width: 320,
        params: {}
      };
    `;

    // 3. Second invoke script
    const script2 = document.createElement("script");
    script2.src = "https://www.highperformanceformat.com/13540e93f32bc1c6a43550ffd47c3506/invoke.js";

    // Append in order
    parent.appendChild(script1);
    parent.appendChild(configScript);
    parent.appendChild(script2);

    return () => {
      // Best-effort cleanup: remove scripts we appended
      try {
        if (script1.parentNode) script1.parentNode.removeChild(script1);
        if (configScript.parentNode) configScript.parentNode.removeChild(configScript);
        if (script2.parentNode) script2.parentNode.removeChild(script2);
      } catch {
        /* ignore */
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-1">
      <span className="text-[10px] text-gray-400 text-center mb-0.5 select-none">
        Sponsored
      </span>
      <div
        ref={containerRef}
        id="container-1548addb7abddff8d88a93ee15e021b7"
        className="flex justify-center items-center"
        style={{ minHeight: 50, width: "100%", maxWidth: 320 }}
      />
    </div>
  );
};

export default AdBanner;
