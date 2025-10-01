-- Drop the public read policy on profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Add policy so users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);