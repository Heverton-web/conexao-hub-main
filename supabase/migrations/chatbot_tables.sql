-- Script para criar tabelas do Chatbot
-- Execute este script no SQL Editor do Supabase

-- ============================================
-- Tabela de Configuração do Chatbot
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enabled BOOLEAN DEFAULT false NOT NULL,
    webhook_url TEXT DEFAULT '',
    allowed_roles TEXT[] DEFAULT ARRAY['client', 'distributor', 'consultant', 'manager'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir registro padrão se não existir
INSERT INTO chatbot_config (enabled, webhook_url, allowed_roles)
SELECT false, '', ARRAY['client', 'distributor', 'consultant', 'manager']
WHERE NOT EXISTS (SELECT 1 FROM chatbot_config LIMIT 1);

-- ============================================
-- Tabela de Logs do Chatbot
-- ============================================
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    materials_found INTEGER DEFAULT 0,
    collections_found INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para consultas por usuário
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);

-- Criar índice para consultas por data
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);

-- ============================================
-- Configuração de Row Level Security (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas admins podem editar configuração do chatbot
CREATE POLICY "Admins can manage chatbot config"
    ON chatbot_config FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'super_admin'
        )
    );

-- Policy: Admins podem ver todos os logs
CREATE POLICY "Admins can view chat logs"
    ON chat_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'super_admin'
        )
    );

-- Policy: Todos os usuários podem criar logs (o sistema insere)
CREATE POLICY "Anyone can insert chat logs"
    ON chat_logs FOR INSERT
    WITH CHECK (true);

-- Policy: Apenas o próprio usuário pode ver seus próprios logs
CREATE POLICY "Users can view own chat logs"
    ON chat_logs FOR SELECT
    USING (user_id = auth.uid());

-- ============================================
-- Função para atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_chatbot_config_updated_at ON chatbot_config;
CREATE TRIGGER update_chatbot_config_updated_at
    BEFORE UPDATE ON chatbot_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verificar criação das tabelas
-- ============================================
SELECT 
    'chatbot_config' as table_name,
    COUNT(*) as row_count
FROM chatbot_config
UNION ALL
SELECT 
    'chat_logs' as table_name,
    COUNT(*) as row_count
FROM chat_logs;