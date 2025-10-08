-- Drop overly permissive policies on google_settings
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.google_settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.google_settings;

-- Add admin-only INSERT policy
CREATE POLICY "Only admins can insert settings"
ON public.google_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add admin-only UPDATE policy
CREATE POLICY "Only admins can update settings"
ON public.google_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));