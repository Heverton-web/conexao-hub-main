-- ============================================================
-- 🏆 CONEXÃO HUB - MASTER DATABASE RESET & MIGRATION SCRIPT
-- Versão: 2.2 (Ultra Estabilizada)
-- Descrição: Script inteligente que cria ou atualiza toda a estrutura
-- ============================================================

-- 0. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS (TIPOS)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('client', 'distributor', 'consultant', 'manager', 'super_admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.app_status AS ENUM ('pending', 'active', 'inactive', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.material_type AS ENUM ('pdf', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.app_language AS ENUM ('pt-br', 'en-us', 'es-es');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABELAS PRINCIPAIS

-- SYSTEM_CONFIG
CREATE TABLE IF NOT EXISTS public.system_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  app_name TEXT NOT NULL DEFAULT 'Conexão Hub',
  logo_url TEXT,
  favicon_url TEXT,
  webhook_url TEXT,
  theme_light JSONB NOT NULL DEFAULT '{"background":"#f8fafc","surface":"#ffffff","textMain":"#0f172a","textMuted":"#64748b","border":"#e2e8f0","accent":"#3b82f6","success":"#10b981","warning":"#f59e0b","error":"#ef4444"}',
  theme_dark JSONB NOT NULL DEFAULT '{"background":"#0f172a","surface":"#1e293b","textMain":"#f8fafc","textMuted":"#94a3b8","border":"transparent","accent":"#C9A655","success":"#22c55e","warning":"#eab308","error":"#ef4444"}',
  environment_themes JSONB DEFAULT '{
    "auth": { "colors": { "primary": "#C9A655", "background": "#020617" } },
    "admin": { "colors": { "primary": "#C9A655", "background": "#020617" } },
    "client": { "colors": { "primary": "#C9A655", "background": "#020617" } },
    "manager": { "colors": { "primary": "#C9A655", "background": "#020617" } }
  }',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GARANTIR COLUNAS EM SYSTEM_CONFIG
ALTER TABLE public.system_config ADD COLUMN IF NOT EXISTS environment_themes JSONB DEFAULT '{
    "auth": { "colors": { "primary": "#C9A655", "background": "#020617" } },
    "admin": { "colors": { "primary": "#C9A655", "background": "#020617" } },
    "client": { "colors": { "primary": "#C9A655", "background": "#020617" } },
    "manager": { "colors": { "primary": "#C9A655", "background": "#020617" } }
}';

-- PROFILES (Usuários)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT DEFAULT '',
  cro TEXT,
  role public.app_role NOT NULL DEFAULT 'client',
  status public.app_status NOT NULL DEFAULT 'pending',
  preferences JSONB NOT NULL DEFAULT '{"theme":"dark","language":"pt-br"}',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GARANTIR COLUNAS EM PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role public.app_role DEFAULT 'client';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status public.app_status DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- INVITE_TOKENS
CREATE TABLE IF NOT EXISTS public.invite_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'client',
    created_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- MATERIALS
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB DEFAULT '{}',
  type public.material_type NOT NULL DEFAULT 'pdf',
  allowed_roles public.app_role[] NOT NULL DEFAULT '{client}',
  active BOOLEAN NOT NULL DEFAULT true,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- MATERIAL_ASSETS
CREATE TABLE IF NOT EXISTS public.material_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  language public.app_language NOT NULL DEFAULT 'pt-br',
  url TEXT NOT NULL,
  subtitle_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(material_id, language)
);

-- ACCESS_LOGS
CREATE TABLE IF NOT EXISTS public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BADGES
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.badge_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- CHATBOT
CREATE TABLE IF NOT EXISTS public.chatbot_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enabled BOOLEAN DEFAULT false NOT NULL,
    webhook_url TEXT DEFAULT '',
    allowed_roles TEXT[] DEFAULT ARRAY['client', 'distributor', 'consultant', 'manager'],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FUNÇÕES E TRIGGERS

-- Função para criar perfil automaticamente ao registrar no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Usuário'),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'client'),
    'active' -- Forçamos ativo para testes e primeiro acesso
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = 'active';
  RETURN NEW;
END;
$$;

-- Trigger de criação de usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para perfis
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. SEGURANÇA (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES (Com garantias de que a coluna role existe)
DO $$ BEGIN
    CREATE POLICY "Public Read Config" ON public.system_config FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin Manage Config" ON public.system_config FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. DADOS INICIAIS (SEED)
INSERT INTO public.system_config (id, app_name) 
VALUES (1, 'Conexão Hub')
ON CONFLICT (id) DO NOTHING;

-- Notificar PostgREST para limpar o cache do schema
NOTIFY pgrst, 'reload schema';
