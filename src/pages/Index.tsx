import { useState, useRef, useEffect, useCallback } from "react";
import { PanelLeft, Wheat, Globe, Volume2, VolumeX } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import CropCalculator from "@/components/CropCalculator";
import TypingIndicator from "@/components/TypingIndicator";
import FloatingControlPanel from "@/components/FloatingControlPanel";
import SuggestionChips from "@/components/SuggestionChips";
import { sendMessage, generateId, type Message, type ChatSession } from "@/lib/ai-service";
import { speakText } from "@/lib/speech";
import { UI_TEXT, type Lang } from "@/lib/i18n";

const Index = () => {
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem("bharat-lang") as Lang) || "en"
  );

  const t = UI_TEXT[lang];
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const makeWelcome = (l: Lang): Message => ({
    id: "welcome",
    role: "assistant",
    content: UI_TEXT[l].welcome,
    timestamp: new Date(),
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("bharat-sessions");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [{
      id: generateId(),
      title: lang === "en" ? "New Chat" : "नई चैट",
      messages: [makeWelcome(lang)],
      createdAt: new Date(),
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cropCalcOpen, setCropCalcOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    localStorage.setItem("bharat-sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("bharat-lang", lang);
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeSession?.messages, isLoading]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!activeSession) return;
      const userMsg: Message = { id: generateId(), role: "user", content, timestamp: new Date() };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          const updated = { ...s, messages: [...s.messages, userMsg] };
          if (s.messages.length <= 1) {
            updated.title = content.slice(0, 40) + (content.length > 40 ? "..." : "");
          }
          return updated;
        })
      );

      setIsLoading(true);
      try {
        const allMessages = [...activeSession.messages, userMsg].filter((m) => m.id !== "welcome");
        const response = await sendMessage(allMessages, lang);
        const aiMsg: Message = { id: generateId(), role: "assistant", content: response, timestamp: new Date() };

        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
        );
        if (ttsEnabled) speakText(response, lang);
      } catch {
        const errMsg: Message = {
          id: generateId(), role: "assistant",
          content: lang === "en" ? "⚠️ Error occurred." : "⚠️ त्रुटि हुई।",
          timestamp: new Date(),
        };
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, errMsg] } : s))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSession, activeSessionId, lang, ttsEnabled]
  );

  const handleBotMessage = useCallback(
    (content: string) => {
      const msg: Message = { id: generateId(), role: "assistant", content, timestamp: new Date() };
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, msg] } : s))
      );
      if (ttsEnabled) speakText(content, lang);
    },
    [activeSessionId, lang, ttsEnabled]
  );

  const handleNewChat = () => {
    const ns: ChatSession = {
      id: generateId(),
      title: lang === "en" ? "New Chat" : "नई चैट",
      messages: [makeWelcome(lang)],
      createdAt: new Date(),
    };
    setSessions((prev) => [ns, ...prev]);
    setActiveSessionId(ns.id);
    setSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (!filtered.length) {
        const ns: ChatSession = { id: generateId(), title: lang === "en" ? "New Chat" : "नई चैट", messages: [makeWelcome(lang)], createdAt: new Date() };
        setActiveSessionId(ns.id);
        return [ns];
      }
      if (activeSessionId === id) setActiveSessionId(filtered[0].id);
      return filtered;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(var(--neon-green)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-green)) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      {/* Glow orbs */}
      <div className="absolute top-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] pointer-events-none" />

      <ChatSidebar
        sessions={sessions} activeId={activeSessionId}
        onSelect={(id) => { setActiveSessionId(id); setSidebarOpen(false); }}
        onNew={handleNewChat} onDelete={handleDeleteSession}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)} lang={lang}
      />

      <div className="tiranga-bar" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-2.5 glass-strong border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <PanelLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            <h1 className="font-heading font-bold text-lg tracking-wide">
              <span className="text-saffron">BHARAT</span>{" "}
              <span className="text-green-india">AI</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-lg text-xs transition-colors ${ttsEnabled ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`}>
            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button onClick={() => setCropCalcOpen(true)}
            className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
            <Wheat className="h-4 w-4" />
          </button>
          <button onClick={() => setLang((p) => (p === "en" ? "hi" : "en"))}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto py-4">
          {activeSession?.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 space-y-2 pb-1">
        <div className="max-w-3xl mx-auto px-4">
          <SuggestionChips onSelect={handleSend} lang={lang} />
        </div>
        <div className="flex justify-center">
          <FloatingControlPanel onVoiceResult={handleSend} onLocationDetect={handleBotMessage} lang={lang} />
        </div>
        <ChatInput onSend={handleSend} disabled={isLoading} lang={lang} />
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-1">
        <p className="text-[9px] text-muted-foreground font-heading tracking-widest">
          🇮🇳 CREATED BY <span className="text-saffron font-bold">JASWANT</span> · OFFLINE & FAST
        </p>
      </div>

      <CropCalculator open={cropCalcOpen} onClose={() => setCropCalcOpen(false)} lang={lang} />
    </div>
  );
};

export default Index;
