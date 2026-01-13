-- Create table for saved leads from Firecrawl research
CREATE TABLE public.saved_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  content_preview TEXT,
  source_query TEXT,
  lead_type TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  contact_info JSONB,
  saved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  followed_up_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_lead_url UNIQUE (url)
);

-- Enable RLS
ALTER TABLE public.saved_leads ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all saved leads"
ON public.saved_leads FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert saved leads"
ON public.saved_leads FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update saved leads"
ON public.saved_leads FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete saved leads"
ON public.saved_leads FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_saved_leads_updated_at
BEFORE UPDATE ON public.saved_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for common queries
CREATE INDEX idx_saved_leads_status ON public.saved_leads(status);
CREATE INDEX idx_saved_leads_priority ON public.saved_leads(priority);
CREATE INDEX idx_saved_leads_created_at ON public.saved_leads(created_at DESC);