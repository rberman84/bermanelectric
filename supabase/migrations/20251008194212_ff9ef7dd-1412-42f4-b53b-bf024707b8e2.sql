-- Drop the existing public SELECT policy on google_settings
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.google_settings;

-- Add admin-only SELECT policy
CREATE POLICY "Only admins can view settings"
ON public.google_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to INSERT/UPDATE their settings (for initial setup)
CREATE POLICY "Authenticated users can insert settings"
ON public.google_settings
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update settings"
ON public.google_settings
FOR UPDATE
USING (auth.uid() IS NOT NULL);