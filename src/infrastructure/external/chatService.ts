import { supabase } from './supabaseClient';
import { mockDb } from './mockDb';
import { Role, Material, Collection } from '../../../shared/types/types';

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

export interface ChatbotConfig {
  enabled: boolean;
  webhookUrl: string;
  allowedRoles: string[];
}

const TIMEOUT_MS = 30000;

// Cache da configuração do chatbot
let cachedConfig: ChatbotConfig | null = null;
let configLoaded = false;

export async function getChatbotConfig(): Promise<ChatbotConfig> {
  if (configLoaded && cachedConfig) {
    return cachedConfig;
  }
  
  try {
    const config = await mockDb.getChatbotConfig();
    cachedConfig = config;
    configLoaded = true;
    return config;
  } catch (error) {
    console.error('Erro ao carregar config do chatbot:', error);
    return { enabled: false, webhookUrl: '', allowedRoles: ['client', 'distributor', 'consultant', 'manager'] };
  }
}

export async function isChatbotEnabledForRole(role: string): Promise<boolean> {
  const config = await getChatbotConfig();
  return config.enabled && config.allowedRoles.includes(role);
}

const GREETING_RESPONSES = [
  "Olá! Sou o assistente da plataforma. Posso ajudá-lo a encontrar materiais e trilhas. Sobre qual assunto gostaria de saber mais?",
  "Bem-vindo ao assistente IA! Digite o que procura e eu encontrei materiais relacionados na plataforma.",
  "Olá! Estou aqui para ajudar. Pergunte sobre qualquer tema dos nossos materiais ou trilhas.",
];

const NO_RESULTS_RESPONSES = [
  "Não encontrei materiais específicos sobre isso no momento. Que tal tentar outro termo? Posso ajudar com temas como marketing, vendas, produtos, ou perguntar sobre algo específico.",
  "Hmm, não tenho registros sobre isso. Experimente buscar por palavras-chave como 'kit', 'marketing', 'vendas' ou 'produtos'.",
  "Não encontrei resultados para essa busca. Tente términos como: vídeos, PDFs, marketing, ou explore nossas trilhas!",
];

const DEMO_RESPONSES: Record<string, string> = {
  'kit': "Encontrei materiais sobre kits! Aqui estão as opções disponíveis na plataforma:",
  'expert': "Aqui está o que tenho sobre o tema:",
  'guide': "Encontrei materiais relacionados!",
  'marketing': "Temos ótimos materiais de marketing! Veja as opções:",
  'venda': "Aqui estão os materiais sobre vendas:",
  'vender': "Aqui estão os materiais sobre vendas:",
  'produto': "Encontrei materiais sobre produtos!",
  'vídeo': "Aqui estão os materiais em vídeo:",
  'video': "Aqui estão os materiais em vídeo:",
  'pdf': "Encontrei materiais em PDF!",
  'imagem': "Encontrei materiais com imagens!",
  'implante': "Sobre implantes dentários, encontrei:",
  'dentista': "Materiais para dentistas:",
  'odontologia': "Materiais de odontologia:",
  'curso': "Aqui estão os cursos disponíveis:",
  'trilha': "Aqui estão as trilhas disponíveis:",
  'coleção': "Aqui estão as coleções disponíveis:",
  'collection': "Aqui estão as coleções disponíveis:",
};

async function searchMockMaterials(query: string, role: Role): Promise<{ materials: Material[]; collections: Collection[] }> {
  const materials = await mockDb.getMaterials(role);
  const collections = await mockDb.getCollections(role);
  
  const queryLower = query.toLowerCase();
  
  const matchedMaterials = materials.filter(mat => {
    const title = Object.values(mat.title).join(' ').toLowerCase();
    const tags = mat.tags.join(' ').toLowerCase();
    return title.includes(queryLower) || tags.includes(queryLower);
  }).slice(0, 5);
  
  const matchedCollections = collections.filter(col => {
    const title = Object.values(col.title).join(' ').toLowerCase();
    const tags = col.tags?.join(' ').toLowerCase() || '';
    return title.includes(queryLower) || tags.includes(queryLower);
  }).slice(0, 3);
  
  return { materials: matchedMaterials, collections: matchedCollections };
}

function formatChatResult(mat: Material, lang: string): ChatResult {
  const title = mat.title[lang as keyof typeof mat.title] || mat.title['pt-br'] || Object.values(mat.title)[0] || 'Material';
  
  return {
    id: mat.id,
    title,
    type: 'material',
    url: `/material/${mat.id}`,
    icon: mat.type,
  };
}

function formatCollectionResult(col: Collection, lang: string): ChatResult {
  const title = col.title[lang as keyof typeof col.title] || col.title['pt-br'] || Object.values(col.title)[0] || 'Coleção';
  
  return {
    id: col.id,
    title,
    type: 'collection',
    url: `/collection/${col.id}`,
  };
}

function getDemoResponse(query: string): string | null {
  const queryLower = query.toLowerCase();
  
  for (const [keyword, response] of Object.entries(DEMO_RESPONSES)) {
    if (queryLower.includes(keyword)) {
      return response;
    }
  }
  
  return null;
}

function getRandomGreeting(): string {
  return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
}

function getRandomNoResults(): string {
  return NO_RESULTS_RESPONSES[Math.floor(Math.random() * NO_RESULTS_RESPONSES.length)];
}

async function demoChatMessage(message: string): Promise<ChatResponse> {
  const greetingKeywords = ['oi', 'olá', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite', 'help', 'ajuda', 'começar', 'iniciar'];
  const isGreeting = greetingKeywords.some(k => message.toLowerCase().includes(k));
  
  if (isGreeting) {
    return {
      answer: getRandomGreeting(),
      materials: [],
      collections: [],
    };
  }
  
  const { materials, collections } = await searchMockMaterials(message, 'client');
  
  if (materials.length === 0 && collections.length === 0) {
    return {
      answer: getRandomNoResults(),
      materials: [],
      collections: [],
    };
  }
  
  const demoResponse = getDemoResponse(message) || "Encontrei os seguintes materiais na plataforma:";
  
  const formattedMaterials = materials.map(m => formatChatResult(m, 'pt-br'));
  const formattedCollections = collections.map(c => formatCollectionResult(c, 'pt-br'));
  
  return {
    answer: demoResponse,
    materials: formattedMaterials,
    collections: formattedCollections,
  };
}

export async function sendChatMessage(message: string, userId?: string): Promise<ChatResponse> {
  const config = await getChatbotConfig();
  
  // Se não está habilitado, retorna erro
  if (!config.enabled) {
    throw new Error('Chatbot está desabilitado');
  }
  
  // Se não tem webhook configurado, usa modo demo
  const useDemoMode = !config.webhookUrl || config.webhookUrl.trim() === '';
  
  if (useDemoMode) {
    console.log('[Chat Demo Mode] Processing message:', message);
    const result = await demoChatMessage(message);
    
    // Log da conversa em modo demo também (para métricas)
    if (userId) {
      await mockDb.saveChatLog({
        userId,
        message,
        response: result.answer,
        materialsFound: result.materials.length,
        collectionsFound: result.collections.length,
      });
    }
    
    return result;
  }
  
  // Modo produção: usar webhook do n8n
  const webhookUrl = config.webhookUrl;
  console.log('[Chat Production Mode] Using webhook:', webhookUrl);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
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
    const result = {
      answer: data.answer || 'Desculpe, não consegui processar sua mensagem.',
      materials: data.materials || [],
      collections: data.collections || [],
    };
    
    // Log da conversa
    if (userId) {
      await mockDb.saveChatLog({
        userId,
        message,
        response: result.answer,
        materialsFound: result.materials.length,
        collectionsFound: result.collections.length,
      });
    }
    
    return result;
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