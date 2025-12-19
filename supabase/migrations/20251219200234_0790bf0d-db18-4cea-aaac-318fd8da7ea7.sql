-- Create crew_members table for tracking technicians
CREATE TABLE public.crew_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  home_zip TEXT DEFAULT '11779',
  default_buffer_before_minutes INTEGER DEFAULT 15,
  default_buffer_after_minutes INTEGER DEFAULT 15,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crew_calendar table for appointments
CREATE TABLE public.crew_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_id UUID NOT NULL REFERENCES public.crew_members(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  job_zip TEXT NOT NULL,
  job_length_minutes INTEGER NOT NULL,
  buffer_before_minutes INTEGER DEFAULT 15,
  buffer_after_minutes INTEGER DEFAULT 15,
  travel_minutes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled',
  title TEXT,
  notes TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_calendar ENABLE ROW LEVEL SECURITY;

-- Allow public read access to crew_members (for availability checks)
CREATE POLICY "Anyone can view active crew members" 
ON public.crew_members 
FOR SELECT 
USING (active = true);

-- Allow admins to manage crew_members
CREATE POLICY "Admins can manage crew members" 
ON public.crew_members 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Allow public read access to crew_calendar (for availability checks)
CREATE POLICY "Anyone can view scheduled appointments" 
ON public.crew_calendar 
FOR SELECT 
USING (true);

-- Allow service role to insert appointments (from edge functions)
CREATE POLICY "Service role can insert appointments" 
ON public.crew_calendar 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to manage calendar
CREATE POLICY "Admins can manage calendar" 
ON public.crew_calendar 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Insert default crew member
INSERT INTO public.crew_members (name, email, phone, home_zip) 
VALUES ('Main Crew', 'contact@bermanelectrical.com', '516-361-4068', '11779');

-- Create indexes for performance
CREATE INDEX idx_crew_calendar_crew_id ON public.crew_calendar(crew_id);
CREATE INDEX idx_crew_calendar_start_time ON public.crew_calendar(start_time);
CREATE INDEX idx_crew_calendar_status ON public.crew_calendar(status);