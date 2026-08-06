import { motion } from "framer-motion";
import {
  Bot,
  Check,
  Copy,
  Edit2,
  RefreshCw,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ChatMessage } from "@/types";
import { timeAgo } from "@/utils/formatters";

export function ChatMessageItem({
  message,
  onEditPrompt,
  onRegenerate,
  isRegenerating,
}: {
  message: ChatMessage;
  onEditPrompt?: (content: string) => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy message");
    }
  };

  // Helper to parse code blocks or mermaid blocks inside content
  const renderMessageContent = (raw: string) => {
    const blocks: React.ReactNode[] = [];
    const lines = raw.split("\n");
    let inCodeBlock = false;
    let codeLanguage = "";
    let currentCodeBuffer: string[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Close code block
          const codeString = currentCodeBuffer.join("\n");
          if (codeLanguage === "mermaid") {
            blocks.push(
              <div
                key={`mermaid-${index}`}
                className="my-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-700/80 dark:bg-slate-900/90"
              >
                <MermaidDiagram code={codeString} />
              </div>
            );
          } else {
            blocks.push(
              <div
                key={`code-${index}`}
                className="group relative my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm dark:bg-slate-950"
              >
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-slate-300">
                  <span>{codeLanguage || "code"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(codeString);
                      toast.success("Code copied");
                    }}
                    className="cursor-pointer text-slate-400 transition-colors hover:text-white"
                  >
                    Copy
                  </button>
                </div>
                <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-slate-100">
                  {codeString}
                </pre>
              </div>
            );
          }
          currentCodeBuffer = [];
          inCodeBlock = false;
          codeLanguage = "";
        } else {
          // Open code block
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).toLowerCase();
        }
      } else if (inCodeBlock) {
        currentCodeBuffer.push(line);
      } else {
        blocks.push(
          <p key={`text-${index}`} className="min-h-[1.2rem]">
            {line}
          </p>
        );
      }
    });

    return blocks;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-brand-500 to-indigo-600"
            : "bg-gradient-to-br from-violet-500 to-emerald-500"
        }`}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </span>

      {/* Message Bubble */}
      <div
        className={`group relative max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-brand-600 text-white dark:bg-brand-600"
            : "border border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700/70 dark:bg-slate-800/95 dark:text-slate-100"
        }`}
      >
        {/* Updated Section Badge if assistant modified a blueprint section */}
        {message.updated_section ? (
          <div className="mb-2.5 flex items-center gap-1.5">
            <Badge variant="success">
              <Sparkles className="size-3" />
              Updated section: {message.updated_section}
            </Badge>
          </div>
        ) : null}

        {/* Render Content */}
        <div className="space-y-1.5 font-normal">{renderMessageContent(message.content)}</div>

        {/* Message Footer Actions */}
        <div
          className={`mt-2 flex items-center justify-between gap-2 text-[11px] opacity-80 transition-opacity group-hover:opacity-100 ${
            isUser ? "text-white/80" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <span>{timeAgo(message.created_at)}</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className={`cursor-pointer rounded p-1 transition-colors ${
                isUser
                  ? "hover:bg-white/20 text-white"
                  : "hover:bg-slate-200 text-slate-600 dark:hover:bg-slate-700 dark:text-slate-300"
              }`}
              title="Copy message"
            >
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            </button>

            {isUser && onEditPrompt ? (
              <button
                type="button"
                onClick={() => onEditPrompt(message.content)}
                className="cursor-pointer rounded p-1 text-white hover:bg-white/20 transition-colors"
                title="Edit prompt"
              >
                <Edit2 className="size-3" />
              </button>
            ) : null}

            {!isUser && onRegenerate ? (
              <Button
                variant="ghost"
                size="sm"
                loading={isRegenerating}
                onClick={onRegenerate}
                className="h-6 px-1.5 text-[10px] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                title="Regenerate response"
              >
                <RefreshCw className="size-3" />
                Regenerate
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
