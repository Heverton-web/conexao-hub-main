export const generateFullDatabaseSQL = () => `-- ============================================
-- Script Completo do Banco de Dados
-- Conexão Hub - Todas as Tabelas
-- Gerado em: ${new Date().toISOString().slice(0, 10)}
-- ============================================

-- ============================================
-- TABELA: system_config
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text DEFAULT 'Hub Conexão',
  logo_url text,
  webhook_url text,
  theme_dark jsonb DEFAULT '{}',
  theme_mode jsonb DEFAULT '{}',
  environment_themes jsonb DEFAULT '{}',
  show_mock_login_cards boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default config if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.system_config WHERE id = '00000000-0000-0000-0000-000000000001') THEN
    INSERT INTO public.system_config (id, app_name) VALUES ('00000000-0000-0000-0000-000000000001', 'Hub Conexão');
  END IF;
END $$;

-- ============================================
-- TABELA: system_integrations
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gemini_api_key_encrypted text,
  openai_api_key_encrypted text,
  groq_api_key_encrypted text,
  openrouter_api_key_encrypted text,
  supabase_url text,
  supabase_anon_key_encrypted text,
  supabase_publishable_key_encrypted text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.system_integrations) THEN
    INSERT INTO public.system_integrations (id) VALUES (gen_random_uuid());
  END IF;
END $$;

-- ============================================
-- TABELA: profiles (Users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  whatsapp text,
  cro text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'suspended')),
  rejection_reason text,
  points integer DEFAULT 0,
  preferences jsonb DEFAULT '{"theme": "dark", "language": "pt-br"}',
  allowed_types text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TABELA: user_roles
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('client', 'distributor', 'consultant', 'manager', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- ============================================
-- TABELA: materials
-- ============================================
CREATE TABLE IF NOT EXISTS public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('video', 'pdf', 'link', 'article', 'quiz')),
  title jsonb NOT NULL DEFAULT '{"pt-br": "", "en": "", "es": ""}',
  description jsonb DEFAULT '{"pt-br": "", "en": "", "es": ""}',
  thumbnail_url text,
  access_type text DEFAULT 'all' CHECK (access_type IN ('all', 'specific_roles', 'invitation_only')),
  allowed_roles text[],
  order_index integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  xp_reward integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_materials_type ON public.materials(type);
CREATE INDEX idx_materials_status ON public.materials(status);
CREATE INDEX idx_materials_order ON public.materials(order_index);

-- ============================================
-- TABELA: material_assets
-- ============================================
CREATE TABLE IF NOT EXISTS public.material_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES public.materials(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'pt-br',
  url text NOT NULL,
  subtitle_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_material_assets_material ON public.material_assets(material_id);
CREATE INDEX idx_material_assets_language ON public.material_assets(language);

-- ============================================
-- TABELA: collections
-- ============================================
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{"pt-br": "", "en": "", "es": ""}',
  description jsonb DEFAULT '{"pt-br": "", "en": "", "es": ""}',
  thumbnail_url text,
  order_index integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_collections_order ON public.collections(order_index);

-- ============================================
-- TABELA: collection_items
-- ============================================
CREATE TABLE IF NOT EXISTS public.collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
  material_id uuid REFERENCES public.materials(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_collection_items_collection ON public.collection_items(collection_id);
CREATE INDEX idx_collection_items_material ON public.collection_items(material_id);

-- ============================================
-- TABELA: user_progress
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id uuid REFERENCES public.materials(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_user_progress_user_material ON public.user_progress(user_id, material_id);
CREATE INDEX idx_user_progress_status ON public.user_progress(status);

-- ============================================
-- TABELA: access_logs
-- ============================================
CREATE TABLE IF NOT EXISTS public.access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  material_id uuid REFERENCES public.materials(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('view', 'complete', 'download', 'share')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_access_logs_user ON public.access_logs(user_id);
CREATE INDEX idx_access_logs_material ON public.access_logs(material_id);
CREATE INDEX idx_access_logs_created ON public.access_logs(created_at DESC);

-- ============================================
-- TABELA: gamification_levels
-- ============================================
CREATE TABLE IF NOT EXISTS public.gamification_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_points integer DEFAULT 0,
  order_index integer DEFAULT 0,
  color text DEFAULT '#c9a655',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.gamification_levels) THEN
    INSERT INTO public.gamification_levels (name, min_points, order_index, color) VALUES
      ('Iniciante', 0, 1, '#6b7280'),
      ('Aprendiz', 100, 2, '#3b82f6'),
      ('Estudante', 300, 3, '#38bdf8'),
      ('Especialista', 600, 4, '#06b6d4'),
      ('Mestre', 1000, 5, '#10b981'),
      ('Líder', 2000, 6, '#f59e0b'),
      ('Grão-Mestre', 5000, 7, '#ef4444'),
      ('Lendário', 10000, 8, '#c9a655');
  END IF;
END $$;

-- ============================================
-- TABELA: invite_tokens
-- ============================================
CREATE TABLE IF NOT EXISTS public.invite_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('client', 'distributor', 'consultant', 'manager', 'super_admin')),
  expires_at timestamptz NOT NULL,
  used_by uuid REFERENCES public.profiles(id),
  used_at timestamptz,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_invite_tokens_token ON public.invite_tokens(token);
CREATE INDEX idx_invite_tokens_used ON public.invite_tokens(used_by);

-- ============================================
-- TABELA: webhooks
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  event text NOT NULL,
  event_filter jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhooks_event ON public.webhooks(event);

-- ============================================
-- TABELA: badges
-- ============================================
CREATE TABLE IF NOT EXISTS public.badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon_name text,
  trigger_type text NOT NULL,
  trigger_value integer NOT NULL DEFAULT 1,
  points_reward integer NOT NULL DEFAULT 0,
  color text DEFAULT '#c9a655',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABELA: user_badges
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id text REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);

-- Inserir badges iniciais
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.badges) THEN
    INSERT INTO public.badges (id, name, description, icon_name, trigger_type, trigger_value, points_reward, color) VALUES
      ('badge-1', 'Descobridor', 'Abra seu primeiro material', 'star', 'material_completed', 1, 10, '#ffd700'),
      ('badge-2', 'Leitor Compromissado', 'Complete 10 materiais', 'book', 'material_completed', 10, 50, '#0ea5e9'),
      ('badge-3', 'Mestre do Conhecimento', 'Complete 50 materiais', 'graduation', 'material_completed', 50, 200, '#38bdf8'),
      ('badge-4', 'Primeiro Passo', 'Complete sua primeira trilha', 'rocket', 'collection_completed', 1, 25, '#f59e0b'),
      ('badge-5', 'Caçador de Trilhas', 'Complete 5 trilhas', 'trophy', 'collection_completed', 5, 100, '#c9a655'),
      ('badge-6', 'Diamante', 'Alcance 1.000 XP', 'diamond', 'points_reached', 1000, 300, '#06b6d4'),
      ('badge-7', 'Líder', 'Fique em 1º lugar no ranking', 'crown', 'ranking_position', 1, 150, '#c9a655'),
      ('badge-8', 'Sequência de Ouro', 'Acesse por 7 dias seguidos', 'flame', 'streak_days', 7, 50, '#ef4444'),
      ('badge-9', 'Veterano', 'Acesse por 30 dias', 'shield', 'streak_days', 30, 150, '#10b981'),
      ('badge-10', 'Colecionador XP', 'Complete 500 materiais', 'stars', 'material_completed', 500, 500, '#0284c7');
  END IF;
END $$;

-- ============================================
-- TABELA: webhook_logs
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES public.webhooks(id) ON DELETE CASCADE,
  event text NOT NULL,
  payload jsonb DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('success', 'error')),
  response_code int,
  response_body text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_logs_webhook ON public.webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created ON public.webhook_logs(created_at DESC);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY
-- ============================================

-- system_config
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage system_config" ON public.system_config FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Read system_config" ON public.system_config FOR SELECT TO authenticated USING (true);

-- system_integrations
ALTER TABLE public.system_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage system_integrations" ON public.system_integrations FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Read system_integrations" ON public.system_integrations FOR SELECT TO authenticated USING (true);

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'manager'));

-- user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read user_roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage user_roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- materials
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read materials" ON public.materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage materials" ON public.materials FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- material_assets
ALTER TABLE public.material_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read material_assets" ON public.material_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage material_assets" ON public.material_assets FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read collections" ON public.collections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage collections" ON public.collections FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- collection_items
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read collection_items" ON public.collection_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage collection_items" ON public.collection_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own progress" ON public.user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own progress" ON public.user_progress FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read progress" ON public.user_progress FOR SELECT TO authenticated USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'manager'));

-- access_logs
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own logs" ON public.access_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage access_logs" ON public.access_logs FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'manager'));

-- gamification_levels
ALTER TABLE public.gamification_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read gamification_levels" ON public.gamification_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage gamification_levels" ON public.gamification_levels FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- invite_tokens
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read invite_tokens" ON public.invite_tokens FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage invite_tokens" ON public.invite_tokens FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- webhooks
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read webhooks" ON public.webhooks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage webhooks" ON public.webhooks FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- webhook_logs
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read webhook_logs" ON public.webhook_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage webhook_logs" ON public.webhook_logs FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));

-- ============================================
-- FIM DO SCRIPT
-- ============================================
`;

export default generateFullDatabaseSQL;