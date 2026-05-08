import { mockDb } from './mockDb';
import { AIFunction, SystemIntegrations } from '../types';

interface AIProvider {
  name: string;
  apiKey: string;
}

async function getActiveProvider(functionType: AIFunction): Promise<AIProvider | null> {
  const integrations = await mockDb.getSystemIntegrations();

  const providers: { key: keyof SystemIntegrations; functionKey: keyof SystemIntegrations; activeKey: keyof SystemIntegrations }[] = [
    { key: 'geminiApiKey', functionKey: 'geminiFunction', activeKey: 'geminiActive' },
    { key: 'openaiApiKey', functionKey: 'openaiFunction', activeKey: 'openaiActive' },
    { key: 'groqApiKey', functionKey: 'groqFunction', activeKey: 'groqActive' },
    { key: 'openrouterApiKey', functionKey: 'openrouterFunction', activeKey: 'openrouterActive' },
  ];

  for (const provider of providers) {
    const apiKey = integrations[provider.key] as string | undefined;
    const functionAssigned = integrations[provider.functionKey] as AIFunction | undefined;
    const isActive = integrations[provider.activeKey] as boolean | undefined;

    if (apiKey && functionAssigned === functionType && isActive) {
      const providerName = provider.key.replace('ApiKey', '').replace('openrouter', 'openrouter');
      return {
        name: providerName,
        apiKey,
      };
    }
  }

  return null;
}

export interface TranslationResult {
  success: boolean;
  translatedText?: string;
  error?: string;
}

export async function translateText(text: string, targetLang: 'en' | 'es' = 'en'): Promise<TranslationResult> {
  try {
    const provider = await getActiveProvider('translate');

    if (!provider) {
      return { success: false, error: 'Nenhum provedor de tradução configurado ou ativo' };
    }

    const langMap = { en: 'inglês', es: 'espanhol' };
    const prompt = `Traduza o seguinte texto para ${langMap[targetLang]}. Retorne apenas a tradução, sem comentários:\n\n${text}`;

    let response: Response;

    if (provider.name === 'gemini') {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${provider.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
        }),
      });

      const data = await response.json();
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (translatedText) {
        return { success: true, translatedText };
      }
      return { success: false, error: 'Resposta inválida do Gemini' };
    }

    if (provider.name === 'openai' || provider.name === 'openrouter') {
      const baseUrl = provider.name === 'openrouter' 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';

      const model = provider.name === 'openrouter' ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo';

      response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          ...(provider.name === 'openrouter' ? { 'HTTP-Referer': window.location.origin, 'X-Title': 'Conexao Hub' } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const translatedText = data.choices?.[0]?.message?.content;

      if (translatedText) {
        return { success: true, translatedText };
      }
      return { success: false, error: data.error?.message || 'Erro na tradução' };
    }

    if (provider.name === 'groq') {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const translatedText = data.choices?.[0]?.message?.content;

      if (translatedText) {
        return { success: true, translatedText };
      }
      return { success: false, error: data.error?.message || 'Erro na tradução' };
    }

    return { success: false, error: 'Provedor não suportado' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao traduzir' };
  }
}

export interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function generateImage(prompt: string): Promise<ImageGenerationResult> {
  try {
    const provider = await getActiveProvider('image');

    if (!provider) {
      return { success: false, error: 'Nenhum provedor de geração de imagens configurado ou ativo' };
    }

    if (provider.name === 'openai' || provider.name === 'openrouter') {
      const baseUrl = provider.name === 'openrouter'
        ? 'https://openrouter.ai/api/v1/images/generation'
        : 'https://api.openai.com/v1/images/generations';

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          ...(provider.name === 'openrouter' ? { 'HTTP-Referer': window.location.origin, 'X-Title': 'Conexao Hub' } : {}),
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        }),
      });

      const data = await response.json();
      const imageUrl = data.data?.[0]?.url;

      if (imageUrl) {
        return { success: true, imageUrl };
      }
      return { success: false, error: data.error?.message || 'Erro ao gerar imagem' };
    }

    return { success: false, error: 'Apenas OpenAI suporta geração de imagens no momento' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao gerar imagem' };
  }
}

export interface SummarizeResult {
  success: boolean;
  summary?: string;
  error?: string;
}

export async function summarizeText(text: string): Promise<SummarizeResult> {
  try {
    const provider = await getActiveProvider('summarize');

    if (!provider) {
      return { success: false, error: 'Nenhum provedor de resumo configurado ou ativo' };
    }

    const prompt = `Resuma o seguinte texto em português brasileiro de forma clara e objetiva (máximo 3 parágrafos):\n\n${text}`;

    let response: Response;

    if (provider.name === 'gemini') {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${provider.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
        }),
      });

      const data = await response.json();
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (summary) {
        return { success: true, summary };
      }
      return { success: false, error: 'Resposta inválida do Gemini' };
    }

    if (provider.name === 'openai' || provider.name === 'openrouter') {
      const baseUrl = provider.name === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';

      const model = provider.name === 'openrouter' ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo';

      response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          ...(provider.name === 'openrouter' ? { 'HTTP-Referer': window.location.origin, 'X-Title': 'Conexao Hub' } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content;

      if (summary) {
        return { success: true, summary };
      }
      return { success: false, error: data.error?.message || 'Erro ao resumir' };
    }

    if (provider.name === 'groq') {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content;

      if (summary) {
        return { success: true, summary };
      }
      return { success: false, error: data.error?.message || 'Erro ao resumir' };
    }

    return { success: false, error: 'Provedor não suportado' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao resumir' };
  }
}

export interface ChatResult {
  success: boolean;
  response?: string;
  error?: string;
}

export async function chatWithAI(message: string, context?: string): Promise<ChatResult> {
  try {
    const provider = await getActiveProvider('chatbot');

    if (!provider) {
      return { success: false, error: 'Nenhum provedor de chatbot configurado ou ativo' };
    }

    let systemPrompt = 'Você é um assistente útil e amigável do sistema Conexão Hub. Responda em português brasileiro de forma clara e concisa.';
    
    if (context) {
      systemPrompt += `\n\nContexto adicional: ${context}`;
    }

    let response: Response;

    if (provider.name === 'gemini') {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${provider.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUsuário: ${message}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponse) {
        return { success: true, response: aiResponse };
      }
      return { success: false, error: 'Resposta inválida do Gemini' };
    }

    if (provider.name === 'openai' || provider.name === 'openrouter') {
      const baseUrl = provider.name === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';

      const model = provider.name === 'openrouter' ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo';

      response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          ...(provider.name === 'openrouter' ? { 'HTTP-Referer': window.location.origin, 'X-Title': 'Conexao Hub' } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (aiResponse) {
        return { success: true, response: aiResponse };
      }
      return { success: false, error: data.error?.message || 'Erro no chatbot' };
    }

    if (provider.name === 'groq') {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (aiResponse) {
        return { success: true, response: aiResponse };
      }
      return { success: false, error: data.error?.message || 'Erro no chatbot' };
    }

    return { success: false, error: 'Provedor não suportado' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro no chatbot' };
  }
}