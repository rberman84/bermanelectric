-- Create an enum for user roles
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create the user_roles table
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    role app_role not null,
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);

-- Enable Row-Level Security
alter table public.user_roles enable row level security;

-- Create a security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS policies for user_roles table
-- Users can view their own roles
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

-- Only admins can insert roles
create policy "Only admins can insert roles"
on public.user_roles
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

-- Only admins can update roles
create policy "Only admins can update roles"
on public.user_roles
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
create policy "Only admins can delete roles"
on public.user_roles
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));