-- Add job completion tracking to service_requests
ALTER TABLE public.service_requests
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS review_requested_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Create customer reviews table
CREATE TABLE public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  review_text TEXT NOT NULL,
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  would_recommend BOOLEAN DEFAULT true,
  photo_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_notes TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on customer_reviews
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_reviews
CREATE POLICY "Users can view approved reviews"
ON public.customer_reviews
FOR SELECT
USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews"
ON public.customer_reviews
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create reviews for their own service requests"
ON public.customer_reviews
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.service_requests 
    WHERE id = service_request_id 
    AND user_id = auth.uid()
    AND status = 'completed'
  )
);

CREATE POLICY "Users can update their own pending reviews"
ON public.customer_reviews
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can update all reviews"
ON public.customer_reviews
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
ON public.customer_reviews
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Storage policies for review photos
CREATE POLICY "Anyone can view review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own review photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'review-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own review photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'review-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for performance
CREATE INDEX idx_customer_reviews_status ON public.customer_reviews(status);
CREATE INDEX idx_customer_reviews_featured ON public.customer_reviews(featured) WHERE featured = true;
CREATE INDEX idx_customer_reviews_service_request ON public.customer_reviews(service_request_id);
CREATE INDEX idx_service_requests_completed ON public.service_requests(completed_at) WHERE completed_at IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER update_customer_reviews_updated_at
BEFORE UPDATE ON public.customer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();