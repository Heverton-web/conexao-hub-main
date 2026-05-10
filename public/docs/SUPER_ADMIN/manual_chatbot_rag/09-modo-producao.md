# Capítulo 09 - Modo Produção

## Visão Geral

O modo produção é quando o chatbot usa o n8n real para processar perguntas, buscar materiais no banco vetorizado e gerar respostas com IA.

**Pré-requisitos:**
- [x] n8n instalado e configurado
- [x] PostgreSQL com pgvector
- [x] API Key do Gemini configurada

---

## Alterações Necessárias

### 1. Mudar DEMO_MODE

**Arquivo:** `src/lib/chatService.ts`  
**Linha:** 26

```typescript
// De:
const DEMO_MODE = true;

// Para:
const DEMO_MODE = false;
```

### 2. Configurar URL do n8n

**Arquivo:** `src/lib/chatService.ts`  
**Linha:** 25

```typescript
// De:
const N8N_WEBHOOK_URL = 'http://n8n:5678/webhook/chat-rag';

// Para (ajuste conforme seu ambiente):
const N8N_WEBHOOK_URL = 'https://n8n.seu-dominio.com/webhook/chat-rag';
```

---

## Checklist de Produção

### Infraestrutura

- [ ] n8n está rodando e acessível
- [ ] PostgreSQL com extensão pgvector instalado
- [ ] Migration executada (tabelas de embeddings)
- [ ] Rede configurada (frontend consegue acessar n8n)

### APIs e Credenciais

- [ ] API Key do Gemini configurada no Admin > Integrações
- [ ] Função "Chatbot" selecionada para a API
- [ ] Toggle "Ativo" habilitado

### Frontend

- [ ] DEMO_MODE = false
- [ ] URL do webhook correta
- [ ] Build compilando sem erros

---

## Teste de Conectividade

### 1. Testar se n8n está acessível

```bash
# No terminal do servidor onde roda o frontend
curl -X GET http://n8n:5678
```

Se receber resposta HTML, o n8n está acessível.

### 2. Testar o webhook

```bash
curl -X POST http://n8n:5678/webhook/chat-rag \
  -H "Content-Type: application/json" \
  -d '{"message": "teste"}'
```

Deve retornar um JSON com a resposta.

---

## Fluxo em Produção

```
1. Usuário envia mensagem
2. chatService.ts verifica: DEMO_MODE = false
3. Envia POST para http://n8n:5678/webhook/chat-rag
4. n8n processa:
   - Gera embedding da pergunta (Nomic)
   - Busca materiais similares no banco (pgvector)
   - Envia contexto para Gemini
   - Gemini gera resposta
5. n8n retorna JSON com resposta + materiais + coleções
6. ChatWidget exibe resultado
```

---

## Configurações de Timeout

**Arquivo:** `src/lib/chatService.ts`  
**Linha:** 27

```typescript
const TIMEOUT_MS = 30000; // 30 segundos
```

Se o n8n demorar mais, o frontend mostrará erro de timeout.

Para ajustar:

```typescript
const TIMEOUT_MS = 60000; // 60 segundos (1 minuto)
```

---

## Variáveis de Ambiente (Opcional)

Você pode externalizar a configuração usando variáveis de ambiente:

**Criar arquivo `.env` na raiz:**

```env
VITE_N8N_WEBHOOK_URL=http://n8n:5678/webhook/chat-rag
VITE_DEMO_MODE=false
```

**No chatService.ts:**

```typescript
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/chat-rag';
```

---

## Voltar para Modo Demo

Se precisar voltar para o modo demo:

```typescript
// No chatService.ts
const DEMO_MODE = true;  // ← Volta para demo
```

---

## Próximos Passos

- [Capítulo 10 - Fluxo do n8n](./10-fluxo-n8n.md) → Configurar o n8n
- [Capítulo 11 - Testes](./11-testes.md) → Testar a integração completa

---

*Manual do Chatbot RAG - Conexão Hub*