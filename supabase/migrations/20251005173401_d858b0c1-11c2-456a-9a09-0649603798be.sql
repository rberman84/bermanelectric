-- Create google_reviews table to cache reviews
CREATE TABLE IF NOT EXISTS public.google_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id text NOT NULL UNIQUE,
  author_name text NOT NULL,
  author_photo_url text,
  rating integer NOT NULL,
  text text NOT NULL,
  time integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read reviews (public data)
CREATE POLICY "Reviews are viewable by everyone"
ON public.google_reviews
FOR SELECT
USING (true);

-- Create index on review_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_google_reviews_review_id ON public.google_reviews(review_id);

-- Create index on time for sorting by date
CREATE INDEX IF NOT EXISTS idx_google_reviews_time ON public.google_reviews(time DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON public.google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create settings table to store Google Place ID
CREATE TABLE IF NOT EXISTS public.google_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id text NOT NULL,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Settings are viewable by everyone"
ON public.google_settings
FOR SELECT
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_google_settings_updated_at
  BEFORE UPDATE ON public.google_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();