import { apiClient } from "@/api/client";
import type { ChatMessage, ChatSession } from "@/types";

export const getChatSessionApi = async (blueprintId: number): Promise<ChatSession> => {
  try {
    const response = await apiClient.get<ChatSession>(`/blueprints/${blueprintId}/chat`);
    return response.data;
  } catch {
    const response = await apiClient.get<ChatSession>(`/projects/${blueprintId}/chat`);
    return response.data;
  }
};

export const sendChatMessageApi = async (blueprintId: number, content: string): Promise<ChatMessage> => {
  try {
    const response = await apiClient.post<ChatMessage>(`/blueprints/${blueprintId}/chat/messages`, { content });
    return response.data;
  } catch {
    const response = await apiClient.post<ChatMessage>(`/projects/${blueprintId}/chat/messages`, { content });
    return response.data;
  }
};

export const regenerateChatApi = async (blueprintId: number): Promise<ChatMessage> => {
  try {
    const response = await apiClient.post<ChatMessage>(`/blueprints/${blueprintId}/chat/regenerate`);
    return response.data;
  } catch {
    const response = await apiClient.post<ChatMessage>(`/projects/${blueprintId}/chat/regenerate`);
    return response.data;
  }
};

export const clearChatApi = async (blueprintId: number): Promise<ChatSession> => {
  try {
    const response = await apiClient.delete<ChatSession>(`/blueprints/${blueprintId}/chat`);
    return response.data;
  } catch {
    const response = await apiClient.delete<ChatSession>(`/projects/${blueprintId}/chat`);
    return response.data;
  }
};
