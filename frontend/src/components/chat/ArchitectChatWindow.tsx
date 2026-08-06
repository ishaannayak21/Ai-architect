import { AnimatePresence } from "framer-motion";
import {
  Bot,
  Container,
  CreditCard,
  Database,
  Flame,
  Key,
  Network,
  Send,
  Shield,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatMessageItem } from "@/components/chat/ChatMessageItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useChat } from "@/hooks/useChat";
import { getApiErrorMessage } from "@/utils/errors";

const QUICK_PROMPTS = [
  { label: "Add authentication", prompt: "Add authentication & JWT security strategy to this architecture.", icon: Key },
  { label: "Replace database", prompt: "Replace or upgrade the primary database with high availability PostgreSQL.", icon: Database },
  { label: "Add caching", prompt: "Add Redis caching layer to reduce DB latency and handle high read concurrency.", icon: Flame },
  { label: "Scale architecture", prompt: "How do we scale this architecture to support 100,000 active concurrent users?", icon: Zap },
  { label: "Improve security", prompt: "Provide security hardening recommendations including CORS, WAF, and rate-limiting.", icon: Shield },
  { label: "Generate Docker deployment", prompt: "Generate Docker deployment configuration and docker-compose.yml for this architecture.", icon: Container },
  { label: "Improve APIs", prompt: "Improve API endpoints with versioning, pagination, and OpenAPI specification.", icon: Network },
  { label: "Add payment gateway", prompt: "Add Stripe payment gateway integration with webhooks & idempotency keys.", icon: CreditCard },
  { label: "Convert to microservices", prompt: "Propose a microservices topology breakdown for this architecture.", icon: Sparkles },
  { label: "Optimize performance", prompt: "Optimize performance, database query execution times, and CDN asset delivery.", icon: Zap },
];

export function ArchitectChatWindow({ blueprintId }: { blueprintId: number }) {
  const {
    messages,
    isLoading,
    sendMessage,
    isSending,
    regenerate,
    isRegenerating,
    clearChat,
    isClearing,
  } = useChat(blueprintId);

  const [inputContent, setInputContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputContent).trim();
    if (!text || isSending) return;

    setInputContent("");
    try {
      await sendMessage(text);
      scrollToBottom();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to send chat message. Please try again."));
    }
  };

  const handleEditPrompt = (promptText: string) => {
    setInputContent(promptText);
  };

  const handleRegenerate = async () => {
    try {
      await regenerate();
      toast.success("Response regenerated!");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to regenerate response."));
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearChat();
      toast.success("Chat history reset.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to clear chat history."));
    }
  };

  return (
    <Card className="flex h-[620px] flex-col overflow-hidden p-0 border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-3.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 text-white shadow-sm">
            <Bot className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">AI Architect Assistant</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive architectural consultation & targeted section updates
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          loading={isClearing}
          onClick={handleClearHistory}
          className="text-xs text-red-500 hover:bg-red-500/10 dark:text-red-400"
        >
          <Trash2 className="size-3.5" />
          Clear chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5 space-y-4 dark:bg-slate-950/50">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="size-6 text-brand-500" />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onEditPrompt={handleEditPrompt}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
              />
            ))}
          </AnimatePresence>
        )}

        {isSending && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
            <Bot className="size-4 text-brand-500" />
            <span>The AI Architect is thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="border-t border-slate-200 bg-slate-100/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span>Quick architectural requests</span>
          <span>Single-section update</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_PROMPTS.map(({ label, prompt, icon: Icon }) => (
            <button
              key={label}
              type="button"
              disabled={isSending}
              onClick={() => handleSend(prompt)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
            >
              <Icon className="size-3 text-brand-500 dark:text-brand-400 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Footer */}
      <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Ask the AI Architect to add features, convert to microservices, add caching…"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            disabled={isSending}
            autoComplete="off"
            className="flex-1 border-slate-300 bg-slate-50 text-slate-900 caret-brand-500 placeholder:text-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:bg-slate-800"
          />
          <Button type="submit" disabled={!inputContent.trim() || isSending} loading={isSending}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
