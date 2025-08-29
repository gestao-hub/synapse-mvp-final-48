create extension if not exists "uuid-ossp";

create table if not exists public.sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  track        text not null check (track in ('comercial','rh','educacional','gestao')),
  scenario     text not null,
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  score        numeric,
  metrics      jsonb,
  transcript   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists set_sessions_updated_at on public.sessions;
create trigger set_sessions_updated_at
before update on public.sessions
for each row execute procedure public.tg_set_updated_at();

alter table public.sessions enable row level security;

drop policy if exists "Sessions: insert own" on public.sessions;
create policy "Sessions: insert own"
on public.sessions for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Sessions: read own" on public.sessions;
create policy "Sessions: read own"
on public.sessions for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Sessions: update own" on public.sessions;
create policy "Sessions: update own"
on public.sessions for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);