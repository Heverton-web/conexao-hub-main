# Capítulo 01 - Visão Geral do Chatbot RAG

## Objetivo do Chatbot

O Chatbot RAG (Retrieval-Augmented Generation) é um assistente de IA que ajuda os usuários a encontrar materiais e trilhas na plataforma Conexão Hub através de perguntas em linguagem natural.

### Exemplo de Uso

**Usuário pergunta:** *"como vendo o kit expertguide?"*

**Chatbot responde:**
> Que bom que está interessado! Temos os seguintes materiais sobre isso:
> 
> **Materiais:**
> - Kit ExpertGuide - Guia Completo (PDF) → [Acessar](/material/xxx)
> - Marketing para Implantes (Vídeo) → [Acessar](/material/yyy)
> 
> **Trilhas:**
> - Trilha Marketing Dental → [Acessar](/collection/zzz)

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                              USUÁRIO                                 │
│   "Como vendo o kit ExpertGuide?"                                    │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                           │
│                                                                       │
│   ┌─────────────┐    ┌─────────────┐    ┌──────────────────────┐   │
│   │ ChatWidget  │───▶│  useChat    │───▶│   chatService.ts     │   │
│   │   (UI)      │    │  (Hook)     │    │   (Lógica + Mock)    │   │
│   └─────────────┘    └─────────────┘    └──────────────────────┘   │
│           │                                      │                   │
│           │                              (Modo Demo: true)          │
│           │                                      │                   │
│           │                              ┌───────▼───────┐           │
│           │                              │  mockDb.ts   │           │
│           │                              │  (dados)     │           │
│           │                              └──────────────┘           │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │
                                   ▼ (quando DEMO_MODE = false)
┌─────────────────────────────────────────────────────────────────────┐
│                         N8N (Self-hosted)                           │
│                                                                       │
│   Webhook → Embedding (Nomic) → Similarity Search → Gemini → JSON  │
│                                                                       │
│   http://n8n:5678/webhook/chat-rag                                   │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 SUPABASE (PostgreSQL + pgvector)                   │
│                                                                       │
│   materials (title, tags)                                           │
│   collections (title, tags)                                         │
│   material_embeddings (vector) ←── busca semântica                 │
│   collection_embeddings (vector)                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados

### Modo Desenvolvimento (DEMO_MODE = true)

1. **Usuário** digita uma pergunta no ChatWidget
2. **useChat** hook gerencia o estado (mensagens, loading, erro)
3. **chatService.ts** recebe a mensagem
4. Verifica se está em modo demo
5. Busca materiais/coleções no **mockDb** (dados locais)
6. Retorna resposta formatada com links clicáveis
7. **ChatWidget** exibe a resposta

### Modo Produção (DEMO_MODE = false)

1. **Usuário** digita uma pergunta no ChatWidget
2. **useChat** hook gerencia o estado
3. **chatService.ts** envía a pergunta para o **webhook do n8n**
4. **n8n** processa:
   - Gera embedding da pergunta (Nomic)
   - Busca materiais similares no banco vetorizado (pgvector)
   - Envia contexto para o Gemini gerar resposta
5. **n8n** retorna JSON com resposta + materiais + coleções
6. **ChatWidget** exibe a resposta com links

---

## Modos de Operação

| Modo | Descrição | Quando usar |
|------|-----------|-------------|
| **Demo** | Busca local no mockDb | Desenvolvimento |
| **Produção** | Chama n8n real | Deploy em produção |

A chave `DEMO_MODE` em `chatService.ts` controla qual modo é usado.

---

## Próximos Passos

- [Capítulo 02 - Pré-requisitos](./02-pre-requisitos.md) → O que precisa configurar
- [Capítulo 08 - Modo Demo](./08-modo-demo.md) → Como testar agora

---

*Manual do Chatbot RAG - Conexão Hub*