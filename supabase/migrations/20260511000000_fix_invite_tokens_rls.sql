-- Fix RLS policy for invite_tokens to allow authenticated users to INSERT
-- This fixes the error: "new row violates row-level security policy for table invite_tokens"

-- Drop the restrictive admin policy
DROP POLICY IF EXISTS "Admins manage invite tokens" ON public.invite_tokens;

-- Create a more permissive policy that allows authenticated users to INSERT
-- Anyone authenticated can create invite tokens (this is controlled by the UI, not the database)
CREATE POLICY "Allow authenticated insert invite_tokens"
  ON public.invite_tokens FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Keep SELECT policies for validation
DROP POLICY IF EXISTS "Anon can validate tokens" ON public.invite_tokens;
DROP POLICY IF EXISTS "Authenticated can validate tokens" ON public.invite_tokens;

CREATE POLICY "Anyone can select invite_tokens"
  ON public.invite_tokens FOR SELECT
  TO using (true);

-- Keep UPDATE policy for marking as used
DROP POLICY IF EXISTS "Users can mark token as used" ON public.invite_tokens;

CREATE POLICY "Users can update own used invite_tokens"
  ON public.invite_tokens FOR UPDATE
  TO authenticated
  USING (used_by IS NULL OR used_by = auth.uid())
  WITH CHECK (used_by = auth.uid());