import { useState, useRef, useEffect, useCallback } from "react";
import { PanelLeft, Wheat, Globe } from "lucide-react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import CropCalculator from "@/components/CropCalculator";
import TypingIndicator from "@/components/TypingIndicator";
import { sendMessage, generateId, type Message, type ChatSession } from "@/lib/ai-service";
import { UI_TEXT, type Lang } from "@/lib/i18n";

const Index = () => {
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem("bharat-lang") as Lang) || "en"
  );

  const t = UI_TEXT[lang];

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
      } catch {
        const errMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: lang === "en" ? "⚠️ Something went wrong. Please try again." : "⚠️ कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
          timestamp: new Date(),
        };
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, errMsg] } : s))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSession, activeSessionId, lang]
  );

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: lang === "en" ? "New Chat" : "नई चैट",
      messages: [makeWelcome(lang)],
      createdAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const ns: ChatSession = {
          id: generateId(),
          title: lang === "en" ? "New Chat" : "नई चैट",
          messages: [makeWelcome(lang)],
          createdAt: new Date(),
        };
        setActiveSessionId(ns.id);
        return [ns];
      }
      if (activeSessionId === id) setActiveSessionId(filtered[0].id);
      return filtered;
    });
  };

  const toggleLang = () => setLang((prev) => (prev === "en" ? "hi" : "en"));

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <ChatSidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={(id) => { setActiveSessionId(id); setSidebarOpen(false); }}
        onNew={handleNewChat}
        onDelete={handleDeleteSession}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        lang={lang}
      />

      {/* Tiranga top bar */}
      <div className="tiranga-bar" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 glass-strong border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🇮🇳</span>
            <h1 className="font-heading font-bold text-lg">
              <span className="text-saffron">{lang === "en" ? "Bharat" : "भारत"}</span>{" "}
              <span className="text-navy">AI</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCropCalcOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-medium hover:bg-secondary/20 transition-colors"
          >
            <Wheat className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.cropCalculator}</span>
          </button>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "हिंदी" : "English"}
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

      {/* Input */}
      <div className="relative z-10">
        <ChatInput onSend={handleSend} disabled={isLoading} lang={lang} />
      </div>

      <CropCalculator open={cropCalcOpen} onClose={() => setCropCalcOpen(false)} lang={lang} />
    </div>
  );
};

export default Index;
