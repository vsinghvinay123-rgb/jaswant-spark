import type { Lang } from "./i18n";

export function speakText(text: string, lang: Lang) {
  if (!window.speechSynthesis) return;

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

  const short = clean.length > 300 ? clean.slice(0, 300) + "..." : clean;

  window.speechSynthesis.cancel();

  const voiceLang = (lang === "hi" || lang === "marwadi") ? "hi-IN" : "en-IN";
  const utterance = new SpeechSynthesisUtterance(short);
  utterance.lang = voiceLang;
  utterance.rate = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(v => v.lang.includes(voiceLang.split("-")[0]));
  if (indianVoice) utterance.voice = indianVoice;

  window.speechSynthesis.speak(utterance);
}
