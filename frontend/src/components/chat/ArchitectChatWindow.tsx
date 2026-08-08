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
    <Card className="flex h-[640px] flex-col overflow-hidden p-0 border border-[#E6DFD5] bg-[#FFFFFF] shadow-md dark:border-[#2B3D2F] dark:bg-[#1E2B21]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6DFD5] bg-[#FAF7F2] px-6 py-4 backdrop-blur-md dark:border-[#2B3D2F] dark:bg-[#141C16]">
        <div className="flex items-center gap-3.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#223829] font-bold text-white shadow-2xs border border-[#344A39]">
            <Bot className="size-5 text-[#E8F0EA]" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-base tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">AI Architect Assistant</h3>
            <p className="font-mono text-[11px] text-[#6B726C] dark:text-[#A3B5A7]">
              Interactive architectural consultation &amp; targeted section updates
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          loading={isClearing}
          onClick={handleClearHistory}
          className="font-mono text-xs text-[#C05621] hover:bg-[#FDF3EE] hover:text-[#A8481A] dark:text-[#E07A48] dark:hover:bg-[#331C13]"
        >
          <Trash2 className="size-3.5" />
          Clear Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#F8F5EE]/70 p-6 space-y-4 dark:bg-[#141C16]/70">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="size-6 text-[#C05621]" />
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
          <div className="flex items-center gap-3 font-mono text-xs text-[#6B726C] dark:text-[#A3B5A7] animate-pulse">
            <Bot className="size-4 text-[#C05621]" />
            <span>The AI Architect is thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="border-t border-[#E6DFD5] bg-[#FAF7F2] px-5 py-3 dark:border-[#2B3D2F] dark:bg-[#1A241C]">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6B726C] dark:text-[#A3B5A7]">
          <span>ARCHITECTURAL PROMPTS</span>
          <span>SELECT REQUEST</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_PROMPTS.map(({ label, prompt, icon: Icon }) => (
            <button
              key={label}
              type="button"
              disabled={isSending}
              onClick={() => handleSend(prompt)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E6DFD5] bg-[#FFFFFF] px-3.5 py-1.5 font-sans text-xs font-medium text-[#1F2421] transition-all hover:border-[#C05621] hover:bg-[#FDF3EE] hover:text-[#C05621] dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:text-[#E6ECE7] dark:hover:border-[#E07A48] dark:hover:bg-[#331C13] dark:hover:text-[#E07A48]"
            >
              <Icon className="size-3.5 text-[#C05621] dark:text-[#E07A48] shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Footer */}
      <div className="border-t border-[#E6DFD5] bg-[#FFFFFF] p-4 dark:border-[#2B3D2F] dark:bg-[#1E2B21]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <Input
            placeholder="Ask the AI Architect to add features, convert to microservices, add caching…"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            disabled={isSending}
            autoComplete="off"
            className="flex-1 font-sans text-sm text-[#1F2421] placeholder:text-[#9A9287] dark:text-[#E6ECE7] dark:placeholder:text-[#6B726C]"
          />
          <Button type="submit" disabled={!inputContent.trim() || isSending} loading={isSending}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
