-- Create system_integrations table
CREATE TABLE IF NOT EXISTS public.system_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- LLM API Keys (encrypted)
  gemini_api_key_encrypted text,
  openai_api_key_encrypted text,
  groq_api_key_encrypted text,
  openrouter_api_key_encrypted text,
  
  -- LLM Function Assignment (translate, image, summarize, chatbot)
  gemini_function text DEFAULT 'translate',
  openai_function text DEFAULT 'image',
  groq_function text DEFAULT 'summarize',
  openrouter_function text DEFAULT 'chatbot',
  
  -- LLM Active Status (for cost control)
  gemini_active boolean DEFAULT true,
  openai_active boolean DEFAULT true,
  groq_active boolean DEFAULT true,
  openrouter_active boolean DEFAULT true,
  
  -- Supabase Credentials
  supabase_url text,
  supabase_anon_key_encrypted text,
  supabase_publishable_key_encrypted text,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default record (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.system_integrations) THEN
    INSERT INTO public.system_integrations (id) VALUES (gen_random_uuid());
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.system_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only super_admin can manage
CREATE POLICY "Admins can manage system_integrations"
  ON public.system_integrations FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users can read system_integrations"
  ON public.system_integrations FOR SELECT TO authenticated
  USING (true);

-- Create index for performance
CREATE INDEX idx_system_integrations_id ON public.system_integrations(id);