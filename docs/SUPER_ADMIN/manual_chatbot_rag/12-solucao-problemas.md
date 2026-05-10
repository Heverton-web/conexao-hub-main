# Capítulo 12 - Solução de Problemas

## Problemas Comuns e Soluções

---

## Frontend

### Problema: ChatWidget não aparece

**Sintomas:** Botão "Assistente" não visível no Dashboard

**Possíveis causas:**
1. Import não foi adicionado no Dashboard.tsx
2. Build com erro

**Solução:**
```bash
# Verificar se o import existe no Dashboard.tsx
grep "ChatWidget" src/pages/Dashboard.tsx

# Verificar erros de build
npm run build
```

---

### Problema: Botão aparece mas não abre

**Sintomas:** Clique no botão não abre o chat

**Possíveis causas:**
1. Estado `isOpen` não está funcionando
2. Erro no componente

**Solução:**
```bash
# Verificar console do navegador (F12)
# Procure por erros JavaScript
```

---

### Problema: Mensagem não envia

**Sintomas:** Enter não envia, botão enviar não responde

**Possíveis causas:**
1. `isLoading` está como true
2. Input vazio

**Solução:**
```javascript
// No ChatWidget, verificar:
if (!inputValue.trim() || isLoading) return;
```

---

## chatService.ts

### Problema: "Modo demo não está funcionando"

**Sintomas:** Não retorna resultados no modo demo

**Verificar:**
```typescript
// No chatService.ts, linha 26
const DEMO_MODE = true; // Deve ser true
```

**Solução:**
```typescript
// Forçar modo demo
const DEMO_MODE = true;
```

---

### Problema: Timeout ao chamar n8n

**Sintomas:** "Tempo limite excedido"

**Possíveis causas:**
1. n8n não está acessível
2. URL incorreta
3. Rede/firewall bloqueando

**Solução:**
```bash
# Testar conectividade
curl -X POST http://n8n:5678/webhook/chat-rag \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Aumentar timeout no chatService.ts
const TIMEOUT_MS = 60000; // 60 segundos
```

---

### Problema: "Falha ao conectar"

**Sintomas:** Erro de rede

**Verificar:**
1. URL do webhook está correta?
2. n8n está rodando?
3. Firewall permite a conexão?

**Solução:**
```typescript
// Verificar URL
const N8N_WEBHOOK_URL = 'http://IP-DO-SERVIDOR:5678/webhook/chat-rag';
```

---

## useChat

### Problema: Histórico não carrega

**Sintomas:** Histórico não aparece ao recarregar página

**Verificar:**
```javascript
// No browser console
localStorage.getItem('conexao_hub_chat_history');
```

**Solução:**
```javascript
// Limpar histórico corrompido
localStorage.removeItem('conexao_hub_chat_history');
```

---

### Problema: Loop de mensagens duplicadas

**Sintomas:** Mensagens aparecem duplicadas

**Verificar:**
```typescript
// No hook useChat
useEffect(() => {
  // Verificar se há lógica de mensagens duplicadas
}, [messages]);
```

---

## n8n (Modo Produção)

### Problema: Webhook não é executado

**Sintomas:** Requisição chega mas workflow não inicia

**Verificar:**
1. Webhook está ativo?
2. Credentials estão configuradas?
3. Workflow está ativo?

**Solução:**
1. No n8n, verificar se o webhook está "Active"
2. Verificar logs do nó Trigger

---

### Problema:Embedding falha

**Sintomas:** Erro no nó de embedding

**Verificar:**
1. API Key está configurada?
2. Modelo está disponível?

**Solução:**
- Verificar credenciais do nó OpenAI/Nomic
- Verificar se o modelo existe

---

### Problema: Busca retorna vazio

**Sintomas:** PostgreSQL retorna array vazio

**Verificar:**
```sql
-- Executar query diretamente no banco
SELECT * FROM materials WHERE active = true;
SELECT * FROM material_embeddings;
```

**Solução:**
1. Verificar se há materiais com `active = true`
2. Popular a tabela de embeddings

---

### Problema: Gemini retorna erro

**Sintomas:** Nó do Gemini falha

**Verificar:**
1. API Key do Gemini está correta?
2. Limite de quota?

**Solução:**
- Verificar quota na Google Cloud Console
- Usar modelo mais simples (gemini-1.5-flash)

---

##Banco de Dados

### Problema: Tabelas não existem

**Sintomas:** Erro "relation does not exist"

**Solução:**
```bash
# Executar migration
psql -h localhost -U postgres -d conexao_hub -f supabase/migrations/20260510000000_create_embeddings_setup.sql
```

---

### Problema: pgvector não existe

**Sintomas:** "extension 'vector' not found"

**Solução:**
```sql
-- No PostgreSQL (produção)
CREATE EXTENSION IF NOT EXISTS vector;
```

> ⚠️ pgvector não está disponível no Supabase Free Tier

---

## Checklist de Debug

| Passo | Ação |
|-------|------|
| 1 | Verificar console do navegador (F12) |
| 2 | Verificar erros no terminal (`npm run dev`) |
| 3 | Testar com `DEMO_MODE = true` primeiro |
| 4 | Verificar se dados existem no mockDb |
| 5 | Se produção, testar n8n isoladamente |

---

## Próximos Passos

- [Capítulo 13 - Atualizações Futuras](./13-atualizacoes-futuras.md) → Próximas melhorias

---

*Manual do Chatbot RAG - Conexão Hub*