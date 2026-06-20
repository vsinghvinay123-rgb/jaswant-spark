import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { UI_TEXT, type Lang } from "@/lib/i18n";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  lang: Lang;
}

const ChatInput = ({ onSend, disabled, lang }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = UI_TEXT[lang];

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="glass-strong rounded-2xl neon-border-orange flex items-end gap-2 p-3">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={t.placeholder}
        disabled={disabled}
        rows={2}
        className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground scrollbar-thin font-body min-h-[44px]"
        style={{ maxHeight: 160 }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="flex-shrink-0 h-9 px-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-1.5 transition-all saffron-glow hover:brightness-110 disabled:opacity-20 disabled:cursor-not-allowed text-xs font-heading font-semibold"
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">{t.sendBtn}</span>
      </button>
    </div>
  );
};

export default ChatInput;
