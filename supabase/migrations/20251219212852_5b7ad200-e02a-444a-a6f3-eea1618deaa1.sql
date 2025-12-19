-- Fix remaining security warnings

-- =============================================
-- 1. SECURE LEAD-FILES STORAGE BUCKET
-- =============================================

-- Make bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'lead-files';

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view lead files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload lead files" ON storage.objects;

-- Create admin-only view policy for lead files
CREATE POLICY "Admins can view lead files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'lead-files' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow public uploads to lead-files (needed for lead intake form)
CREATE POLICY "Anyone can upload lead files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lead-files');

-- =============================================
-- 2. SECURE REVIEW-PHOTOS STORAGE BUCKET
-- =============================================

-- Make bucket private (approved photos will be served via signed URLs)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'review-photos';

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view review photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload review photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload review photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view review photos" ON storage.objects;

-- Create admin-only view policy for review photos
CREATE POLICY "Admins can view review photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'review-photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated users to upload review photos
CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-photos' AND
  auth.uid() IS NOT NULL
);

-- =============================================
-- 3. RESTRICT CREW_MEMBERS PII EXPOSURE
-- =============================================

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view active crew members" ON public.crew_members;

-- Create admin-only view policy (edge functions use service role, so they bypass RLS)
CREATE POLICY "Admins can view crew members"
ON public.crew_members 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));