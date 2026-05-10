# Capítulo 02 - Pré-requisitos

## Requisitos Gerais

| Componente | Requisito | Necessário para |
|------------|-----------|-----------------|
| **Frontend** | React + Vite ✅ | Modo Demo e Produção |
| **mockDb** | Dados de materiais/coleções | Modo Demo |
| **n8n** | Self-hosted na rede | Modo Produção |
| **PostgreSQL** | Extensão pgvector | Modo Produção |
| **API Keys** | Gemini configurado | Modo Produção |

---

## Para Modo Demo (Desenvolvimento)

### ✅ Já está pronto:

- [x] **Frontend** - Projeto React/Vite existente
- [x] **mockDb** - Dados de materiais e coleções já existem
- [x] **ChatWidget** - Componente de interface criado
- [x] **useChat** - Hook de gerenciamento de estado

### O que verificar:

1. Dados no mockDb existam (materiais e coleções)
2. Build compilando: `npm run build`
3. Servidor iniciando: `npm run dev`

---

## Para Modo Produção

### 1. n8n Self-hosted

**Requisito:** n8n rodando na mesma rede que o frontend

| Item | Descrição |
|------|-----------|
| **URL** | `http://n8n:5678` (ou IP do servidor) |
| **Webhook** | `/webhook/chat-rag` (POST) |
| **Credenciais** | API Keys configuradas |

**Instalação (se não tiver):**
```bash
# Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

---

### 2. Extensão pgvector

**Requisito:** PostgreSQL com extensão pgvector instalada

> ⚠️ **Nota:** pgvector NÃO está disponível no Supabase Free Tier. Para produção em VPS, use PostgreSQL standalone ou Supabase Pro.

**No PostgreSQL (VPS):**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

### 3. API Keys (Admin > Integrações)

Configure pelo painel Admin:

| API Key | Função | Status no chatService.ts |
|---------|--------|--------------------------|
| **Gemini** | Chatbot | Precisa estar ativa |
| **Nomic** | Embedding | Configurado no n8n |

---

## Checklist de Pré-requisitos

### Modo Demo (立即)
- [x] npm install executado
- [x] npm run build passando
- [x] npm run dev iniciando
- [x] Login funcionando

### Modo Produção
- [ ] n8n instalado e rodando
- [ ] pgvector instalado no PostgreSQL
- [ ] API Key do Gemini configurada no Admin
- [ ] Webhook do n8n configurado
- [ ] Rede entre frontend e n8n configurada

---

## Próximos Passos

- [Capítulo 03 - Migration do Banco](./03-migration-banco.md) → Script SQL
- [Capítulo 04 - Serviço de Chat](./04-servico-chat.md) → Configuração
- [Capítulo 08 - Modo Demo](./08-modo-demo.md) → Como testar agora

---

*Manual do Chatbot RAG - Conexão Hub*