import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import type { Message } from "@/lib/ai-service";

interface ChatMessageProps {
  message: Message;
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
      <div className="flex items-center justify-between px-4 py-2 bg-muted/80">
        <span className="text-xs font-mono text-muted-foreground">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-neon-cyan" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "hsl(230 25% 5%)",
          fontSize: "0.85rem",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const ChatMessage = memo(({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 px-4 py-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center neon-glow-cyan">
          <Bot className="h-4 w-4 text-neon-cyan" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-user-bubble text-user-bubble-foreground neon-glow-purple"
            : "glass text-ai-bubble-foreground"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-ai-bubble-foreground">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const value = String(children).replace(/\n$/, "");
                  if (match) {
                    return <CodeBlock language={match[1]} value={value} />;
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-neon-cyan" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0 leading-relaxed text-sm">{children}</p>;
                },
                strong({ children }) {
                  return <strong className="font-semibold text-foreground">{children}</strong>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2 space-y-1 text-sm">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-4 mb-2 space-y-1 text-sm">{children}</ol>;
                },
                h1({ children }) { return <h1 className="text-lg font-bold mb-2 neon-text-cyan">{children}</h1>; },
                h2({ children }) { return <h2 className="text-base font-bold mb-2 neon-text-cyan">{children}</h2>; },
                h3({ children }) { return <h3 className="text-sm font-bold mb-1 neon-text-cyan">{children}</h3>; },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-user-bubble/20 flex items-center justify-center">
          <User className="h-4 w-4 text-neon-purple" />
        </div>
      )}
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";
export default ChatMessage;
