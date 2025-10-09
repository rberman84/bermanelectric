create table if not exists public.faq_suggestions (
  id uuid primary key default gen_random_uuid(),
  page_url text not null,
  query text not null,
  question text not null,
  answer text,
  impressions numeric not null default 0,
  clicks numeric not null default 0,
  ctr numeric not null default 0,
  position numeric not null default 0,
  suggested_at timestamptz not null default now(),
  approved boolean not null default false,
  approved_at timestamptz,
  archived boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  constraint faq_suggestions_page_question_key unique (page_url, question)
);

comment on table public.faq_suggestions is 'Nightly Google Search Console mining for FAQ opportunities.';
comment on column public.faq_suggestions.page_url is 'Absolute URL of the page the FAQ suggestion belongs to.';
comment on column public.faq_suggestions.query is 'Exact Google Search Console query that triggered the impression.';
comment on column public.faq_suggestions.question is 'Human-readable FAQ framing of the search query.';
comment on column public.faq_suggestions.answer is 'Optional editorial answer provided by the CMS team before publishing.';
comment on column public.faq_suggestions.approved is 'True when a human has approved the FAQ for publication.';
comment on column public.faq_suggestions.archived is 'True when a suggestion should never be surfaced again.';

create index if not exists faq_suggestions_page_url_idx on public.faq_suggestions (page_url);
create index if not exists faq_suggestions_status_idx on public.faq_suggestions (approved, archived);

alter table public.faq_suggestions enable row level security;

create policy if not exists "Public can view approved FAQs"
  on public.faq_suggestions
  for select
  using (approved and not archived);

create policy if not exists "Admins manage FAQ suggestions"
  on public.faq_suggestions
  for all
  using (public.has_role(auth.uid(), 'admin'::app_role))
  with check (public.has_role(auth.uid(), 'admin'::app_role));

create policy if not exists "Service role manages FAQ suggestions"
  on public.faq_suggestions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
