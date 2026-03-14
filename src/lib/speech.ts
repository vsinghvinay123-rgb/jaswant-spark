export function speakText(text: string, lang: "en" | "hi") {
  if (!window.speechSynthesis) return;

  // Strip markdown formatting
  const clean = text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\|[^\n]+\|/g, "")
    .replace(/[-*]\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();

  if (!clean) return;

  // Take first ~300 chars to keep speech short
  const short = clean.length > 300 ? clean.slice(0, 300) + "..." : clean;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(short);
  utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
  utterance.rate = 1.0;

  // Try to find an Indian voice
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(v =>
    v.lang.includes(lang === "hi" ? "hi" : "en-IN") ||
    v.lang.includes("hi-IN")
  );
  if (indianVoice) utterance.voice = indianVoice;

  window.speechSynthesis.speak(utterance);
}
