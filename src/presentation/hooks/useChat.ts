import { useState, useCallback } from 'react';
import {
  sendChatMessage,
  createUserMessage,
  createAssistantMessage,
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
  ChatMessage,
  ChatResponse,
} from '../../infrastructure/external/chatService';
import { useAuth } from '@/presentation/contexts/AuthContext';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export function useChat(): UseChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg = createUserMessage(content);
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setError(null);
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(content, user?.id);
      const assistantMsg = createAssistantMessage(response);
      
      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, user]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    clearChatHistory();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}