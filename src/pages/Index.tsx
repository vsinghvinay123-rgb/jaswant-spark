import { useState, useRef, useEffect, useCallback } from "react";
import { PanelLeft, Wheat, Volume2, VolumeX, Tractor, Settings } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import CropCalculator from "@/components/CropCalculator";
import CropDashboard from "@/components/CropDashboard";

import TypingIndicator from "@/components/TypingIndicator";
import AgentSwarm from "@/components/AgentSwarm";

import SuggestionChips from "@/components/SuggestionChips";
import FasalDoctorHighlight from "@/components/FasalDoctorHighlight";
import FloatingControlPanel from "@/components/FloatingControlPanel";




import { Link } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import ProfileSetupModal from "@/components/ProfileSetupModal";
import type { UserProfile } from "@/components/ProfileSetupModal";
import ApiKeyModal from "@/components/ApiKeyModal";
import { sendMessage, generateId, type Message, type ChatSession } from "@/lib/ai-service";
import { speakText } from "@/lib/speech";
import { UI_TEXT, LANG_OPTIONS, type Lang } from "@/lib/i18n";

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("bharat-splash-done"));
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("bharat-profile");
    if (saved) try { return JSON.parse(saved); } catch { /* */ }
    return null;
  });

  const [lang, setLang] = useState<Lang>(() =>
    profile?.lang || (localStorage.getItem("bharat-lang") as Lang) || "en"
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
      title: lang === "en" || lang === "hinglish" ? "New Chat" : "नई चैट",
      messages: [makeWelcome(lang)],
      createdAt: new Date(),
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cropCalcOpen, setCropCalcOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
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

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("bharat-splash-done", "true");
    setShowSplash(false);
    if (!localStorage.getItem("bharat-onboarded")) {
      setShowOnboarding(true);
    }
  }, []);

  const handleProfileSave = useCallback((p: UserProfile) => {
    setProfile(p);
    setLang(p.lang);
    setShowOnboarding(false);
  }, []);

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
        const response = await sendMessage(allMessages, lang, profile?.landSize);
        const aiMsg: Message = { id: generateId(), role: "assistant", content: response, timestamp: new Date() };

        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
        );
        if (ttsEnabled) speakText(response, lang);
      } catch {
        // Should not reach here since sendMessage now returns debug info
        const errMsg: Message = {
          id: generateId(), role: "assistant",
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
    [activeSession, activeSessionId, lang, ttsEnabled, profile]
  );


  const handleNewChat = () => {
    const ns: ChatSession = {
      id: generateId(),
      title: lang === "en" || lang === "hinglish" ? "New Chat" : "नई चैट",
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
        const ns: ChatSession = { id: generateId(), title: lang === "en" || lang === "hinglish" ? "New Chat" : "नई चैट", messages: [makeWelcome(lang)], createdAt: new Date() };
        setActiveSessionId(ns.id);
        return [ns];
      }
      if (activeSessionId === id) setActiveSessionId(filtered[0].id);
      return filtered;
    });
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(var(--neon-green)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-green)) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute top-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] pointer-events-none" />

      <ChatSidebar
        sessions={sessions} activeId={activeSessionId}
        onSelect={(id) => { setActiveSessionId(id); setSidebarOpen(false); }}
        onNew={handleNewChat} onDelete={handleDeleteSession}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)} lang={lang}
      />

      <div className="tiranga-bar" />

      {/* Site-wide crawlable nav for SEO / AdSense */}
      <nav aria-label="Primary" className="relative z-10 bg-card/80 border-b border-border px-3 py-1.5">
        <ul className="max-w-3xl mx-auto flex items-center justify-center gap-4 text-xs font-medium">
          <li><Link to="/" className="text-primary hover:underline">Home</Link></li>
          <li><Link to="/agri-wiki" className="text-foreground hover:text-primary">Agri-Wiki</Link></li>
          <li><Link to="/about" className="text-foreground hover:text-primary">About Us</Link></li>
          <li><Link to="/contact" className="text-foreground hover:text-primary">Contact</Link></li>
        </ul>
      </nav>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-3 py-2 glass-strong border-b border-border">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <PanelLeft className="h-5 w-5" />
          </button>
          <span className="text-lg">🇮🇳</span>
          <h1 className="font-heading font-bold text-sm sm:text-base tracking-wide leading-tight">
            <span className="text-saffron">BHARAT</span>{" "}
            <span className="text-green-india">AI</span>
            <span className="text-muted-foreground font-normal"> — </span>
            <span className="text-primary">Fasal Doctor</span>
          </h1>

          {/* Profile Badge */}
          {profile && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-[9px] font-heading text-muted-foreground">
              <Tractor className="h-3 w-3 text-saffron" />
              <span>{profile.landSize || "5 Acre"}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Profile Badge mobile */}
          {profile && (
            <div className="sm:hidden flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted border border-border text-[8px] font-heading text-muted-foreground mr-1">
              <Tractor className="h-2.5 w-2.5 text-saffron" />
              <span>{profile.landSize || "5A"}</span>
            </div>
          )}
          <button onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${ttsEnabled ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`}>
            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <button onClick={() => setCropCalcOpen(true)}
            className="p-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
            <Wheat className="h-4 w-4" />
          </button>
          {/* Language dropdown */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="px-2 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-heading font-semibold border-none outline-none cursor-pointer"
            style={{ background: "hsl(var(--primary) / 0.1)" }}
          >
            {LANG_OPTIONS.map((l) => (
              <option key={l.value} value={l.value} className="bg-card text-foreground">{l.label}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Crop Dashboard */}
      <CropDashboard lang={lang} />

      {/* Messages */}
      <main ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto scrollbar-thin" aria-label="Chat conversation">
        <div className="max-w-3xl mx-auto py-4">
          {activeSession?.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} lang={lang} />
          ))}
          {(activeSession?.messages.length ?? 0) <= 1 && <FasalDoctorHighlight lang={lang} />}
          {isLoading && <AgentSwarm />}
        </div>
      </main>

      {/* Bottom controls */}
      <div className="relative z-10 space-y-2 pb-2 pt-2">
        <div className="max-w-3xl mx-auto px-4">
          <SuggestionChips onSelect={handleSend} lang={lang} />
        </div>
        <div className="max-w-3xl mx-auto px-4 flex justify-center">
          <FloatingControlPanel
            lang={lang}
            onVoiceResult={(text) => handleSend(text)}
            onLocationDetect={(msg) => {
              const aiMsg: Message = { id: generateId(), role: "assistant", content: msg, timestamp: new Date() };
              setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s)));
            }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-4">
          <ChatInput onSend={handleSend} disabled={isLoading} lang={lang} />
        </div>
      </div>


      {/* Footer */}
      <div className="relative z-10 text-center py-1">
        <p className="text-[9px] text-muted-foreground font-heading tracking-widest">
          🇮🇳 CREATED BY <span className="text-saffron font-bold">JASWANT</span> · OFFLINE & FAST
        </p>
      </div>




      <CropCalculator open={cropCalcOpen} onClose={() => setCropCalcOpen(false)} lang={lang} />
      
      <ProfileSetupModal open={showOnboarding} onSave={handleProfileSave} currentLang={lang} />
      <ApiKeyModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Index;
