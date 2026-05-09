# Manual do Chatbot RAG - Conexão Hub

**Data:** 10 de Maio de 2026  
**Versão:** 1.0

---

## Objetivo

O chatbot é um assistente de IA com busca semântica que responde perguntas dos usuários indicando materiais e trilhas existentes na plataforma. Ao perguntar *"como vendo o kit ExpertGuide?"*, o sistema busca no banco de dados vetorizado e retorna os materiais relacionados com links clicáveis.

### Exemplo de Uso

**Usuário:** "como vendo o kit ExpertGuide?"

**Chatbot responde:**
> Que bom que está interessado! temos os seguintes materiais sobre isso:
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
┌────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO                                    │
│   "Como vendo o kit ExpertGuide?"                                   │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                           │
│   ChatWidget.tsx → Input → Exibe resposta + links clicáveis       │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│                    chatService.ts                                  │
│   Encaminha para n8n (http://n8n:5678/webhook/chat-rag)           │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│                         N8N (Self-hosted)                          │
│   Webhook → Nomic Embedding → Similarity → Gemini → JSON          │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│               SUPABASE (PostgreSQL + pgvector)                    │
│   materials, collections, material_embeddings, collection_emb   │
└────────────────────────────────────────────────────────────────────┘
```

---

## Pré-requisitos

| Componente | Requisito |
|------------|-----------|
| **n8n** | Self-hosted rodando na mesma rede |
| **PostgreSQL** | Extensão pgvector instalada |
| **API Keys** | Gemini configurado no Admin > Integrações |

---

## 1. Configuração do Banco de Dados (Produção)

### 1.1 Ativar pgvector

No PostgreSQL (VPS), execute:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

> **Nota:** pgvector NÃO está disponível no Supabase Free Tier. Para produção em VPS, use PostgreSQL standalone ou Supabase Pro.

### 1.2 Executar Migration

```bash
# Copiar o conteúdo de:
supabase/migrations/20260510000000_create_embeddings_setup.sql

# Executar no banco de dados de produção
psql -h localhost -U postgres -d conexao_hub -f migrations.sql
```

### 1.3 Popular Embeddings

Crie um script para vectorizar materiais existentes:

```sql
-- Exemplo: popular material_embeddings
INSERT INTO material_embeddings (material_id, embedding, content_text)
SELECT 
  id,
  gen_random_vector(768), -- placeholder, use função de embedding real
  COALESCE(title->>'pt-br', '') || ' ' || COALESCE(array_to_string(tags, ' '), '')
FROM materials 
WHERE active = true
ON CONFLICT (material_id) DO UPDATE SET
  embedding = EXCLUDED.embedding,
  content_text = EXCLUDED.content_text;
```

---

## 2. Configuração do n8n

### 2.1 Criar Workflow

1. Acesse o n8n
2. Criar novo workflow
3. Adicionar nó **Webhook** (POST)
   - Path: `chat-rag`
   - Response Mode: "Response Node"

### 2.2 Estrutura do Fluxo

```
Webhook (recebe message)
    │
    ▼
Nomic Embed Text (transforma pergunta em vetor)
    │
    ▼
PostgreSQL (similarity search)
    │
    ▼
Gemini Chat (gera resposta contextualizada)
    │
    ▼
Function (formata resposta com URLs)
    │
    ▼
Respond to Webhook
```

### 2.3 Nós Principais

#### Nó 1: Webhook
```json
{
  "method": "POST",
  "path": "chat-rag"
}
```

#### Nó 2: Nomic Embedding
- Modelo: `nomic-embed-text-v1.5`
- Input: `{{ $json.message }}`
- Output: Embedding (768 dimensões)

#### Nó 3: PostgreSQL - Similarity Search
```sql
SELECT 
  id,
  title->>'pt-br' as title,
  type,
  1 - (embedding <=> ${{ $json.embedding }}) as similarity
FROM materials
WHERE active = true
ORDER BY embedding <=> ${{ $json.embedding }}
LIMIT 5
```

#### Nó 4: Gemini Chat
- Prompt:
```
Você é um assistente da plataforma Conexão Hub. 
O usuário perguntou: {{ $json.message }}

Materiais encontrados: {{ $json.materials }}

Responda de forma amigável indicando os materiais e trilhas relevantes. 
Inclua apenas materiais com similaridade > 0.7.
Formato da resposta: texto + lista de links.
```

#### Nó 5: Function Node (Formata)
```javascript
// Formata resposta para o frontend
const materials = $json.materials.map(m => ({
  id: m.id,
  title: m.title,
  type: m.type,
  url: `/material/${m.id}`
}));

const collections = $json.collections?.map(c => ({
  id: c.id,
  title: c.title,
  url: `/collection/${c.id}`
})) || [];

return {
  answer: $json.answer,
  materials,
  collections
};
```

---

## 3. Configuração da API Key

### 3.1 No Admin > Integrações

1. Preencha a **API Key do Gemini**
2. Selecione a **Função**: `Chatbot`
3. Ative o toggle **Ativo**
4. Salve as alterações

### 3.2 Verificar configuração

O sistema verifica automaticamente as chaves ativas para a função chatbot.

---

## 4. Configuração do Frontend

### 4.1 Variável de Ambiente

No arquivo de ambiente (`.env`):

```env
VITE_N8N_WEBHOOK_URL=http://n8n:5678/webhook/chat-rag
```

### 4.2 Adicionar ChatWidget ao Dashboard

No arquivo `Dashboard.tsx`, adicione o componente:

```tsx
import { ChatWidget } from '../components/hub/ChatWidget';

// No return do componente, adicione antes do último div:
<ChatWidget />
```

---

## 5. Testes

### 5.1 Teste de Conectividade

```bash
# Testar se o n8n está acessível
curl -X POST http://n8n:5678/webhook/chat-rag \
  -H "Content-Type: application/json" \
  -d '{"message": "teste"}'
```

### 5.2 Teste de Embedding

Execute uma query direta no banco:

```sql
SELECT id, title, embedding <=> $query_embedding as distance
FROM material_embeddings
ORDER BY distance
LIMIT 5;
```

### 5.3 Teste E2E

1. Acesse a plataforma como usuário logado
2. Clique no botão "Assistente" (flutuante)
3. Digite uma pergunta sobre conteúdo existente
4. Verifique se retorna materiais com links

---

## 6. Resolução de Problemas

| Problema | Solução |
|----------|---------|
| Timeout ao enviar mensagem | Verificar se n8n está na mesma rede; aumentar timeout em chatService.ts |
| Erro "Embedding not found" | Verificar se pgvector está instalado e tabelas populadas |
| Resposta vazia | Verificar se há materiais com `active = true` no banco |
| Links não funcionam | Verificar se o campo `url` está sendo gerado corretamente no n8n |

---

## 7. Estrutura de Arquivos Criados

```
src/
├── lib/
│   └── chatService.ts        # Serviço de chamadas ao n8n
├── hooks/
│   └── useChat.ts            # Hook para gerenciar estado do chat
└── components/hub/
    └── ChatWidget.tsx        # Interface do chatbot

supabase/migrations/
└── 20260510000000_create_embeddings_setup.sql

docs/
└── manual_chatbot_rag.md     # Este documento
```

---

## 8. Próximas Melhorias

- [ ] Histórico de chat persistido no banco
- [ ] Feedback do usuário (gostei/não gostei)
- [ ] Busca em múltiplos idiomas
- [ ] Integração com documentação externa (Notion, etc)
- [ ] Chatbot via WhatsApp

---

*Documento gerado automaticamente em 2026-05-10*