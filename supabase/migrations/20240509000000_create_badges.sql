-- Migration: Create Badges and User Badges tables
-- Description: Sets up the gamification infrastructure for achievements

-- 1. Create Badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- 'material_completed', 'collection_completed', 'points_reached', etc.
    trigger_value INTEGER NOT NULL DEFAULT 0,
    points_reward INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT '#c9a655',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create User Badges table (conjunction table)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 3. Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Badges (Public read, Admin write)
CREATE POLICY "Allow public read on badges" 
ON public.badges FOR SELECT 
USING (true);

CREATE POLICY "Allow admin manage badges" 
ON public.badges FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

-- 5. Policies for User Badges (User read own, System/Admin write)
CREATE POLICY "Allow users to read own badges" 
ON public.user_badges FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow admin manage user badges" 
ON public.user_badges FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

-- 6. Initial Seed (matching mockStore)
INSERT INTO public.badges (name, description, icon_name, trigger_type, trigger_value, points_reward, color)
VALUES 
('Descobridor', 'Abra seu primeiro material', 'star', 'material_completed', 1, 10, '#ffd700'),
('Leitor Compromissado', 'Complete 10 materiais', 'book', 'material_completed', 10, 50, '#6366f1'),
('Mestre do Conhecimento', 'Complete 50 materiais', 'graduation', 'material_completed', 50, 200, '#8b5cf6'),
('Primeiro Passo', 'Complete sua primeira trilha', 'rocket', 'collection_completed', 1, 25, '#f59e0b'),
('Caçador de Trilhas', 'Complete 5 trilhas', 'trophy', 'collection_completed', 5, 100, '#c9a655'),
('Diamante', 'Alcance 1.000 XP', 'diamond', 'points_reached', 1000, 300, '#06b6d4'),
('Líder', 'Fique em 1º lugar no ranking', 'crown', 'ranking_position', 1, 150, '#c9a655'),
('Sequência de Ouro', 'Acesse por 7 dias seguidos', 'flame', 'streak_days', 7, 50, '#ef4444'),
('Veterano', 'Acesse por 30 dias', 'shield', 'streak_days', 30, 150, '#10b981'),
('Colecionador XP', 'Complete 500 materiais', 'stars', 'material_completed', 500, 500, '#ec4899')
ON CONFLICT DO NOTHING;
