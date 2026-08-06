import {
  clearChatApi,
  getChatSessionApi,
  regenerateChatApi,
  sendChatMessageApi,
} from "@/api/chat";
import type { ChatMessage, ChatSession } from "@/types";

export const chatService = {
  getChatSession: (blueprintId: number): Promise<ChatSession> =>
    getChatSessionApi(blueprintId),
  sendMessage: (blueprintId: number, content: string): Promise<ChatMessage> =>
    sendChatMessageApi(blueprintId, content),
  regenerateResponse: (blueprintId: number): Promise<ChatMessage> =>
    regenerateChatApi(blueprintId),
  clearChat: (blueprintId: number): Promise<ChatSession> =>
    clearChatApi(blueprintId),
};
