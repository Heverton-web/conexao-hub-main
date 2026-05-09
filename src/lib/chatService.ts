import { supabase } from './supabaseClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  materials?: ChatResult[];
  collections?: ChatResult[];
}

export interface ChatResult {
  id: string;
  title: string;
  type: 'material' | 'collection';
  url: string;
  icon?: string;
}

export interface ChatResponse {
  answer: string;
  materials: ChatResult[];
  collections: ChatResult[];
}

const N8N_WEBHOOK_URL = 'http://n8n:5678/webhook/chat-rag';
const TIMEOUT_MS = 30000;

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro do n8n: ${response.status}`);
    }

    const data = await response.json();
    return {
      answer: data.answer || 'Desculpe, não consegui processar sua mensagem.',
      materials: data.materials || [],
      collections: data.collections || [],
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tempo limite excedido. Tente novamente.');
    }
    
    console.error('Chat error:', error);
    throw new Error('Falha ao conectar com o assistente. Tente novamente.');
  }
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
}

export function createAssistantMessage(response: ChatResponse): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: response.answer,
    timestamp: new Date().toISOString(),
    materials: response.materials,
    collections: response.collections,
  };
}

const CHAT_HISTORY_KEY = 'conexao_hub_chat_history';

export function saveChatHistory(messages: ChatMessage[]): void {
  const limited = messages.slice(-50);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limited));
}

export function loadChatHistory(): ChatMessage[] {
  const stored = localStorage.getItem(CHAT_HISTORY_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearChatHistory(): void {
  localStorage.removeItem(CHAT_HISTORY_KEY);
}