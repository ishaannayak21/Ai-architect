import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import type { ChatMessage, ChatSession } from "@/types";

export function useChat(blueprintId: number | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["chat", blueprintId];

  const { data, isLoading, isError, error, refetch } = useQuery<ChatSession>({
    queryKey,
    queryFn: () => {
      if (!blueprintId) throw new Error("Blueprint ID required");
      return chatService.getChatSession(blueprintId);
    },
    enabled: Boolean(blueprintId),
    staleTime: Infinity,
  });

  const sendMutation = useMutation<ChatMessage, Error, string, { previousSession?: ChatSession }>({
    mutationFn: (content: string) => {
      if (!blueprintId) throw new Error("Blueprint ID required");
      return chatService.sendMessage(blueprintId, content);
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey });
      const previousSession = queryClient.getQueryData<ChatSession>(queryKey);

      if (previousSession) {
        const optimisticMessage: ChatMessage = {
          id: Date.now(),
          session_id: previousSession.id,
          role: "user",
          content: newContent,
          created_at: new Date().toISOString(),
        };

        queryClient.setQueryData<ChatSession>(queryKey, {
          ...previousSession,
          messages: [...previousSession.messages, optimisticMessage],
        });
      }

      return { previousSession };
    },
    onError: (_err, _newContent, context) => {
      if (context?.previousSession) {
        queryClient.setQueryData(queryKey, context.previousSession);
      }
    },
    onSuccess: (assistantMsg) => {
      queryClient.setQueryData<ChatSession>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          messages: [...old.messages, assistantMsg],
        };
      });
      // Invalidate blueprint cache if a section was updated
      if (assistantMsg.updated_section) {
        queryClient.invalidateQueries({ queryKey: ["blueprint", blueprintId] });
      }
    },
  });

  const regenerateMutation = useMutation<ChatMessage, Error, void>({
    mutationFn: () => {
      if (!blueprintId) throw new Error("Blueprint ID required");
      return chatService.regenerateResponse(blueprintId);
    },
    onSuccess: (newAssistantMsg) => {
      queryClient.invalidateQueries({ queryKey });
      if (newAssistantMsg.updated_section) {
        queryClient.invalidateQueries({ queryKey: ["blueprint", blueprintId] });
      }
    },
  });

  const clearMutation = useMutation<ChatSession, Error, void>({
    mutationFn: () => {
      if (!blueprintId) throw new Error("Blueprint ID required");
      return chatService.clearChat(blueprintId);
    },
    onSuccess: (resetSession) => {
      queryClient.setQueryData(queryKey, resetSession);
    },
  });

  return {
    session: data,
    messages: data?.messages ?? [],
    isLoading,
    isError,
    error,
    refetch,
    sendMessage: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    regenerate: regenerateMutation.mutateAsync,
    isRegenerating: regenerateMutation.isPending,
    clearChat: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
  };
}
