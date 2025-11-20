-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'Thumbtack',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  preferred_contact_method TEXT NOT NULL,
  job_type TEXT NOT NULL,
  job_priority TEXT NOT NULL,
  job_description TEXT NOT NULL,
  budget_range TEXT,
  access_notes TEXT,
  referral_code TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_media table
CREATE TABLE public.lead_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_media ENABLE ROW LEVEL SECURITY;

-- Create policies for leads
CREATE POLICY "Anyone can create leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for lead_media
CREATE POLICY "Anyone can create lead media"
ON public.lead_media
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view all lead media"
ON public.lead_media
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for lead files
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-files', 'lead-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can upload lead files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'lead-files');

CREATE POLICY "Anyone can view lead files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'lead-files');

-- Create trigger for updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();