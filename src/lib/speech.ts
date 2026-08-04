import type { Lang } from "./i18n";

/** Strip markdown so the synthesizer reads clean prose. */
function cleanForSpeech(text: string) {
  return text
    .replace(/<THINKING>[\s\S]*?<\/THINKING>/gi, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\|[^\n]+\|/g, "")
    .replace(/^\s*[-*]\s/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Chrome/Android truncates long utterances — split into short chunks. */
function chunkText(text: string, max = 180): string[] {
  const parts = text.match(/[^.!?।]+[.!?।]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let cur = "";
  for (const p of parts) {
    if (p.length > max) {
      if (cur.trim()) chunks.push(cur.trim());
      cur = "";
      for (let i = 0; i < p.length; i += max) chunks.push(p.slice(i, i + max).trim());
      continue;
    }
    if ((cur + p).length > max) {
      if (cur.trim()) chunks.push(cur.trim());
      cur = "";
    }
    cur += p;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.filter(Boolean);
}

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const existing = synth.getVoices();
  if (existing.length) return Promise.resolve(existing);
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish, { once: true });
    setTimeout(finish, 1000);
  });
}

/**
 * Speak text. MUST be called synchronously from a user gesture on mobile:
 * we kick off a priming utterance immediately so Chrome/Android unlocks audio,
 * then queue the real chunks once voices are available.
 */
export function speakText(text: string, lang: Lang) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const clean = cleanForSpeech(text);
  if (!clean) return;

  synth.cancel();

  const voiceLang = lang === "hi" || lang === "marwadi" ? "hi-IN" : "en-IN";

  // Prime the audio engine inside the user gesture (silent, near-instant).
  try {
    const primer = new SpeechSynthesisUtterance(" ");
    primer.volume = 0;
    primer.lang = voiceLang;
    synth.speak(primer);
  } catch {
    /* ignore */
  }

  const chunks = chunkText(clean);

  getVoices().then((voices) => {
    const voice =
      voices.find((v) => v.lang.replace("_", "-") === voiceLang) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(voiceLang.split("-")[0])) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
      null;

    chunks.forEach((chunk) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = voiceLang;
      u.rate = 1.15;
      u.pitch = 1;
      u.volume = 1;
      if (voice) u.voice = voice;
      synth.speak(u);
    });

    // Chrome bug: synthesis can start paused/stalled.
    if (synth.paused) synth.resume();
  });
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
