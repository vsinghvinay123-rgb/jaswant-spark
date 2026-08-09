// Event-based monetization: opens the sponsor direct link after premium feature results.
// Strictly NOT triggered by voice interactions.

const SPONSOR_URL = "https://omg10.com/4/11532972";
const DELAY_MS = 1500;
const COOLDOWN_MS = 60_000; // avoid spamming tabs

let lastShown = 0;

export type AdEvent = "diagnostic" | "mandi" | "weather";

export const triggerSponsorAd = (event: AdEvent) => {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastShown < COOLDOWN_MS) return;
  lastShown = now;
  window.setTimeout(() => {
    try {
      window.open(SPONSOR_URL, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.warn("[ads] could not open sponsor link", event, e);
    }
  }, DELAY_MS);
};
