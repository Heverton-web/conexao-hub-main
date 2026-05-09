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