-- Fix crew_calendar security issues

-- 1. Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view scheduled appointments" ON public.crew_calendar;

-- 2. Create proper SELECT policy for admins only
CREATE POLICY "Admins can view all calendar entries"
ON public.crew_calendar 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Service role can insert appointments" ON public.crew_calendar;

-- 4. Create proper INSERT policy restricted to service role
-- Note: Edge functions using service role key will bypass RLS entirely,
-- so we don't need an INSERT policy for them. We can add admin insert capability instead.
CREATE POLICY "Admins can insert calendar entries"
ON public.crew_calendar 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));