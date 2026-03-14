import { Plus, MessageSquare, Trash2, PanelLeftClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatSession } from "@/lib/ai-service";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

const ChatSidebar = ({ sessions, activeId, onSelect, onNew, onDelete, open, onClose }: ChatSidebarProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 w-[280px] z-50 glass-strong flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-heading font-semibold text-sm neon-text-cyan">Chat History</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={onNew}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-neon-cyan/30 text-neon-cyan text-sm font-medium hover:bg-muted/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 space-y-1">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                layout
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
                  activeId === session.id
                    ? "bg-muted text-foreground neon-glow-cyan"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
                onClick={() => onSelect(session.id)}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 truncate">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              Powered by <span className="neon-text-purple font-semibold">Jaswant's AI</span>
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
