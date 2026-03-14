import { useState, useRef, useEffect, useCallback } from "react";
import { Settings, PanelLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import SettingsModal from "@/components/SettingsModal";
import TypingIndicator from "@/components/TypingIndicator";
import { sendMessage, generateId, type Message, type ChatSession } from "@/lib/ai-service";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `# Welcome! 👋

I'm **Jaswant's AI** — your ultimate assistant for coding, science, history, languages, and more.

Try asking me:
- *"Write a React component for a todo app"*
- *"Explain quantum computing"*
- *"Who made you?"*

💡 **Tip:** Open **Settings** (gear icon) to connect your OpenAI or Gemini API key for full AI-powered responses!`,
  timestamp: new Date(),
};

const Index = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("chat-sessions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    const initial: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [WELCOME_MESSAGE],
      createdAt: new Date(),
    };
    return [initial];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ai-api-key") || "");
  const [provider, setProvider] = useState<"openai" | "gemini">(() =>
    (localStorage.getItem("ai-provider") as "openai" | "gemini") || "openai"
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    localStorage.setItem("chat-sessions", JSON.stringify(sessions));
  }, [sessions]);

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
        const response = await sendMessage(allMessages, apiKey || null, provider);
        const aiMsg: Message = { id: generateId(), role: "assistant", content: response, timestamp: new Date() };

        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
        );
      } catch (error) {
        const errMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, errMsg] } : s))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSession, activeSessionId, apiKey, provider]
  );

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [WELCOME_MESSAGE],
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
        const newSession: ChatSession = {
          id: generateId(),
          title: "New Chat",
          messages: [WELCOME_MESSAGE],
          createdAt: new Date(),
        };
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (activeSessionId === id) setActiveSessionId(filtered[0].id);
      return filtered;
    });
  };

  const handleSaveSettings = (key: string, prov: "openai" | "gemini") => {
    setApiKey(key);
    setProvider(prov);
    localStorage.setItem("ai-api-key", key);
    localStorage.setItem("ai-provider", prov);
  };

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px]" />
      </div>

      <ChatSidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={(id) => {
          setActiveSessionId(id);
          setSidebarOpen(false);
        }}
        onNew={handleNewChat}
        onDelete={handleDeleteSession}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
            <Sparkles className="h-5 w-5 text-neon-cyan animate-pulse-glow" />
            <h1 className="font-heading font-bold text-lg">
              <span className="neon-text-cyan">Jaswant's</span>{" "}
              <span className="text-foreground">AI</span>
            </h1>
          </div>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
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
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        provider={provider}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default Index;
