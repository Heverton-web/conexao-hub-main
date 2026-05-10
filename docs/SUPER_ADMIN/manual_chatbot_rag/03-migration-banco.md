# Capítulo 03 - Migration do Banco de Dados

## Visão Geral

Este capítulo contém o script SQL completo para criar as tabelas e funções necessárias para o sistema de embeddings do Chatbot RAG.

**Arquivo original:** `supabase/migrations/20260510000000_create_embeddings_setup.sql`

---

## Script SQL Completo

```sql
-- =============================================
-- EMBEDDINGS SETUP PARA CHATBOT RAG
-- Data: 2026-05-10
-- Objetivo: Vectorizar materials e collections para busca semântica
-- =============================================

-- ATENÇÃO: Esta migration requer extensão pgvector
-- No Supabase Free Tier, pgvector NÃO está disponível
-- Para produção (VPS), use: CREATE EXTENSION IF NOT EXISTS vector;

-- TABELA: material_embeddings
-- Armazena vetores de embedding para materials (title + tags)
CREATE TABLE IF NOT EXISTS material_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  embedding vector(768) NOT NULL, -- 768 dimensões para Nomic Embedding
  content_text TEXT NOT NULL, -- Texto original para debug/visualização
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(material_id)
);

-- TABELA: collection_embeddings
-- Armazena vetores de embedding para collections (trilhas)
CREATE TABLE IF NOT EXISTS collection_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  embedding vector(768) NOT NULL,
  content_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(collection_id)
);

-- ÍNDICE: Busca por similaridade (IVFFlat para performance)
-- Usar vector_cosine_ops para similaridade por coseno
CREATE INDEX IF NOT EXISTS idx_material_embeddings_vector 
  ON material_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_collection_embeddings_vector 
  ON collection_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- FUNÇÃO: Vectorizar material
-- Recebe título (JSONB) e tags, retorna texto para embedding
CREATE OR REPLACE FUNCTION get_material_text_for_embedding(m material)
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(m.title->>'pt-br', '') || ' ' ||
    COALESCE(m.title->>'en-us', '') || ' ' ||
    COALESCE(m.title->>'es-es', '') || ' ' ||
    COALESCE(array_to_string(m.tags, ' '), '')
  FROM materials WHERE id = m.id
$$;

-- FUNÇÃO: Vectorizar collection
CREATE OR REPLACE FUNCTION get_collection_text_for_embedding(c collections)
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(c.title->>'pt-br', '') || ' ' ||
    COALESCE(c.title->>'en-us', '') || ' ' ||
    COALESCE(c.title->>'es-es', '') || ' ' ||
    COALESCE(array_to_string(c.tags, ' '), '')
  FROM collections WHERE id = c.id
$$;

-- VIEW: Materiais com informações para embedding
CREATE OR REPLACE VIEW materials_for_embedding AS
SELECT 
  m.id,
  m.title,
  m.tags,
  m.type,
  get_material_text_for_embedding(m) as content_text
FROM materials m
WHERE m.active = true;

-- VIEW: Coleções com informações para embedding
CREATE OR REPLACE VIEW collections_for_embedding AS
SELECT 
  c.id,
  c.title,
  c.tags,
  get_collection_text_for_embedding(c) as content_text
FROM collections c
WHERE c.active = true;

-- GRANTs de permissão
GRANT SELECT ON material_embeddings TO anon, authenticated, service_role;
GRANT SELECT ON collection_embeddings TO anon, authenticated, service_role;
GRANT SELECT ON materials_for_embedding TO anon, authenticated, service_role;
GRANT SELECT ON collections_for_embedding TO anon, authenticated, service_role;

-- LOG
DO $$
BEGIN
  RAISE NOTICE 'Embedding tables created successfully';
  RAISE NOTICE 'Para produção: ativar extensão pgvector no PostgreSQL';
END $$;
```

---

## Execução

### Para Supabase (desenvolvimento local)

```bash
# Executar a migration
supabase db push

# Ou colar o conteúdo no SQL Editor do Supabase
```

### Para PostgreSQL (VPS/Produção)

```bash
# Conectar ao banco
psql -h localhost -U postgres -d conexao_hub

# Executar o script
\i migrations/20260510000000_create_embeddings_setup.sql
```

---

## Estrutura Criada

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `material_embeddings` | Armazena vetores de embedding dos materiais |
| `collection_embeddings` | Armazena vetores de embedding das coleções |

### Funções

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `get_material_text_for_embedding(material)` | TEXT | Extrai texto do material (título + tags) |
| `get_collection_text_for_embedding(collections)` | TEXT | Extrai texto da coleção (título + tags) |

### Views

| View | Descrição |
|------|-----------|
| `materials_for_embedding` | Lista materiais ativos com texto para embedding |
| `collections_for_embedding` | Lista coleções ativas com texto para embedding |

---

## Popular Embeddings (Após Execução)

Após criar as tabelas, você precisará popular os embeddings. Em desenvolvimento, o **modo demo** já faz isso automaticamente usando o mockDb.

Em produção, você precisará de um script que:
1. Liste todos os materiais/coleções ativos
2. Gere embeddings para cada um (via n8n ou API)
3. Insira na tabela correspondente

---

## Verificação

Após executar o script, verifique:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%embedding%';

-- Verificar funções
SELECT proname FROM pg_proc WHERE proname LIKE '%embedding%';

-- Verificar views
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public';
```

---

## Próximos Passos

- [Capítulo 04 - Serviço de Chat](./04-servico-chat.md) → Configuração do chatService
- [Capítulo 10 - Fluxo do n8n](./10-fluxo-n8n.md) → Como usar em produção

---

*Manual do Chatbot RAG - Conexão Hub*