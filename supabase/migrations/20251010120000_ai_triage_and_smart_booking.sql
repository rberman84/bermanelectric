-- Create storage bucket for consented triage images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'triage-consented') THEN
    PERFORM storage.create_bucket('triage-consented', jsonb_build_object('public', false));
  END IF;
END;
$$;

-- AI triage reports table for storing structured outputs
CREATE TABLE IF NOT EXISTS public.ai_triage_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  hazard_level TEXT NOT NULL,
  hazard_summary TEXT,
  likely_cause TEXT,
  urgency_level TEXT NOT NULL,
  urgency_minutes INTEGER,
  next_steps TEXT[] DEFAULT ARRAY[]::TEXT[],
  analysis JSONB,
  consent BOOLEAN DEFAULT FALSE,
  image_path TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  job_zip TEXT,
  job_length_minutes INTEGER,
  travel_minutes INTEGER,
  earliest_slot TIMESTAMPTZ,
  crew_id UUID,
  crew_name TEXT,
  notes TEXT,
  model_latency_ms INTEGER,
  model_used TEXT,
  triage_reference TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_triage_reports_created_at ON public.ai_triage_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_triage_reports_job_zip ON public.ai_triage_reports(job_zip);

ALTER TABLE public.ai_triage_reports ENABLE ROW LEVEL SECURITY;

-- Crew members metadata
CREATE TABLE IF NOT EXISTS public.crew_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  home_zip TEXT,
  default_buffer_before_minutes INTEGER NOT NULL DEFAULT 30,
  default_buffer_after_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_crew_members_updated_at
  BEFORE UPDATE ON public.crew_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Crew calendar of scheduled jobs
CREATE TABLE IF NOT EXISTS public.crew_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_id UUID NOT NULL REFERENCES public.crew_members(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  job_zip TEXT NOT NULL,
  job_length_minutes INTEGER NOT NULL,
  buffer_before_minutes INTEGER NOT NULL DEFAULT 30,
  buffer_after_minutes INTEGER NOT NULL DEFAULT 30,
  travel_minutes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'pending', 'completed', 'cancelled')),
  title TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crew_calendar_crew_time ON public.crew_calendar(crew_id, start_time);
CREATE INDEX IF NOT EXISTS idx_crew_calendar_status ON public.crew_calendar(status);

CREATE TRIGGER update_crew_calendar_updated_at
  BEFORE UPDATE ON public.crew_calendar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_calendar ENABLE ROW LEVEL SECURITY;

-- Pre-seed two core crews if they don't already exist
INSERT INTO public.crew_members (name, email, phone, home_zip, default_buffer_before_minutes, default_buffer_after_minutes)
SELECT v.name, v.email, v.phone, v.home_zip, v.default_buffer_before_minutes, v.default_buffer_after_minutes
FROM (
  VALUES
    ('East Crew', 'dispatch@bermanelectrical.com', '516-361-4068', '11779', 30, 30),
    ('West Crew', 'dispatch@bermanelectrical.com', '516-361-4068', '11727', 30, 30)
) AS v(name, email, phone, home_zip, default_buffer_before_minutes, default_buffer_after_minutes)
WHERE NOT EXISTS (SELECT 1 FROM public.crew_members cm WHERE cm.name = v.name);
