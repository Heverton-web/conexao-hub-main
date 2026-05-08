-- Create webhooks table
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

-- Create webhook_logs table
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

-- Enable RLS
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webhooks
CREATE POLICY "Admins can manage webhooks"
  ON public.webhooks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users can read webhooks"
  ON public.webhooks FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for webhook_logs
CREATE POLICY "Admins can manage webhook_logs"
  ON public.webhook_logs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users can read webhook_logs"
  ON public.webhook_logs FOR SELECT TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_webhooks_event ON public.webhooks(event);
CREATE INDEX idx_webhook_logs_webhook_id ON public.webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);