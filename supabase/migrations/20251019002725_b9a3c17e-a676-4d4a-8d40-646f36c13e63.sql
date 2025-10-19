-- Add explicit write policies to google_reviews table for defense-in-depth
-- These policies document intent and prevent potential misconfigurations

-- Only admins can manually insert reviews
CREATE POLICY "Only admins can insert reviews" 
ON google_reviews FOR INSERT 
TO authenticated 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update reviews for moderation
CREATE POLICY "Only admins can update reviews" 
ON google_reviews FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete reviews
CREATE POLICY "Only admins can delete reviews" 
ON google_reviews FOR DELETE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));