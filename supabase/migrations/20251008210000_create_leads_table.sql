create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_type text not null default 'contact',
  name text,
  email text,
  phone text,
  service text,
  message text,
  sms_opt_in boolean not null default false,
  tracking_number_id text,
  tracking_number_value text,
  tracking_number_display text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  msclkid text,
  fbclid text,
  landing_page text,
  page_url text,
  referrer text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.leads enable row level security;

grant usage on schema public to anon, authenticated, service_role;

grant select on public.leads to anon, authenticated;

create policy "Only admins can select leads"
  on public.leads
  for select
  using (public.has_role(auth.uid(), 'admin'::app_role));

create policy "Only admins can insert leads"
  on public.leads
  for insert
  with check (public.has_role(auth.uid(), 'admin'::app_role));

comment on table public.leads is 'Marketing and sales leads captured from web forms and internal tools.';
comment on column public.leads.metadata is 'Arbitrary JSON payload with additional lead context (attribution, CRM responses, etc).';
