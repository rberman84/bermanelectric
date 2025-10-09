-- Create table to store quote engine submissions
create table if not exists public.quote_requests (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    name text,
    email text,
    phone text,
    amps integer not null,
    run_length numeric not null,
    panel_capacity integer not null,
    add_ons jsonb not null default '[]'::jsonb,
    price_low numeric not null,
    price_high numeric not null,
    recommended_cta text not null,
    price_bands jsonb not null,
    session_id text,
    source_page text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    tracking_number text,
    tracking_id text,
    crm_response jsonb,
    email_status jsonb,
    sms_status jsonb
);

alter table public.quote_requests enable row level security;

create policy "Only admins can view quote requests"
    on public.quote_requests
    for select
    using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Only admins can modify quote requests"
    on public.quote_requests
    for all
    using (public.has_role(auth.uid(), 'admin'::public.app_role))
    with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Log tracking sessions for dynamic number insertion (DNI)
create table if not exists public.quote_tracking_sessions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    session_id text not null,
    tracking_number text not null,
    source_page text,
    utm_source text,
    utm_medium text,
    utm_campaign text
);

alter table public.quote_tracking_sessions enable row level security;

create policy "Admins can view tracking sessions"
    on public.quote_tracking_sessions
    for select
    using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can modify tracking sessions"
    on public.quote_tracking_sessions
    for all
    using (public.has_role(auth.uid(), 'admin'::public.app_role))
    with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Store inbound call webhook activity from Twilio
create table if not exists public.call_events (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    call_sid text not null,
    from_number text not null,
    to_number text not null,
    status text not null,
    duration integer,
    auto_sms_sent boolean default false,
    tracking_number text,
    session_id text,
    source_page text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    metadata jsonb
);

alter table public.call_events enable row level security;

create policy "Admins can view call events"
    on public.call_events
    for select
    using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can modify call events"
    on public.call_events
    for all
    using (public.has_role(auth.uid(), 'admin'::public.app_role))
    with check (public.has_role(auth.uid(), 'admin'::public.app_role));
