import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import WhatsAppShare from "./WhatsAppShare";
import type { Message } from "@/lib/ai-service";
import type { Lang } from "@/lib/i18n";

interface ChatMessageProps {
  message: Message;
  lang: Lang;
}

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted">
        <span className="text-xs font-mono text-muted-foreground">{language || "code"}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="h-3.5 w-3.5 text-green-india" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter style={atomDark} language={language || "text"} PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8rem", background: "hsl(220 18% 8%)" }}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const isDetailedResponse = (content: string) =>
  content.includes("##") || content.includes("**") || content.length > 200;

const ChatMessage = memo(({ message, lang }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const showWhatsApp = !isUser && message.id !== "welcome" && isDetailedResponse(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 px-4 py-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 neon-border-orange flex items-center justify-center">
          <Bot className="h-4 w-4 text-saffron" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "" : ""}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary/20 text-foreground neon-border-orange"
            : "glass text-foreground"
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-foreground">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const value = String(children).replace(/\n$/, "");
                    if (match) return <CodeBlock language={match[1]} value={value} />;
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }) { return <p className="mb-2 last:mb-0 leading-relaxed text-sm">{children}</p>; },
                  strong({ children }) { return <strong className="font-semibold text-saffron">{children}</strong>; },
                  ul({ children }) { return <ul className="list-disc pl-4 mb-2 space-y-1 text-sm">{children}</ul>; },
                  ol({ children }) { return <ol className="list-decimal pl-4 mb-2 space-y-1 text-sm">{children}</ol>; },
                  h1({ children }) { return <h1 className="text-lg font-bold mb-2 text-saffron font-heading">{children}</h1>; },
                  h2({ children }) { return <h2 className="text-base font-bold mb-2 text-saffron font-heading">{children}</h2>; },
                  h3({ children }) { return <h3 className="text-sm font-bold mb-1 text-green-india font-heading">{children}</h3>; },
                  table({ children }) { return <table className="w-full text-sm border-collapse my-2">{children}</table>; },
                  th({ children }) { return <th className="border border-border px-3 py-1.5 bg-muted text-left font-semibold text-saffron">{children}</th>; },
                  td({ children }) { return <td className="border border-border px-3 py-1.5">{children}</td>; },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {showWhatsApp && <WhatsAppShare text={message.content} lang={lang} />}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/10 neon-border-green flex items-center justify-center">
          <User className="h-4 w-4 text-green-india" />
        </div>
      )}
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";
export default ChatMessage;
