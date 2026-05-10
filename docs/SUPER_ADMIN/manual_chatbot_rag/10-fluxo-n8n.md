# Capítulo 10 - Fluxo do n8n

## Visão Geral

Este capítulo descreve o workflow que deve ser configurado no n8n para processar as mensagens do chatbot. O workflow completo está disponível em `docs/n8n-workflow-chat-rag.json` para importação.

---

## Estrutura do Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         N8N WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐     ┌──────────────┐     ┌────────────────────┐    │
│  │ Webhook │────▶│  Embedding    │────▶│  PostgreSQL Search │    │
│  │ Trigger │     │  (Nomic)      │     │  (pgvector)        │    │
│  └──────────┘     └──────────────┘     └────────────────────┘    │
│       │                                         │                 │
│       │                                         ▼                 │
│       │                              ┌────────────────────┐       │
│       │                              │  Gemini Chat       │       │
│       │                              │  (Geração)         │       │
│       │                              └────────────────────┘       │
│       │                                         │                 │
│       ▼                                         ▼                 │
│  ┌──────────────┐                   ┌────────────────────┐       │
│  │   Respond    │◀───────────────────│  Function Node     │       │
│  │   to         │                   │  (Formatação)      │       │
│  │   Webhook   │                   └────────────────────┘       │
│  └──────────────┘                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Nós do Workflow

### 1. Webhook Trigger

| Campo | Valor |
|-------|-------|
| **HTTP Method** | POST |
| **Path** | `chat-rag` |
| **Response Mode** | "Response Node" |

**Recebe:**
```json
{
  "message": "Como funciona o marketing?",
  "timestamp": "2026-05-10T12:00:00Z"
}
```

---

### 2. Nomic Embedding Node

| Campo | Valor |
|-------|-------|
| **Provider** | OpenAI (ou compatible) |
| **Model** | `nomic-embed-text-v1.5` |
| **Input** | `{{ $json.message }}` |

**Saída:**
```json
{
  "embedding": [0.123, -0.456, 0.789, ...]
}
```

> ⚠️ O modelo `nomic-embed-text-v1.5` produz vetores de 768 dimensões.

---

### 3. PostgreSQL Search Node

| Campo | Valor |
|-------|-------|
| **Operation** | Execute Query |
| **Query** | Ver abaixo |

**Query:**
```sql
SELECT 
  id, 
  title->>'pt-br' as title, 
  type,
  1 - (embedding <=> $1) as similarity
FROM materials 
WHERE active = true 
ORDER BY embedding <=> $1 
LIMIT 5;
```

> **Nota:** `$1` é o parâmetro passado com o embedding.

---

### 4. Gemini Chat Node

| Campo | Valor |
|-------|-------|
| **Model** | `gemini-2.0-flash` |
| **Messages** | Ver abaixo |

**Prompt do sistema:**
```
Você é um assistente da plataforma Conexão Hub. 
O usuário perguntou: {{ $json.message }}

Materiais encontrados: {{ $json.materials }}

Responda de forma amigável indicando os materiais e trilhas relevantes. 
Inclua apenas materiais com similaridade > 0.7.
Formato da resposta: texto + lista de links clicáveis.
```

---

### 5. Function Node (Formatação)

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

### 6. Respond to Webhook

| Campo | Valor |
|-------|-------|
| **Respond With** | JSON |
| **Response Body** | Saída do Function Node |

---

## Formato da Resposta

O n8n retorna ao frontend:

```json
{
  "answer": "Encontrei materiais sobre marketing...",
  "materials": [
    {
      "id": "abc-123",
      "title": "Guia de Marketing Digital",
      "type": "pdf",
      "url": "/material/abc-123"
    }
  ],
  "collections": [
    {
      "id": "xyz-789",
      "title": "Trilha Marketing",
      "url": "/collection/xyz-789"
    }
  ]
}
```

---

## Importar o Workflow

1. Acesse o n8n
2. Vá em **Workflows** → **Import from File**
3. Selecione `docs/n8n-workflow-chat-rag.json`
4. Configure as credenciais necessárias

---

## Configurar Credenciais

### 1. PostgreSQL

- Host: `localhost` (ou IP do servidor)
- Database: `conexao_hub`
- User: `postgres`
- Password: (sua senha)

### 2. OpenAI/Nomic

- API Key: (sua chave)

### 3. Gemini

- API Key: (sua chave do Gemini)

---

## Testar o Workflow

1. No n8n, clique em **Test Workflow**
2. Envie uma requisição POST:
```bash
curl -X POST http://n8n:5678/webhook/chat-rag \
  -H "Content-Type: application/json" \
  -d '{"message": "marketing"}'
```

3. Verifique se retorna a resposta formatada

---

## Resolução de Problemas do n8n

| Problema | Solução |
|----------|---------|
| "Connection refused" | Verificar se n8n está rodando |
| "Embedding failed" | Verificar credenciais da API |
| "No results" | Verificar se tabelas de embeddings estão populadas |
| Timeout | Aumentar timeout no nó ou verificar performance |

---

## Próximos Passos

- [Capítulo 11 - Testes](./11-testes.md) → Testar integração completa
- [Capítulo 12 - Solução de Problemas](./12-solucao-problemas.md) → Troubleshooting

---

*Manual do Chatbot RAG - Conexão Hub*